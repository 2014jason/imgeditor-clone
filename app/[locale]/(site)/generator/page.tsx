import type { Metadata } from "next"
import { GeneratorPage } from "@/components/pages/generator-page"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    path: "/generator",
    locale,
    title: "AI Image Editor",
    description:
      "Edit images with natural-language prompts. Upload a photo, describe changes, and get fast, consistent results with Image Banana.",
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <GeneratorPage locale={locale} />
}
