import type { Metadata } from "next"
import { PromptsPage } from "@/components/pages/prompts-page"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    path: "/prompts",
    locale,
    title: "Prompt Library",
    description: "Curated prompt templates for common AI image editing tasks. One click to try in the editor.",
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <PromptsPage locale={locale} />
}

