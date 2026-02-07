"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function BackgroundRemoverTool() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [inputUrl, setInputUrl] = useState<string | null>(null)

  const [outputBlob, setOutputBlob] = useState<Blob | null>(null)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)

  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [progress, setProgress] = useState<{ stage: string; current: number; total: number } | null>(null)

  useEffect(() => {
    return () => {
      if (inputUrl) URL.revokeObjectURL(inputUrl)
      if (outputUrl) URL.revokeObjectURL(outputUrl)
    }
  }, [inputUrl, outputUrl])

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0] ?? null
    setError(null)
    setProgress(null)

    // Reset output any time input changes.
    setOutputBlob(null)
    if (outputUrl) {
      URL.revokeObjectURL(outputUrl)
      setOutputUrl(null)
    }

    if (!next) {
      setFile(null)
      if (inputUrl) URL.revokeObjectURL(inputUrl)
      setInputUrl(null)
      return
    }

    if (next.size > MAX_FILE_SIZE_BYTES) {
      setError("File is larger than 10MB.")
      e.target.value = ""
      return
    }

    setFile(next)
    if (inputUrl) URL.revokeObjectURL(inputUrl)
    setInputUrl(URL.createObjectURL(next))
    e.target.value = ""
  }

  const removeBackground = async () => {
    setError(null)
    setProgress(null)

    if (!file) {
      setError("Please upload an image first.")
      return
    }

    if (processing) return
    setProcessing(true)

    try {
      const { removeBackground } = await import("@imgly/background-removal")

      const blob = await removeBackground(file, {
        output: { format: "image/png" },
        progress: (stage, current, total) => setProgress({ stage, current, total }),
      })

      setOutputBlob(blob)
      if (outputUrl) URL.revokeObjectURL(outputUrl)
      setOutputUrl(URL.createObjectURL(blob))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove background.")
    } finally {
      setProcessing(false)
    }
  }

  const download = () => {
    if (!outputBlob) return
    downloadBlob(outputBlob, "background-removed.png")
  }

  const progressText = (() => {
    if (!progress) return null
    const pct = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : null
    return pct !== null ? `${progress.stage} • ${pct}%` : `${progress.stage}`
  })()

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Your Image</CardTitle>
          <CardDescription>Drag & drop or click to upload (up to 10MB)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block">
            <div
              className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:border-accent transition-colors"
              role="button"
              tabIndex={0}
              onKeyDown={(ev) => {
                if (ev.key !== "Enter" && ev.key !== " ") return
                ev.preventDefault()
                inputRef.current?.click()
              }}
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <div className="font-medium">Select Image to Remove Background</div>
              <div className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG, WebP</div>
              {file ? <div className="mt-4 text-sm">Selected: {file.name}</div> : null}
            </div>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onUpload} />
          </label>

          {inputUrl ? (
            <div className="rounded-lg border border-border overflow-hidden bg-muted/40">
              <img src={inputUrl} alt="Input preview" className="w-full max-h-[280px] object-contain" />
            </div>
          ) : null}

          {error ? <p className="text-xs text-destructive">{error}</p> : null}

          <Button className="w-full" onClick={removeBackground} disabled={!file || processing} type="button">
            {processing ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="size-4" /> {progressText ?? "Processing..."}
              </span>
            ) : (
              "Remove Background"
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            Tip: your first run may take longer while the background removal model loads.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-muted/50 dark:bg-card">
        <CardHeader>
          <CardTitle>Result (Transparent PNG)</CardTitle>
          <CardDescription>Download a PNG with a transparent background.</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="min-h-[320px] rounded-lg border border-border bg-secondary/50 dark:bg-secondary/30 overflow-hidden flex items-center justify-center text-sm text-muted-foreground"
            style={
              outputUrl
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
                <Spinner className="size-4" /> {progressText ?? "Processing..."}
              </span>
            ) : outputUrl ? (
              <img src={outputUrl} alt="Background removed result" className="w-full h-full object-contain" />
            ) : (
              "Your background-removed image will appear here"
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" disabled={!outputBlob} onClick={download} type="button">
              <Download className="h-4 w-4 mr-2" />
              Download PNG
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

