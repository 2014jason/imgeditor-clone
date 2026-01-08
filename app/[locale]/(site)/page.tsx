import { HomePage } from "@/components/pages/home-page"

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <HomePage locale={locale} />
}
