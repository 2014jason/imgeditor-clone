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
  const next = getSafeNextPath(searchParams.get("next"))

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      skipBrowserRedirect: true,
    },
  })

  if (error || !data?.url) {
    const withError = addQueryParam(next, "auth_error", "oauth_start_failed")
    return NextResponse.redirect(`${origin}${withError}`)
  }

  return NextResponse.redirect(data.url)
}
