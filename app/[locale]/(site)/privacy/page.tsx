import type { Metadata } from "next"
import { PolicyPage } from "@/components/pages/policy-page"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    path: "/privacy",
    locale,
    title: "Privacy Policy",
    description: "Read Image Banana's privacy policy and how we collect, use, and protect your data.",
  })
}

export default function Page() {
  return (
    <PolicyPage title="Privacy Policy">
      <div className="space-y-4 text-sm leading-6">
        <p className="text-muted-foreground">Last updated: January 14, 2026</p>

        <p>
          Image Banana is an AI image editing service powered by google AI models. This policy explains how we handle
          your data across our website, widgets, and APIs (together, the “Services”).
        </p>

        <h2 className="text-base font-semibold">Data We Collect</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Account data: email, name, and Supabase user ID.</li>
          <li>Usage data: cookies, device info, IP, and interaction logs.</li>
          <li>Content data: images you upload and AI-generated outputs (only to provide and improve the Services).</li>
        </ul>

        <h2 className="text-base font-semibold">How We Use Data</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Operate the Services, deliver generations, and provide support.</li>
          <li>Billing, fraud prevention, and abuse detection.</li>
          <li>Product improvement and service analytics.</li>
        </ul>
        <p className="text-muted-foreground">
          Legal bases (where applicable): contract performance, legitimate interests, and consent.
        </p>

        <h2 className="text-base font-semibold">Retention</h2>
        <p>We keep personal data only as long as needed for the purposes above or to meet legal/defense requirements.</p>

        <h2 className="text-base font-semibold">Security</h2>
        <p>
          We apply administrative, technical, and physical safeguards consistent with Hong Kong PDPO expectations,
          including access controls, encryption in transit, and incident response playbooks.
        </p>

        <h2 className="text-base font-semibold">International Transfers</h2>
        <p>
          Data may be processed in Hong Kong and other jurisdictions. Where required, we use contractual protections or
          equivalent safeguards.
        </p>

        <h2 className="text-base font-semibold">Your Rights</h2>
        <p>
          Subject to local law (e.g., GDPR/CCPA), you may request access, correction, deletion, restriction, portability,
          or withdraw consent. Contact us to exercise these rights.
        </p>

        <h2 className="text-base font-semibold">Children</h2>
        <p>Our Services are not directed to children under 16. If we learn we collected such data, we delete it.</p>

        <h2 className="text-base font-semibold">Changes</h2>
        <p>We will update this page for material changes and revise the “Last updated” date.</p>

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
