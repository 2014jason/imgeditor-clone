"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { withLocale } from "@/lib/i18n"

type ShowcaseItem = {
  id: string
  title: string
  description: string
  category: string
  mode: "text-to-image" | "image-to-image"
  before?: string
  after: string
  prompt: string
}

function downloadFile(url: string, filename: string) {
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function fileExtFromPath(path: string) {
  const clean = path.split("?")[0] ?? path
  const parts = clean.split(".")
  if (parts.length < 2) return ""
  const ext = parts[parts.length - 1]
  return ext ? `.${ext}` : ""
}

export function ShowcasePage({ locale }: { locale?: string }) {
  const [visibleCount, setVisibleCount] = useState(4)
  const [selected, setSelected] = useState<ShowcaseItem | null>(null)

  const items = useMemo<ShowcaseItem[]>(
    () => [
      {
        id: "landscape-1",
        title: "Cinematic Mountain Landscape",
        description: "Dramatic lighting, sharp ridgelines, and atmospheric depth.",
        category: "Text to Image",
        mode: "text-to-image",
        after: "/showcase/1.jpeg",
        prompt:
          "A cinematic mountain landscape with jagged peaks, dramatic clouds, golden hour light, volumetric fog in the valley, ultra realistic, high detail, wide angle.",
      },
      {
        id: "nature-1",
        title: "Wildflower Meadow in Soft Light",
        description: "Vibrant spring colors with a dreamy, natural feel.",
        category: "Text to Image",
        mode: "text-to-image",
        after: "/showcase/2.png",
        prompt:
          "A vibrant wildflower meadow with butterflies, soft morning haze, natural colors, shallow depth of field, ultra realistic, high resolution, gentle sunlight through leaves.",
      },
      {
        id: "travel-1",
        title: "Tropical Beach at Sunset",
        description: "Warm tones, calm waves, and a peaceful evening mood.",
        category: "Text to Image",
        mode: "text-to-image",
        after: "/showcase/3.png",
        prompt:
          "A tropical beach at sunset with palm trees, warm golden reflections on the water, soft waves, cinematic color grading, ultra realistic photo, high detail.",
      },
      {
        id: "night-1",
        title: "Aurora Borealis Over Snowy Mountains",
        description: "Clean sky detail with a vivid aurora glow.",
        category: "Text to Image",
        mode: "text-to-image",
        after: "/showcase/4.png",
        prompt:
          "Aurora borealis over snowy mountains at night, crisp stars, realistic long-exposure photography, vivid green and purple aurora, high resolution, ultra realistic.",
      },
    ],
    [],
  )

  const visibleItems = items.slice(0, visibleCount)
  const canLoadMore = visibleCount < items.length

  const buildTryThisHref = (item: ShowcaseItem) => {
    const params = new URLSearchParams()
    params.set("type", item.mode)
    params.set("prompt", item.prompt)
    if (item.mode === "image-to-image" && item.before) {
      params.set("ref", item.before)
    }
    return withLocale(`/generator?${params.toString()}`, locale)
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-secondary/30 dark:bg-secondary/20">
      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200">
            Featured Examples
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold mt-4">Showcase Gallery</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-3">
            Real examples with prompts you can reuse. Click “Try This” to open the editor with the prompt pre-filled. Results may vary.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href={withLocale("/generator", locale)}>Try Now</Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent">
              <a href="mailto:support@my-nano-banana.com?subject=Image%20Banana%20Showcase%20Submission">Submit Your Work</a>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {visibleItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{item.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {item.before ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-2">Before</div>
                      <img
                        src={item.before}
                        alt={`${item.title} before`}
                        className="aspect-[4/3] w-full rounded-lg object-cover border"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-2">After</div>
                      <img
                        src={item.after}
                        alt={`${item.title} after`}
                        className="aspect-[4/3] w-full rounded-lg object-cover border"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-2">Result</div>
                    <img
                      src={item.after}
                      alt={`${item.title} result`}
                      className="aspect-[4/3] w-full rounded-lg object-cover border"
                    />
                  </div>
                )}
                <div className="text-sm">
                  <div className="text-xs font-medium text-muted-foreground mb-1">Prompt</div>
                  <div className="rounded-lg bg-secondary/50 dark:bg-secondary/30 p-3">{item.prompt}</div>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href={buildTryThisHref(item)}>Try This</Link>
                  </Button>
                  <Button size="sm" variant="outline" className="bg-transparent" onClick={() => setSelected(item)}>
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent"
                    onClick={() => downloadFile(item.after, `showcase-${item.id}${fileExtFromPath(item.after) || ".png"}`)}
                  >
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            className="bg-transparent"
            onClick={() => setVisibleCount((v) => Math.min(v + 4, items.length))}
            disabled={!canLoadMore}
          >
            {canLoadMore ? "Load More" : "All Loaded"}
          </Button>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>{selected?.description}</DialogDescription>
          </DialogHeader>

          {selected ? (
            <div className="space-y-4">
              {selected.before ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-2">Before</div>
                    <img src={selected.before} alt="Before" className="w-full rounded-lg border object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-2">After</div>
                    <img src={selected.after} alt="After" className="w-full rounded-lg border object-cover" />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">Result</div>
                  <img src={selected.after} alt="Result" className="w-full rounded-lg border object-cover" />
                </div>
              )}

              <div className="text-sm">
                <div className="text-xs font-medium text-muted-foreground mb-1">Prompt</div>
                <div className="rounded-lg bg-secondary/50 dark:bg-secondary/30 p-3">{selected.prompt}</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href={buildTryThisHref(selected)}>Try This</Link>
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent"
                  onClick={() =>
                    downloadFile(selected.after, `showcase-${selected.id}${fileExtFromPath(selected.after) || ".png"}`)
                  }
                >
                  Download
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
