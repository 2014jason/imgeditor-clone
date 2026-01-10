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
  await supabase.auth.signOut()

  return NextResponse.redirect(`${origin}${next}`)
}

