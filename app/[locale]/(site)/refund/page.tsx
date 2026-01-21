import type { Metadata } from "next"
import { PolicyPage } from "@/components/pages/policy-page"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    path: "/refund",
    locale,
    title: "Refund Policy",
    description:
      "Learn when refunds are available for Image Banana subscriptions and credit packs and how to request one.",
  })
}

export default function Page() {
  return (
    <PolicyPage title="Refund Policy">
      <div className="space-y-4 text-sm leading-6">
        <p className="text-muted-foreground">Last updated: January 14, 2026</p>

        <h2 className="text-base font-semibold">Scope</h2>
        <p>Applies to subscriptions and one-time credit packs purchased through Image Banana.</p>

        <h2 className="text-base font-semibold">Eligibility Window</h2>
        <p>Refunds may be requested within 7 days of purchase and only if less than 50% of the purchased credits/usage has been consumed.</p>

        <h2 className="text-base font-semibold">Not Eligible</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Requests after 7 days.</li>
          <li>Usage exceeding 50% of the purchased allowance.</li>
          <li>Accounts violating the Terms of Service or abusing refunds.</li>
        </ul>

        <h2 className="text-base font-semibold">How to Apply</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            Email{" "}
            <a className="underline underline-offset-4" href="mailto:support@my-nano-banana.com">
              support@my-nano-banana.com
            </a>{" "}
            with order/transaction ID and reason.
          </li>
          <li>Provide supporting screenshots or logs if requested.</li>
          <li>We aim to acknowledge within 2–3 business days.</li>
        </ol>

        <h2 className="text-base font-semibold">Processing</h2>
        <p>Once approved, refunds are issued to the original payment method within 5–7 business days. If that is not possible, we may offer account credit or subscription extension.</p>

        <h2 className="text-base font-semibold">Changes</h2>
        <p>We may update this policy and will post changes here with a revised date.</p>

        <h2 className="text-base font-semibold">Contact</h2>
        <p>
          Email:{" "}
          <a className="underline underline-offset-4" href="mailto:support@my-nano-banana.com">
            support@my-nano-banana.com
          </a>
        </p>
      </div>
    </PolicyPage>
  )
}
