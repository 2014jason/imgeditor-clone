import type { Metadata } from "next"
import { PromptsPage } from "@/components/pages/prompts-page"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  path: "/prompts",
  title: "Prompt Library",
  description: "Curated prompt templates for common AI image editing tasks. One click to try in the editor.",
})

export default function Page() {
  return <PromptsPage />
}

