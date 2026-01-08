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
  before: string
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

export function ShowcasePage({ locale }: { locale?: string }) {
  const [visibleCount, setVisibleCount] = useState(4)
  const [selected, setSelected] = useState<ShowcaseItem | null>(null)

  const items = useMemo<ShowcaseItem[]>(
    () => [
      {
        id: "portrait-1",
        title: "Professional Portrait Enhancement",
        description: "AI-optimized portrait photography",
        category: "Portrait",
        before: "/placeholder-user.jpg",
        after: "/showcase/1.jpeg",
        prompt: "Enhance portrait lighting, keep identity, natural skin tones.",
      },
      {
        id: "landscape-1",
        title: "Golden Hour Landscape",
        description: "Enhanced natural scenery",
        category: "Landscape",
        before: "/placeholder.jpg",
        after: "/showcase/2.png",
        prompt: "Golden hour lighting, ultra-detailed mountains, cinematic atmosphere.",
      },
      {
        id: "product-1",
        title: "Product Photography",
        description: "E-commerce product optimization",
        category: "Product",
        before: "/placeholder.jpg",
        after: "/showcase/3.png",
        prompt: "Clean studio lighting, remove clutter, sharp edges, premium look.",
      },
      {
        id: "creative-1",
        title: "Artistic Creation",
        description: "Creative digital artwork",
        category: "Creative",
        before: "/placeholder.jpg",
        after: "/showcase/4.png",
        prompt: "Stylized aurora, vibrant colors, dreamy glow, high resolution.",
      },
      {
        id: "portrait-2",
        title: "Portrait Color Grading",
        description: "Cinematic color and mood",
        category: "Portrait",
        before: "/placeholder-user.jpg",
        after: "/showcase/1.jpeg",
        prompt: "Cinematic portrait color grading, soft film grain, warm highlights.",
      },
      {
        id: "landscape-2",
        title: "Stormy Mountain Scene",
        description: "Dramatic weather transformation",
        category: "Landscape",
        before: "/placeholder.jpg",
        after: "/showcase/4.png",
        prompt: "Place the scene in a blizzard, keep composition, add dramatic lighting.",
      },
      {
        id: "product-2",
        title: "Premium Product Shot",
        description: "Clean studio look",
        category: "Product",
        before: "/placeholder.jpg",
        after: "/showcase/3.png",
        prompt: "Studio background, soft shadows, premium look, sharp edges.",
      },
      {
        id: "creative-2",
        title: "Dreamy Aurora Artwork",
        description: "Vibrant stylized aurora",
        category: "Creative",
        before: "/placeholder.jpg",
        after: "/showcase/4.png",
        prompt: "Dreamy aurora, vibrant colors, glow effect, ultra detailed.",
      },
    ],
    [],
  )

  const visibleItems = items.slice(0, visibleCount)
  const canLoadMore = visibleCount < items.length

  const buildTryThisHref = (item: ShowcaseItem) => {
    const params = new URLSearchParams()
    params.set("type", "text-to-image")
    params.set("prompt", item.prompt)
    return withLocale(`/generator?${params.toString()}`, locale)
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-secondary/30 dark:bg-secondary/20">
      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200">
            Community Featured
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold mt-4">Showcase Gallery</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-3">
            Examples are placeholders. Later you can load real community creations.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href={withLocale("/generator", locale)}>Try Now</Link>
            </Button>
            <Button variant="outline" className="bg-transparent" disabled>
              Submit Your Work
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
                    onClick={() => downloadFile(item.after, `showcase-${item.id}.png`)}
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
                  onClick={() => downloadFile(selected.after, `showcase-${selected.id}.png`)}
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
