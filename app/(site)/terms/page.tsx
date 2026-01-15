import { PolicyPage } from "@/components/pages/policy-page"

export default function Page() {
  return (
    <PolicyPage title="Terms of Service">
      <div className="space-y-4 text-sm leading-6">
        <p className="text-muted-foreground">Last updated: January 14, 2026</p>

        <p>
          These Terms govern your use of image banana (“Service”), an AI image editing product powered by google AI
          models. By using the Service you accept these Terms and our Privacy Policy.
        </p>

        <h2 className="text-base font-semibold">Accounts & Eligibility</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>You must have legal capacity to contract; if acting for an organization, you confirm you are authorized.</li>
          <li>Keep credentials secure and notify us of any unauthorized use.</li>
        </ul>

        <h2 className="text-base font-semibold">Subscriptions & Billing</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Subscriptions are prepaid monthly or yearly and renew automatically unless canceled before renewal.</li>
          <li>You must provide accurate billing information and maintain a valid payment method.</li>
        </ul>

        <h2 className="text-base font-semibold">Refunds</h2>
        <p>
          Standard policy: subscription fees are non‑refundable except where required by law. See the Refund Policy for
          details on eligibility and process.
        </p>

        <h2 className="text-base font-semibold">User Content</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>You retain rights to content you upload and outputs generated.</li>
          <li>You grant us a limited license to process and store content to operate and improve the Service.</li>
          <li>You warrant your content is lawful, non-infringing, and complies with these Terms.</li>
        </ul>

        <h2 className="text-base font-semibold">Prohibited Use</h2>
        <p>
          No illegal activity, harassment, IP infringement, malware, spam, impersonation, or harmful/disallowed content.
          Violations may lead to suspension or termination.
        </p>

        <h2 className="text-base font-semibold">AI Output Disclaimer</h2>
        <p>
          AI results may be inaccurate or contain artifacts. You are responsible for reviewing outputs and ensuring any
          commercial use complies with applicable law.
        </p>

        <h2 className="text-base font-semibold">Termination</h2>
        <p>
          We may suspend or terminate for breach or risk to the Service; you may stop using the Service at any time.
          Certain clauses (e.g., liability limits, IP, indemnity) survive termination.
        </p>

        <h2 className="text-base font-semibold">Governing Law</h2>
        <p>These Terms are governed by Hong Kong law, with exclusive jurisdiction of Hong Kong courts.</p>

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
