import Link from "next/link"
import { Scissors } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { withLocale } from "@/lib/i18n"

export function ToolsPage({ locale }: { locale?: string }) {
  const tools = [
    {
      title: "AI Background Remover",
      description: "Remove backgrounds and export transparent PNGs for product photos, portraits, and thumbnails.",
      href: "/tools/background-remover",
      badge: "Free",
      icon: Scissors,
    },
  ] as const

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">Tools</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Quick, purpose-built tools to improve your images. Use them standalone, or jump into the full editor for advanced edits.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((t) => (
            <Card key={t.href} className="border-border">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <t.icon className="h-8 w-8 text-accent-foreground dark:text-yellow-500" />
                    <CardTitle className="text-lg">{t.title}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200"
                  >
                    {t.badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href={withLocale(t.href, locale)}>Open</Link>
                </Button>
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href={withLocale("/generator", locale)}>Full Editor</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
