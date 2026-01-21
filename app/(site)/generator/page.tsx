import type { Metadata } from "next"
import { GeneratorPage } from "@/components/pages/generator-page"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  path: "/generator",
  title: "AI Image Editor",
  description:
    "Edit images with natural-language prompts. Upload a photo, describe changes, and get fast, consistent results with Image Banana.",
})

export default function Page() {
  return <GeneratorPage />
}
