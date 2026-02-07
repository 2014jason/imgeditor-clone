import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { withLocale } from "@/lib/i18n"

type PromptCard = {
  title: string
  description: string
  mode: "image-to-image" | "text-to-image"
  prompt: string
}

function buildGeneratorHref({
  mode,
  prompt,
  locale,
}: {
  mode: PromptCard["mode"]
  prompt: string
  locale?: string
}) {
  const params = new URLSearchParams()
  params.set("prompt", prompt)
  params.set("type", mode)
  return withLocale(`/generator?${params.toString()}`, locale)
}

export function CompareFluxKontextPage({ locale }: { locale?: string }) {
  const promptCards: PromptCard[] = [
    {
      title: "Keep identity, change outfit",
      description: "Upload a portrait. Ask for a clothing change while keeping the same person.",
      mode: "image-to-image",
      prompt:
        "Keep the same person and identity. Change the outfit to a black leather jacket. Preserve face details, lighting, and background. Photorealistic.",
    },
    {
      title: "Replace background, keep subject",
      description: "Upload a product or portrait. Swap the scene without changing the main subject.",
      mode: "image-to-image",
      prompt:
        "Keep the main subject exactly the same. Replace the background with a snowy mountain at golden hour. Preserve edges and realistic lighting.",
    },
    {
      title: "Text-to-image baseline prompt",
      description: "If you don't have an input image, start from text-to-image to evaluate style and quality.",
      mode: "text-to-image",
      prompt: "A studio product photo of a coffee mug, soft shadows, clean background, ultra realistic, high resolution.",
    },
  ]

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 space-y-3">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200">
            Comparison Guide
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold">Image Banana vs Flux Kontext</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            If you’re evaluating Flux Kontext alternatives for consistent edits, here’s a practical way to compare workflows —
            using the same prompts and the same reference images.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href={withLocale("/generator", locale)}>
                Try Image Banana <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href={withLocale("/showcase", locale)}>View Examples</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Note: Flux Kontext is a third‑party product. We are not affiliated with or endorsed by any third party.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>What to Compare</CardTitle>
              <CardDescription>Use these criteria to evaluate “editing quality” — not just pretty outputs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-yellow-500" />
                <div>
                  <div className="font-medium">Identity consistency</div>
                  <div className="text-muted-foreground">Does the face stay the same across edits?</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-yellow-500" />
                <div>
                  <div className="font-medium">Edge quality</div>
                  <div className="text-muted-foreground">Hair, hands, glasses, product boundaries.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-yellow-500" />
                <div>
                  <div className="font-medium">Scene preservation</div>
                  <div className="text-muted-foreground">Does the model keep composition and lighting believable?</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-yellow-500" />
                <div>
                  <div className="font-medium">One-shot success rate</div>
                  <div className="text-muted-foreground">How often you get a usable output without retries.</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Recommended Workflow</CardTitle>
              <CardDescription>Run the same test set on both tools.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <ol className="list-decimal list-inside space-y-2">
                <li>Pick 3–5 reference images (portrait, product, outdoor, low light).</li>
                <li>Run the prompt cards below (keep prompts identical between tools).</li>
                <li>Score outputs for consistency, artifacts, and speed.</li>
                <li>Repeat with one “hard” edit (hands, hair, glass, busy backgrounds).</li>
              </ol>
              <div className="pt-2">
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href={withLocale("/tools/background-remover", locale)}>Try Background Remover</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Try These Prompts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {promptCards.map((p) => (
              <Card key={p.title} className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">{p.title}</CardTitle>
                  <CardDescription>{p.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-secondary/50 dark:bg-secondary/30 p-3 text-sm">{p.prompt}</div>
                  <div className="flex items-center gap-2">
                    <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Link href={buildGeneratorHref({ mode: p.mode, prompt: p.prompt, locale })}>Try in Image Banana</Link>
                    </Button>
                    <Badge variant="outline">{p.mode === "image-to-image" ? "Image to Image" : "Text to Image"}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

