import { ShowcasePage } from "@/components/pages/showcase-page"

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <ShowcasePage locale={locale} />
}
