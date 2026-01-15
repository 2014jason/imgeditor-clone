import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Users, Mountain, Zap, Images, Sparkles } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: MessageSquare,
      title: "Natural Language Editing",
      description:
        "Edit images using simple text prompts. Image Banana AI understands complex instructions like GPT for images",
    },
    {
      icon: Users,
      title: "Character Consistency",
      description:
        "Maintain perfect character details across edits. This model excels at preserving faces and identities",
    },
    {
      icon: Mountain,
      title: "Scene Preservation",
      description: "Seamlessly blend edits with original backgrounds. Superior scene fusion compared to Flux Kontext",
    },
    {
      icon: Zap,
      title: "One-Shot Editing",
      description:
        "Perfect results in a single attempt. Image Banana solves one-shot image editing challenges effortlessly",
    },
    {
      icon: Images,
      title: "Multi-Image Context",
      description: "Process multiple images simultaneously. Support for advanced multi-image editing workflows",
    },
    {
      icon: Sparkles,
      title: "AI UGC Creation",
      description: "Create consistent AI influencers and UGC content. Perfect for social media and marketing campaigns",
    },
  ]

  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Features</h2>
          <p className="text-lg text-muted-foreground">Why Choose Image Banana?</p>
          <p className="text-sm text-muted-foreground mt-2">
            Image Banana is the most advanced AI image editor on LMArena. Revolutionize your photo editing with natural
            language understanding
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border dark:border-border hover:border-accent dark:hover:border-accent transition-colors"
            >
              <CardHeader>
                <feature.icon className="h-10 w-10 mb-3 text-accent-foreground dark:text-yellow-500" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
