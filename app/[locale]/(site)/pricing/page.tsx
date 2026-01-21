import type { Metadata } from "next"
import { PricingPage } from "@/components/pages/pricing-page"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    path: "/pricing",
    locale,
    title: "Pricing",
    description:
      "Compare Image Banana plans and credits. Choose monthly or yearly pricing for AI image editing and generation.",
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <PricingPage locale={locale} />
}
