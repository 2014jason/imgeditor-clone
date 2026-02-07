import Link from "next/link"
import { Check, Download, Layers, Scissors, Zap } from "lucide-react"
import { BackgroundRemoverTool } from "@/components/tools/background-remover-tool"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function BackgroundRemoverPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">AI Background Remover</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Remove backgrounds from images in seconds. Export a transparent PNG for products, portraits, and social posts.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border px-3 py-1 bg-secondary/30">Transparent PNG</span>
            <span className="rounded-full border px-3 py-1 bg-secondary/30">No watermark</span>
            <span className="rounded-full border px-3 py-1 bg-secondary/30">Fast</span>
          </div>
        </div>

        <BackgroundRemoverTool />

        <div className="mt-12">
          <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
            <div>
              <h2 className="text-2xl font-bold">Need more than background removal?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Try the full editor to replace backgrounds with any scene using a text prompt.
              </p>
            </div>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/generator">Open Image Editor</Link>
            </Button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Why Choose Image Banana</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Fast Results", desc: "Optimized for quick background removal workflows." },
              { icon: Scissors, title: "Clean Edges", desc: "Designed for tricky details like hair, fur, and glass." },
              { icon: Check, title: "High Quality", desc: "Export a transparent PNG you can reuse anywhere." },
              { icon: Layers, title: "Creator Friendly", desc: "Great for product photos, thumbnails, and UGC." },
              { icon: Download, title: "Easy Export", desc: "One-click download to a transparent PNG." },
              { icon: Check, title: "Privacy-First UX", desc: "Built to keep the experience simple and safe." },
            ].map((f) => (
              <Card key={f.title} className="border-border">
                <CardHeader>
                  <f.icon className="h-10 w-10 text-accent-foreground dark:text-yellow-500 mb-2" />
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="how" className="border border-border rounded-lg px-5 bg-card">
              <AccordionTrigger className="text-left hover:no-underline py-4">
                How does the background remover work?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                Upload an image, click “Remove Background”, and download the result as a transparent PNG. The first run may take
                longer while the model loads.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="formats" className="border border-border rounded-lg px-5 bg-card">
              <AccordionTrigger className="text-left hover:no-underline py-4">
                What image formats are supported?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                Common formats like PNG, JPG, JPEG, and WebP. Max upload size is 10MB.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="transparent" className="border border-border rounded-lg px-5 bg-card">
              <AccordionTrigger className="text-left hover:no-underline py-4">
                Do I get a transparent background?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                Yes — the output is a PNG with a transparent background.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
