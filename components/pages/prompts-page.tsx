import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { withLocale } from "@/lib/i18n"
import { PROMPT_TEMPLATES, type PromptTemplate } from "@/lib/prompt-library"

function buildGeneratorHref({ prompt, mode, locale }: { prompt: string; mode: PromptTemplate["mode"]; locale?: string }) {
  const params = new URLSearchParams()
  params.set("prompt", prompt)
  params.set("type", mode)
  return withLocale(`/generator?${params.toString()}`, locale)
}

export function PromptsPage({ locale }: { locale?: string }) {
  const categories = Array.from(new Set(PROMPT_TEMPLATES.map((p) => p.category)))

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">Prompt Library</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Curated prompts for common editing tasks. Click “Try” to open the editor with the prompt pre-filled.
          </p>
        </div>

        <div className="space-y-10">
          {categories.map((category) => {
            const items = PROMPT_TEMPLATES.filter((p) => p.category === category)
            return (
              <section key={category}>
                <div className="flex items-baseline justify-between gap-4 mb-4">
                  <h2 className="text-xl font-bold">{category}</h2>
                  <span className="text-xs text-muted-foreground">{items.length} prompts</span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {items.map((p) => (
                    <Card key={p.slug} className="border-border">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1.5">
                            <CardTitle className="text-lg">{p.title}</CardTitle>
                            <CardDescription>{p.description}</CardDescription>
                          </div>
                          <Badge variant="outline">{p.mode === "image-to-image" ? "Image to Image" : "Text to Image"}</Badge>
                        </div>
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
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}

