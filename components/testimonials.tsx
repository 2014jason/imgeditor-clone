import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Testimonials() {
  const testimonials = [
    {
      name: "AIArtistPro",
      role: "Digital Creator",
      avatar: "AP",
      content:
        "This editor completely changed my workflow. The character consistency is incredible - miles ahead of Flux Kontext!",
    },
    {
      name: "ContentCreator",
      role: "UGC Specialist",
      avatar: "CC",
      content:
        "Creating consistent AI influencers has never been easier. It maintains perfect face details across edits!",
    },
    {
      name: "PhotoEditor",
      role: "Professional Editor",
      avatar: "PE",
      content: "One-shot editing is basically solved with this tool. The scene blending is so natural and realistic!",
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">User Reviews</h2>
          <p className="text-lg text-muted-foreground">What creators are saying</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border dark:border-border dark:bg-card">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback className="bg-accent text-accent-foreground dark:bg-yellow-500 dark:text-yellow-950">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed italic">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
