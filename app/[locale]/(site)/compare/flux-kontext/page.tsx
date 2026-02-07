import type { Metadata } from "next"
import { CompareFluxKontextPage } from "@/components/pages/compare-flux-kontext-page"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    path: "/compare/flux-kontext",
    locale,
    title: "Image Banana vs Flux Kontext",
    description:
      "A practical comparison guide: test the same prompts and reference images to evaluate identity consistency, scene preservation, and one-shot edits.",
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <CompareFluxKontextPage locale={locale} />
}

