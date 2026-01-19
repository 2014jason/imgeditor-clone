import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getEntitlements } from "@/lib/billing"

export const runtime = "nodejs"

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

function getDebugUserId(req: Request) {
  if (process.env.DEV_BYPASS_AUTH !== "1") return null
  const candidate = req.headers.get("x-debug-user-id") ?? process.env.DEV_BYPASS_USER_ID ?? null
  if (!candidate) return null
  return isUuid(candidate) ? candidate : null
}

export async function GET(req: Request) {
  const debugUserId = getDebugUserId(req)
  if (debugUserId) {
    const entitlements = await getEntitlements(debugUserId)
    return NextResponse.json(entitlements, { status: 200 })
  }

  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) {
      return NextResponse.json({ error: "auth_required" }, { status: 401 })
    }

    const entitlements = await getEntitlements(data.user.id)
    return NextResponse.json(entitlements, { status: 200 })
  } catch {
    return NextResponse.json(
      {
        error:
          "Authentication is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
      },
      { status: 500 },
    )
  }
}

