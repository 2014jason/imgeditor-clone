import { redirect } from "next/navigation"
import { GeneratorPage } from "@/components/pages/generator-page"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function Page() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    redirect(`/auth/login?next=${encodeURIComponent("/generator")}`)
  }

  return <GeneratorPage />
}
