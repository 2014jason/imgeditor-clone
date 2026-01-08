import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "What is image banana?",
      answer:
        "It's a revolutionary AI image editing model that transforms photos using natural language prompts. This is currently the most powerful image editing model available, with exceptional consistency. It offers superior performance compared to Flux Kontext for consistent character editing and scene preservation.",
    },
    {
      question: "How does it work?",
      answer:
        'Simply upload an image and describe your desired edits in natural language. The AI understands complex instructions like "place the creature in a snowy mountain" or "imagine the whole face and create it". It processes your text prompt and generates perfectly edited images.',
    },
    {
      question: "How is it better than Flux Kontext?",
      answer:
        'This model excels in character consistency, scene blending, and one-shot editing. Users report it "completely destroys" Flux Kontext in preserving facial features and seamlessly integrating edits with backgrounds. It also supports multi-image context, making it ideal for creating consistent AI influencers.',
    },
    {
      question: "Can I use it for commercial projects?",
      answer:
        "Yes! It's perfect for creating AI UGC content, social media campaigns, and marketing materials. Many users leverage it for creating consistent AI influencers and product photography. The high-quality outputs are suitable for professional use.",
    },
    {
      question: "What types of edits can it handle?",
      answer:
        'The editor handles complex edits including face completion, background changes, object placement, style transfers, and character modifications. It excels at understanding contextual instructions like "place in a blizzard" or "create the whole face" while maintaining photorealistic quality.',
    },
    {
      question: "Where can I try image banana?",
      answer:
        "You can try image banana on LMArena or through our web interface. Simply upload your image, enter a text prompt describing your desired edits, and watch as image banana AI transforms your photo with incredible accuracy and consistency.",
    },
  ]

  return (
    <section id="faq" className="py-16 md:py-24 bg-secondary/30 dark:bg-secondary/20">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">FAQs</h2>
            <p className="text-lg text-muted-foreground">Frequently Asked Questions</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border dark:border-border rounded-lg px-6 bg-card dark:bg-card"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="font-semibold text-base">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
