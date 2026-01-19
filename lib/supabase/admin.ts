import { createClient } from "@supabase/supabase-js"
import { getSupabaseConfig } from "@/lib/supabase/config"

let adminClient: ReturnType<typeof createClient> | null = null

export function createSupabaseAdminClient() {
  if (adminClient) return adminClient

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY. Set it in .env.local for server-side billing/webhook writes.")
  }

  const { url } = getSupabaseConfig()

  adminClient = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })

  return adminClient
}

