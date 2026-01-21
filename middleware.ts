import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n"

function getCanonicalBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? null
  if (!raw) return null
  try {
    return new URL(raw)
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const originalUrl = request.nextUrl
  const pathname = originalUrl.pathname
  const firstSegment = pathname.split("/")[1]

  const canonicalBaseUrl = getCanonicalBaseUrl()
  const shouldEnforceCanonicalHost =
    process.env.ENFORCE_CANONICAL_HOST === "1" ||
    (process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : process.env.NODE_ENV === "production")

  const isLocalHost = originalUrl.hostname === "localhost" || originalUrl.hostname === "127.0.0.1"

  // Combine canonical domain/protocol + `/en/* -> /*` into a single redirect to avoid redirect chains.
  const redirectUrl = originalUrl.clone()
  let needsRedirect = false

  // 1) Canonicalize default locale: `/en/...` -> `/...`
  if (firstSegment === DEFAULT_LOCALE) {
    const stripped = pathname.replace(new RegExp(`^/${DEFAULT_LOCALE}(/|$)`), "/")
    redirectUrl.pathname = stripped === "" ? "/" : stripped
    needsRedirect = true
  }

  // 2) Canonicalize host + protocol when a canonical base URL is configured.
  if (!isLocalHost && shouldEnforceCanonicalHost && canonicalBaseUrl) {
    const reqHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host")
    const reqProto = request.headers.get("x-forwarded-proto") ?? redirectUrl.protocol.replace(":", "")

    const canonicalHost = canonicalBaseUrl.host
    const canonicalProto = canonicalBaseUrl.protocol.replace(":", "")

    if (reqHost && reqHost !== canonicalHost) {
      redirectUrl.host = canonicalHost
      needsRedirect = true
    }
    if (reqProto && reqProto !== canonicalProto) {
      redirectUrl.protocol = canonicalBaseUrl.protocol
      needsRedirect = true
    }
  }

  if (needsRedirect) {
    return NextResponse.redirect(redirectUrl, 308)
  }

  const locale = isLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-locale", locale)
  requestHeaders.set("x-canonical-url", `${request.nextUrl.origin}${pathname}`)

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) return response

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value)
        }

        response = NextResponse.next({
          request: { headers: requestHeaders },
        })

        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options)
        }
      },
    },
  })

  await supabase.auth.getUser()
  return response
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
