import { PolicyPage } from "@/components/pages/policy-page"

export default function Page() {
  return (
    <PolicyPage title="Refund Application">
      <p className="text-sm text-muted-foreground">
        Please contact support to request a refund.
      </p>
      <p className="mt-4 text-sm">
        Email:{" "}
        <a className="underline underline-offset-4" href="mailto:support@imgeditor.co">
          support@imgeditor.co
        </a>
      </p>
    </PolicyPage>
  )
}

