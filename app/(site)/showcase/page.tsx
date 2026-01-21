import type { Metadata } from "next"
import { ShowcasePage } from "@/components/pages/showcase-page"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  path: "/showcase",
  title: "Showcase",
  description:
    "Explore before-and-after AI edits and example prompts. Try Image Banana's image editor on real photos.",
})

export default function Page() {
  return <ShowcasePage />
}
