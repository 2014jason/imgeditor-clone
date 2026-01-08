import { Hero } from "@/components/hero"
import { ImageEditor } from "@/components/image-editor"
import { Features } from "@/components/features"
import { Showcase } from "@/components/showcase"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"

export function HomePage({ locale }: { locale?: string }) {
  return (
    <main>
      <Hero locale={locale} />
      <ImageEditor variant="home" locale={locale} />
      <Features />
      <Showcase locale={locale} />
      <Testimonials />
      <FAQ />
    </main>
  )
}

