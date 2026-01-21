import type { Metadata } from "next"
import { HomePage } from "@/components/pages/home-page"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  path: "/",
})

export default function Home() {
  return <HomePage />
}
