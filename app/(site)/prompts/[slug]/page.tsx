import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PromptTemplatePage } from "@/components/pages/prompt-template-page"
import { PROMPT_TEMPLATES, getPromptTemplate } from "@/lib/prompt-library"
import { buildPageMetadata } from "@/lib/seo"

export function generateStaticParams() {
  return PROMPT_TEMPLATES.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const template = getPromptTemplate(slug)

  if (!template) {
    return buildPageMetadata({
      path: `/prompts/${slug}`,
      title: "Prompt",
      description: "Prompt template not found.",
    })
  }

  return buildPageMetadata({
    path: `/prompts/${slug}`,
    title: template.title,
    description: template.description,
  })
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const template = getPromptTemplate(slug)
  if (!template) return notFound()

  const related = PROMPT_TEMPLATES.filter((p) => p.category === template.category && p.slug !== template.slug).slice(0, 4)

  return <PromptTemplatePage template={template} related={related} />
}

