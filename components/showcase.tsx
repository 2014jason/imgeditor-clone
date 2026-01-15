import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { withLocale } from "@/lib/i18n"

export function Showcase({ locale }: { locale?: string }) {
  const examples = [
    {
      image: "/ai-generated-mountain-landscape-with-dramatic-ligh.jpg",
      title: "Ultra-Fast Mountain Generation",
      description: "Created in 0.8 seconds with Image Banana's optimized neural engine",
    },
    {
      image: "/beautiful-garden-with-flowers-and-butterflies.jpg",
      title: "Instant Garden Creation",
      description: "Complex scene rendered in milliseconds using Image Banana technology",
    },
    {
      image: "/tropical-beach-at-sunset-with-palm-trees.jpg",
      title: "Real-time Beach Synthesis",
      description: "Image Banana delivers photorealistic results at lightning speed",
    },
    {
      image: "/aurora-borealis-over-snowy-mountains.jpg",
      title: "Rapid Aurora Generation",
      description: "Advanced effects processed instantly with Image Banana AI",
    },
  ]

  return (
    <section id="showcase" className="py-16 md:py-24 bg-secondary/30 dark:bg-secondary/20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Showcase</h2>
          <p className="text-lg text-muted-foreground">Lightning-Fast AI Creations</p>
          <p className="text-sm text-muted-foreground mt-2">See what Image Banana generates in milliseconds</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {examples.map((example, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-card dark:bg-card border border-border dark:border-border hover:border-accent dark:hover:border-accent transition-colors"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={example.image || "/placeholder.svg"}
                  alt={example.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground dark:bg-yellow-500 dark:text-yellow-950">
                  Image Banana Speed
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{example.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{example.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-lg mb-6">Experience the power of Image Banana yourself</p>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href={withLocale("/generator", locale)}>Try Image Banana Generator</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
