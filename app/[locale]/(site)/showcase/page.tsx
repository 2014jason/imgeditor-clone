import type { Metadata } from "next"
import { ShowcasePage } from "@/components/pages/showcase-page"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    path: "/showcase",
    locale,
    title: "Showcase",
    description:
      "Explore before-and-after AI edits and example prompts. Try Image Banana's image editor on real photos.",
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <ShowcasePage locale={locale} />
}
