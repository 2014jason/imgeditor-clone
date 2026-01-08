import { ImageEditor } from "@/components/image-editor"

export function GeneratorPage({ locale }: { locale?: string }) {
  return (
    <div className="py-10 md:py-14 bg-secondary/30 dark:bg-secondary/20">
      <div className="container">
        <div className="mx-auto max-w-6xl mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">AI Image Editor</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Edit images with natural language prompts. Upload a reference image or generate from text.
          </p>
        </div>
      </div>
      <ImageEditor variant="page" locale={locale} />
    </div>
  )
}

