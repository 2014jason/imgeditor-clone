import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

function getSafeNextPath(nextPath: string | null) {
  if (!nextPath) return "/"
  if (!nextPath.startsWith("/")) return "/"
  if (nextPath.startsWith("//")) return "/"
  return nextPath
}

function addQueryParam(pathnameWithSearch: string, key: string, value: string) {
  try {
    const url = new URL(pathnameWithSearch, "http://local")
    url.searchParams.set(key, value)
    return `${url.pathname}${url.search}`
  } catch {
    return pathnameWithSearch
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = getSafeNextPath(searchParams.get("next"))

  const oauthError = searchParams.get("error")
  const oauthErrorDescription = searchParams.get("error_description")

  if (oauthError) {
    const withError = addQueryParam(next, "auth_error", oauthError)
    const withDescription =
      oauthErrorDescription && oauthErrorDescription.length > 0
        ? addQueryParam(withError, "auth_error_description", oauthErrorDescription.slice(0, 200))
        : withError
    return NextResponse.redirect(`${origin}${withDescription}`)
  }

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      const withError = addQueryParam(next, "auth_error", "exchange_failed")
      return NextResponse.redirect(`${origin}${withError}`)
    }
  } else {
    const withError = addQueryParam(next, "auth_error", "missing_code")
    return NextResponse.redirect(`${origin}${withError}`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
