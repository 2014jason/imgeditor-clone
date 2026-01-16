import { GeneratorPage } from "@/components/pages/generator-page"

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <GeneratorPage locale={locale} />
}
