type SupabaseConfig = {
  url: string
  anonKey: string
}

export function getSupabaseConfigOptional(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) return null
  return { url, anonKey }
}

export function getSupabaseConfig(): SupabaseConfig {
  const config = getSupabaseConfigOptional()
  if (!config) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    )
  }

  return config
}
