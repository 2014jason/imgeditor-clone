import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { withLocale } from "@/lib/i18n"
import type { PromptTemplate } from "@/lib/prompt-library"

function buildGeneratorHref({ prompt, mode, locale }: { prompt: string; mode: PromptTemplate["mode"]; locale?: string }) {
  const params = new URLSearchParams()
  params.set("prompt", prompt)
  params.set("type", mode)
  return withLocale(`/generator?${params.toString()}`, locale)
}

export function PromptTemplatePage({
  template,
  related,
  locale,
}: {
  template: PromptTemplate
  related: PromptTemplate[]
  locale?: string
}) {
  const steps =
    template.mode === "image-to-image"
      ? ["Upload a reference image.", "Paste or tweak the prompt below.", "Click Generate and iterate if needed."]
      : ["Paste or tweak the prompt below.", "Click Generate.", "Iterate with small changes for better results."]

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200">
              Prompt Template
            </Badge>
            <Badge variant="outline">{template.category}</Badge>
            <Badge variant="outline">{template.mode === "image-to-image" ? "Image to Image" : "Text to Image"}</Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">{template.title}</h1>
          <p className="text-sm md:text-base text-muted-foreground">{template.description}</p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href={buildGeneratorHref({ prompt: template.prompt, mode: template.mode, locale })}>
                Try in Image Banana <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href={withLocale("/prompts", locale)}>Back to Library</Link>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Steps</CardTitle>
              <CardDescription>Use this quick flow for best results.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <ol className="list-decimal list-inside space-y-2">
                {steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Tips</CardTitle>
              <CardDescription>Small details that improve consistency.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="list-disc list-inside space-y-2">
                {template.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Prompt</h2>
          <div className="rounded-xl border border-border bg-secondary/30 dark:bg-secondary/20 p-4 text-sm whitespace-pre-wrap">
            {template.prompt}
          </div>
        </div>

        {related.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Prompts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {related.map((p) => (
                <Card key={p.slug} className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">{p.title}</CardTitle>
                    <CardDescription>{p.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col sm:flex-row gap-2">
                    <Button asChild variant="outline" className="bg-transparent">
                      <Link href={withLocale(`/prompts/${p.slug}`, locale)}>Open</Link>
                    </Button>
                    <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Link href={buildGeneratorHref({ prompt: p.prompt, mode: p.mode, locale })}>Try</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

