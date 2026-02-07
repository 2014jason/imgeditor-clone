import type { Metadata } from "next"
import { ThankYouPage } from "@/components/pages/thank-you-page"

export const metadata: Metadata = {
  title: "Payment successful",
  description: "Thanks for your purchase.",
  robots: {
    index: false,
    follow: true,
  },
}

export default function Page() {
  return <ThankYouPage />
}
