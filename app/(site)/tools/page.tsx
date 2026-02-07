import type { Metadata } from "next"
import { ToolsPage } from "@/components/pages/tools-page"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  path: "/tools",
  title: "Tools",
  description: "Free image tools like background removal. Fast workflows, transparent PNG exports, and more.",
})

export default function Page() {
  return <ToolsPage />
}

