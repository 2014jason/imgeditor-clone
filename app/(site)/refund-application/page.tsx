import type { Metadata } from "next"
import { PolicyPage } from "@/components/pages/policy-page"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  path: "/refund-application",
  title: "Refund Application",
  description:
    "How to submit a refund request to Image Banana, including required order details and contact information.",
})

export default function Page() {
  return (
    <PolicyPage title="Refund Application">
      <div className="space-y-4 text-sm leading-6">
        <p className="text-muted-foreground">Last updated: January 14, 2026</p>

        <p>
          Please submit your refund request within 7 days of purchase and only if less than 50% of the purchased
          allowance has been used.
        </p>

        <ol className="list-decimal list-inside space-y-1">
          <li>
            Send an email to{" "}
            <a className="underline underline-offset-4" href="mailto:support@my-nano-banana.com">
              support@my-nano-banana.com
            </a>
            .
          </li>
          <li>Include your order/transaction ID and the reason for the request.</li>
          <li>Attach screenshots or logs if available.</li>
        </ol>

        <p>We aim to reply within 2–3 business days. Approved refunds are processed per the Refund Policy.</p>

        <p className="font-medium">
          Contact:{" "}
          <a className="underline underline-offset-4" href="mailto:support@my-nano-banana.com">
            support@my-nano-banana.com
          </a>
        </p>
      </div>
    </PolicyPage>
  )
}
