import type { Metadata } from "next"
import { ToolsPage } from "@/components/pages/tools-page"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    path: "/tools",
    locale,
    title: "Tools",
    description: "Free image tools like background removal. Fast workflows, transparent PNG exports, and more.",
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <ToolsPage locale={locale} />
}

