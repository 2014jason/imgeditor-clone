import type { Metadata } from "next"
import { CompareFluxKontextPage } from "@/components/pages/compare-flux-kontext-page"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  path: "/compare/flux-kontext",
  title: "Image Banana vs Flux Kontext",
  description:
    "A practical comparison guide: test the same prompts and reference images to evaluate identity consistency, scene preservation, and one-shot edits.",
})

export default function Page() {
  return <CompareFluxKontextPage />
}

