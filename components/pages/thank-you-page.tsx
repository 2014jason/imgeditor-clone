import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { withLocale } from "@/lib/i18n"

export function ThankYouPage({ locale }: { locale?: string }) {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Payment successful</CardTitle>
            <CardDescription>
              Thanks for your purchase. If you don’t see your access right away, give it a minute for webhook processing.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href={withLocale("/generator", locale)}>Go to Image Editor</Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href={withLocale("/pricing", locale)}>Back to Pricing</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

