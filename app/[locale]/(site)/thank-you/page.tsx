import { ThankYouPage } from "@/components/pages/thank-you-page"

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <ThankYouPage locale={locale} />
}

