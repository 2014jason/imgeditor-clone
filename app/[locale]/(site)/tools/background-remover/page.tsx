import type { Metadata } from "next"
import { BackgroundRemoverPage } from "@/components/pages/background-remover-page"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    path: "/tools/background-remover",
    locale,
    title: "AI Background Remover",
    description:
      "Remove backgrounds from images in seconds. Export transparent PNGs for products, portraits, and social posts.",
  })
}

export default function Page() {
  return <BackgroundRemoverPage />
}
