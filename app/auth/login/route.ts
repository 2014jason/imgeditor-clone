import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

function getSafeNextPath(nextPath: string | null) {
  if (!nextPath) return "/"
  if (!nextPath.startsWith("/")) return "/"
  if (nextPath.startsWith("//")) return "/"
  return nextPath
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
    return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(data.url)
}

