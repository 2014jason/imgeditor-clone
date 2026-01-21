import type { Metadata } from "next"
import { HomePage } from "@/components/pages/home-page"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    path: "/",
    locale,
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <HomePage locale={locale} />
}
