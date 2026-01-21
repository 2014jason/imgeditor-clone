import type { Metadata } from "next"
import { PricingPage } from "@/components/pages/pricing-page"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  path: "/pricing",
  title: "Pricing",
  description:
    "Compare Image Banana plans and credits. Choose monthly or yearly pricing for AI image editing and generation.",
})

export default function Page() {
  return <PricingPage />
}
