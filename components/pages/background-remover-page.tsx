"use client"

import type React from "react"
import { useState } from "react"
import { Check, Download, Layers, Scissors, Upload, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Spinner } from "@/components/ui/spinner"

export function BackgroundRemoverPage() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [inputImage, setInputImage] = useState<string | null>(null)
  const [outputImage, setOutputImage] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)
    setOutputImage(null)

    if (!file) {
      setFileName(null)
      setInputImage(null)
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File is larger than 10MB.")
      return
    }
    setFileName(file.name)

    const reader = new FileReader()
    reader.onloadend = () => {
      setInputImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeBackground = () => {
    setError(null)
    if (!inputImage) {
      setError("Please upload an image first.")
      return
    }
    setProcessing(true)
    window.setTimeout(() => {
      setOutputImage(inputImage)
      setProcessing(false)
    }, 900)
  }

  const download = (ext: "png" | "jpg") => {
    if (!outputImage) return
    const a = document.createElement("a")
    a.href = outputImage
    a.download = `background-removed.${ext}`
    a.rel = "noopener"
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">Professional AI Background Removal</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Remove image backgrounds instantly (mocked in this clone).
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Image</CardTitle>
              <CardDescription>Drag & drop or click to upload (up to 10MB)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="block">
                <div className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:border-accent transition-colors">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <div className="font-medium">Select Image to Remove Background</div>
                  <div className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG, GIF, WebP</div>
                  {fileName ? <div className="mt-4 text-sm">Selected: {fileName}</div> : null}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
              </label>
              {error ? <p className="text-xs text-destructive">{error}</p> : null}
              <Button className="w-full" onClick={removeBackground} disabled={!inputImage || processing} type="button">
                {processing ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner className="size-4" /> Processing...
                  </span>
                ) : (
                  "Remove Background"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 dark:bg-card">
            <CardHeader>
              <CardTitle>AI-Processed Result</CardTitle>
              <CardDescription>Your background-removed image will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="min-h-[320px] rounded-lg border border-border bg-secondary/50 dark:bg-secondary/30 overflow-hidden flex items-center justify-center text-sm text-muted-foreground"
                style={
                  outputImage
                    ? {
                        backgroundImage:
                          "linear-gradient(45deg, rgba(0,0,0,0.06) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.06) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.06) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.06) 75%)",
                        backgroundSize: "20px 20px",
                        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                      }
                    : undefined
                }
              >
                {processing ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner className="size-4" /> Processing...
                  </span>
                ) : outputImage ? (
                  <img src={outputImage} alt="Background removed result" className="w-full h-full object-contain" />
                ) : (
                  "Your background-removed image will appear here instantly"
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  disabled={!outputImage}
                  onClick={() => download("png")}
                  type="button"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PNG
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  disabled={!outputImage}
                  onClick={() => download("jpg")}
                  type="button"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download JPG
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Why Choose image banana Over Competitors</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "3-Second Processing", desc: "Fast background removal experience (mocked here)." },
              { icon: Scissors, title: "Superior Edge Detection", desc: "Designed for complex edges like hair & fur." },
              { icon: Check, title: "Pixel-Perfect Accuracy", desc: "Clean results with minimal artifacts." },
              { icon: Layers, title: "Batch Processing", desc: "Remove backgrounds from multiple images (Pro on official)." },
              { icon: Download, title: "Multiple Export Formats", desc: "Export to transparent PNG or JPG." },
              { icon: Check, title: "Professional Quality", desc: "Great for product shots and social posts." },
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
                How does image banana's background remover work?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                This clone simulates the workflow. Wire up a real background removal model/API for production.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="formats" className="border border-border rounded-lg px-5 bg-card">
              <AccordionTrigger className="text-left hover:no-underline py-4">
                What image formats are supported?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                PNG, JPG, JPEG, GIF, WebP (up to 10MB in this clone).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="free" className="border border-border rounded-lg px-5 bg-card">
              <AccordionTrigger className="text-left hover:no-underline py-4">
                Is it really free to use?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                The UI is free in this clone. The official product marks some capabilities as Pro.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="compare" className="border border-border rounded-lg px-5 bg-card">
              <AccordionTrigger className="text-left hover:no-underline py-4">
                How does it compare to Flux Kontext?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                Match the official messaging after you integrate a real model and benchmark quality/speed.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
