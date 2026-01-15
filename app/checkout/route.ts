import { NextResponse } from "next/server"
import { Checkout } from "@creem_io/nextjs"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

const apiKey = process.env.CREEM_API_KEY

function sanitizeNextPath(path: string | null) {
  if (!path) return null
  try {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      const url = new URL(path)
      return `${url.pathname}${url.search}`
    }
  } catch {
    // ignore invalid absolute URLs
  }
  if (!path.startsWith("/")) return null
  if (path.startsWith("//")) return null
  return path
}

function getNextPath(request: Request) {
  const { searchParams } = new URL(request.url)
  const fromQuery = sanitizeNextPath(searchParams.get("next"))
  if (fromQuery) return fromQuery

  const referer = request.headers.get("referer")
  if (referer) {
    try {
      const url = new URL(referer)
      const fromReferer = sanitizeNextPath(`${url.pathname}${url.search}`)
      if (fromReferer) return fromReferer
    } catch {
      // ignore bad referer
    }
  }

  return "/pricing"
}

const checkoutHandler =
  apiKey &&
  Checkout({
    apiKey,
    testMode: false,
    defaultSuccessUrl: "/thank-you",
  })

export const GET = apiKey
  ? async (request: Request, context: unknown) => {
      const origin = new URL(request.url).origin
      const loginPath = getNextPath(request)
      const loginUrl = `${origin}/auth/login?next=${encodeURIComponent(loginPath)}`

      try {
        const supabase = await createSupabaseServerClient()
        const { data, error } = await supabase.auth.getUser()
        if (error || !data.user) {
          return NextResponse.redirect(loginUrl)
        }
      } catch {
        return NextResponse.json(
          {
            error:
              "Authentication is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
          },
          { status: 500 },
        )
      }

      if (!checkoutHandler) {
        return NextResponse.json(
          { error: "Missing CREEM_API_KEY. Add it to .env.local and restart the dev server." },
          { status: 500 },
        )
      }

      return checkoutHandler(request, context as any)
    }
  : async () => {
      return NextResponse.json(
        { error: "Missing CREEM_API_KEY. Add it to .env.local and restart the dev server." },
        { status: 500 },
      )
    }
