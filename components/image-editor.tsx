"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ImageIcon, Download, Maximize2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { withLocale } from "@/lib/i18n"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { getSupabaseConfigOptional } from "@/lib/supabase/config"

type EditorMode = "image-to-image" | "text-to-image"
type ModelId = "nano-banana" | "nano-banana-pro" | "seedream4"

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Failed to read file."))
    reader.onload = () => resolve(String(reader.result ?? ""))
    reader.readAsDataURL(file)
  })
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

export function ImageEditor({ variant = "home", locale }: { variant?: "home" | "page"; locale?: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [prompt, setPrompt] = useState("")
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [mode, setMode] = useState<EditorMode>("image-to-image")
  const [batchMode, setBatchMode] = useState(false)
  const [model, setModel] = useState<ModelId>("nano-banana")

  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const [assetLibraryOpen, setAssetLibraryOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const initializedRef = useRef(false)
  const uploadInputRef = useRef<HTMLInputElement | null>(null)

  const next = useMemo(() => {
    const path = pathname || (typeof window !== "undefined" ? window.location.pathname : "/")
    const query = searchParams?.toString()
    return query ? `${path}?${query}` : path
  }, [pathname, searchParams])

  const loginHref = useMemo(() => `/auth/login?next=${encodeURIComponent(next)}`, [next])

  useEffect(() => {
    const config = getSupabaseConfigOptional()
    if (!config) {
      setUser(null)
      setAuthReady(true)
      return
    }

    const supabase = createSupabaseBrowserClient()
    let mounted = true

    const load = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        if (!mounted) return
        setUser(data.user ?? null)
      } finally {
        if (mounted) setAuthReady(true)
      }
    }
    void load()

    const { data } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const queryType = searchParams.get("type")
    if (queryType === "text-to-image" || queryType === "image-to-image") {
      setMode(queryType)
    }

    const queryModel = searchParams.get("model")
    if (queryModel === "nano-banana" || queryModel === "nano-banana-pro" || queryModel === "seedream4") {
      setModel(queryModel)
    }

    const queryPrompt = searchParams.get("prompt")
    if (queryPrompt) setPrompt(queryPrompt)

    const queryRef = searchParams.get("ref")
    if (queryRef) setUploadedImages([queryRef])

    if (searchParams.get("mode") === "batch") {
      setBatchMode(true)
    }
  }, [searchParams])

  const modeDescription =
    mode === "image-to-image"
      ? "Transform existing images into new creations"
      : "Generate stunning images from text descriptions"

  const promptEngineDescription =
    mode === "image-to-image"
      ? "Transform your image with AI-powered editing"
      : "Describe your vision - watch it come to life instantly"

  const promptPlaceholder =
    mode === "text-to-image"
      ? "A futuristic city powered by nano technology, golden hour lighting, ultra detailed..."
      : 'Try: "place the creature in a snowy mountain" or "change the background to a blizzard"...'

  const promptCardTitle = variant === "page" ? "Prompt Input" : "Prompt Engine"

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)

    const files = e.target.files
    if (!files || files.length === 0) return

    const maxImages = batchMode ? 9 : 1
    const remainingSlots = Math.max(0, maxImages - (batchMode ? uploadedImages.length : 0))
    const selected = Array.from(files).slice(0, remainingSlots)

    const validFiles = selected.filter((file) => file.size <= MAX_FILE_SIZE_BYTES)
    if (validFiles.length !== selected.length) {
      setError("Some files were skipped. Please upload images up to 5MB.")
    }

    if (validFiles.length === 0) {
      e.target.value = ""
      return
    }

    try {
      const dataUrls = await Promise.all(validFiles.map(readFileAsDataUrl))
      if (batchMode) {
        setUploadedImages((prev) => [...prev, ...dataUrls].slice(0, maxImages))
      } else {
        setUploadedImages(dataUrls[0] ? [dataUrls[0]] : [])
      }
    } catch {
      setError("Failed to read image file.")
    } finally {
      e.target.value = ""
    }
  }

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  const onGenerate = async () => {
    setError(null)

    if (!authReady) {
      setError("Please wait while we verify your session.")
      return
    }

    if (!user) {
      window.location.href = loginHref
      return
    }

    if (processing) return
    if (model === "seedream4") {
      setError("SeeDream 4 is not connected yet. Please select image banana.")
      return
    }
    if (mode === "image-to-image" && uploadedImages.length === 0) {
      setError("Please upload a reference image first.")
      return
    }
    if (!prompt.trim()) {
      setError("Please enter a prompt.")
      return
    }

    setProcessing(true)
    setGeneratedImages([])

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          image: mode === "image-to-image" ? uploadedImages[0] : null,
        }),
      })

      const data = (await res.json().catch(() => null)) as any

      if (res.status === 401) {
        const redirectUrl = typeof data?.loginUrl === "string" ? data.loginUrl : loginHref
        window.location.href = redirectUrl
        return
      }

      if (!res.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "Generation failed.")
      }

      const images = Array.isArray(data?.images) ? data.images.filter((u: unknown) => typeof u === "string") : []
      if (images.length === 0) throw new Error("No images returned from API.")

      setGeneratedImages(images)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.")
    } finally {
      setProcessing(false)
    }
  }

  const useAsReference = (src: string) => {
    setMode("image-to-image")
    setUploadedImages([src])
  }

  return (
    <section
      id={variant === "home" ? "generator" : undefined}
      className={variant === "home" ? "py-16 md:py-24 bg-secondary/30 dark:bg-secondary/20" : ""}
    >
      <div className="container">
        <div className="mx-auto max-w-6xl">
          {variant === "home" ? (
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started</h2>
              <p className="text-xl font-semibold mb-2">Try The AI Editor</p>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Experience the power of image banana's natural language image editing. Transform any photo with simple
                text commands
              </p>
            </div>
          ) : null}

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="dark:bg-card dark:border-border">
              <CardHeader>
                <CardTitle>{promptCardTitle}</CardTitle>
                <CardDescription>{promptEngineDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2 p-1 bg-secondary dark:bg-secondary/50 rounded-lg">
                  <button
                    onClick={() => setMode("image-to-image")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      mode === "image-to-image"
                        ? "bg-background dark:bg-card shadow-sm"
                        : "hover:bg-background/50 dark:hover:bg-card/50"
                    }`}
                  >
                    Image to Image
                  </button>
                  <button
                    onClick={() => setMode("text-to-image")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      mode === "text-to-image"
                        ? "bg-background dark:bg-card shadow-sm"
                        : "hover:bg-background/50 dark:hover:bg-card/50"
                    }`}
                  >
                    Text to Image
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">{modeDescription}</p>

                <div className="space-y-2">
                  <Label>AI Model Selection</Label>
                  <Select value={model} onValueChange={(v) => setModel(v as ModelId)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nano-banana">image banana</SelectItem>
                      <SelectItem value="nano-banana-pro">image banana Pro</SelectItem>
                      <SelectItem value="seedream4">SeeDream 4</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Different models offer unique characteristics and styles
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Batch Processing</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-yellow-400 text-black dark:bg-yellow-500">
                        Pro
                      </Badge>
                      <Switch
                        checked={batchMode}
                        onCheckedChange={(checked) => {
                          if (checked) setUpgradeOpen(true)
                          setBatchMode(checked)
                        }}
                        aria-label="Batch Processing"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enable batch mode to process multiple images at once (UI-only in this clone).
                  </p>
                </div>

                {mode === "image-to-image" ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>{batchMode ? "Batch Upload Images" : "Reference Image"}</Label>
                      <span className="text-xs text-muted-foreground">{uploadedImages.length}/{batchMode ? 9 : 1}</span>
                    </div>

	                    {uploadedImages.length > 0 ? (
	                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          {uploadedImages.map((img, index) => (
                            <div
                              key={index}
                              className="relative aspect-square rounded-lg overflow-hidden border dark:border-border"
                            >
                              <img
                                src={img || "/placeholder.svg"}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== index))}
                                className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 dark:bg-black/70 dark:hover:bg-black/90 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
	                        <div className="flex gap-2">
	                          <Button
	                            variant="outline"
	                            size="sm"
	                            className="flex-1 bg-transparent dark:border-border"
	                            onClick={() => setAssetLibraryOpen(true)}
	                            type="button"
	                          >
	                            Select from Library
	                          </Button>
	                          <Button
	                            variant="outline"
	                            size="sm"
	                            className="flex-1 bg-transparent dark:border-border"
	                            type="button"
	                            onClick={() => uploadInputRef.current?.click()}
	                          >
	                            <ImageIcon className="w-4 h-4 mr-2" />
	                            {batchMode ? "Add More" : "Add Image"}
	                          </Button>
	                        </div>
	                      </div>
	                    ) : (
	                      <div
	                        className="border-2 border-dashed border-border dark:border-border rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer"
	                        role="button"
	                        tabIndex={0}
	                        onClick={() => uploadInputRef.current?.click()}
	                        onKeyDown={(e) => {
	                          if (e.key !== "Enter" && e.key !== " ") return
	                          e.preventDefault()
	                          uploadInputRef.current?.click()
	                        }}
	                      >
	                          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
	                          <span className="text-sm font-medium">
	                            {batchMode ? "Drag and drop or click to upload multiple images" : "Drop an image here or click to upload"}
	                          </span>
	                          <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, or WebP • Max 5MB</p>
	                          <div className="mt-4 flex justify-center">
	                            <Button variant="outline" size="sm" className="bg-transparent dark:border-border" type="button">
	                              <ImageIcon className="w-4 h-4 mr-2" />
	                              {batchMode ? "Add Images" : "Add Image"}
	                            </Button>
	                          </div>
	                        </div>
	                    )}
	
	                    <input
	                      ref={uploadInputRef}
	                      type="file"
	                      accept="image/*"
	                      multiple={batchMode}
	                      onChange={handleImageUpload}
	                      className="hidden"
	                    />
	                  </div>
	                ) : (
                  <div className="rounded-lg border border-border bg-secondary/30 dark:bg-secondary/20 p-4 text-sm text-muted-foreground">
                    No reference image needed for Text to Image. Switch to Image to Image to upload a photo.
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Main Prompt</Label>
                  <Textarea
                    placeholder={promptPlaceholder}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <div className="flex items-center justify-between">
                    {error ? <p className="text-xs text-destructive">{error}</p> : <span />}
                    <Button variant="ghost" size="sm" className="text-xs" onClick={copyPrompt} type="button">
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-secondary/30 dark:bg-secondary/20 p-4">
                  <p className="text-sm font-medium mb-2">Pro Tips</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Use natural language prompts like “place in a blizzard”.</li>
                    <li>• Try “imagine the whole face” for face completion.</li>
                    <li>• Keep identity: describe the same character details across edits.</li>
                    <li>• One-shot editing works best with clear, specific instructions.</li>
                  </ul>
                </div>

                {variant === "home" ? (
                  <div className="p-4 bg-secondary/50 dark:bg-secondary/30 rounded-lg text-center">
                    <p className="text-sm mb-2">Want more powerful image generation features?</p>
                    <Button asChild variant="link" className="text-primary p-0 h-auto">
                      <Link href={withLocale("/generator", locale)}>Visit Full Generator →</Link>
                    </Button>
                  </div>
                ) : null}

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                  onClick={onGenerate}
                  disabled={processing}
                  type="button"
                >
                  {processing ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner className="size-4" /> Processing...
                    </span>
                  ) : (
                    "Generate Now"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-muted/50 dark:bg-card dark:border-border">
              <CardHeader>
                <CardTitle>Output Gallery</CardTitle>
                <CardDescription>Your ultra-fast AI creations appear here instantly</CardDescription>
              </CardHeader>
              <CardContent>
                {processing ? (
                  <div className="aspect-square rounded-lg bg-secondary/50 dark:bg-secondary/30 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                    <Spinner className="size-6 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Processing your request...</h3>
                    <p className="text-sm text-muted-foreground">Lightning-fast generation in progress</p>
                  </div>
                ) : generatedImages.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {generatedImages.map((src, idx) => (
                        <div key={idx} className="relative rounded-lg overflow-hidden border bg-background">
                          <img src={src} alt={`Generated ${idx + 1}`} className="aspect-square w-full object-cover" />
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-yellow-500 text-yellow-950 hover:bg-yellow-500">AI Generated</Badge>
                          </div>
                          <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="flex-1"
                              type="button"
                              onClick={() => downloadFile(src, `image-banana-${Date.now()}.png`)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-transparent"
                              type="button"
                              onClick={() => setFullscreenImage(src)}
                              aria-label="Fullscreen"
                            >
                              <Maximize2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        type="button"
                        onClick={() => useAsReference(generatedImages[0])}
                      >
                        Edit Again
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent" type="button" onClick={onGenerate}>
                        Regenerate
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg bg-secondary/50 dark:bg-secondary/30 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                    <div className="text-7xl mb-4">🍌</div>
                    <h3 className="font-semibold text-lg mb-2">Ready for instant generation</h3>
                    <p className="text-sm text-muted-foreground mb-6">Enter your prompt and unleash the power</p>
                  </div>
                )}

                {variant === "home" ? (
                  <div className="mt-4 p-4 bg-secondary/50 dark:bg-secondary/30 rounded-lg text-center">
                    <p className="text-sm mb-2">Want more powerful image generation features?</p>
                    <Button asChild variant="link" className="text-primary p-0 h-auto">
                      <Link href={withLocale("/generator", locale)}>Visit Full Generator →</Link>
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AlertDialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pro Feature</AlertDialogTitle>
            <AlertDialogDescription>
              Batch Processing is marked as Pro on imgeditor.co. This clone does not implement subscriptions yet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href={withLocale("/pricing", locale)}>Upgrade</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={assetLibraryOpen} onOpenChange={setAssetLibraryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asset Library</DialogTitle>
            <DialogDescription>Sign in to use Asset Library (stub).</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border bg-secondary/30 dark:bg-secondary/20 p-4 text-sm text-muted-foreground">
            Asset Library will be implemented later. For now, upload images directly.
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!fullscreenImage} onOpenChange={(open) => !open && setFullscreenImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Full Screen View</DialogTitle>
            <DialogDescription>Preview the generated image.</DialogDescription>
          </DialogHeader>
          {fullscreenImage ? (
            <img src={fullscreenImage} alt="Fullscreen preview" className="w-full rounded-lg border object-contain" />
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  )
}
