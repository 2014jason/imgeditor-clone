import type { Metadata } from "next"
import { ThankYouPage } from "@/components/pages/thank-you-page"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Payment successful",
    description: "Thanks for your purchase.",
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <ThankYouPage locale={locale} />
}
