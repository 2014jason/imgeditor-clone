import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PromptTemplatePage } from "@/components/pages/prompt-template-page"
import { ROUTED_LOCALES } from "@/lib/i18n"
import { PROMPT_TEMPLATES, getPromptTemplate } from "@/lib/prompt-library"
import { buildPageMetadata } from "@/lib/seo"

export function generateStaticParams() {
  return ROUTED_LOCALES.flatMap((locale) => PROMPT_TEMPLATES.map((p) => ({ locale, slug: p.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const template = getPromptTemplate(slug)

  if (!template) {
    return buildPageMetadata({
      path: `/prompts/${slug}`,
      locale,
      title: "Prompt",
      description: "Prompt template not found.",
    })
  }

  return buildPageMetadata({
    path: `/prompts/${slug}`,
    locale,
    title: template.title,
    description: template.description,
  })
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const template = getPromptTemplate(slug)
  if (!template) return notFound()

  const related = PROMPT_TEMPLATES.filter((p) => p.category === template.category && p.slug !== template.slug).slice(0, 4)

  return <PromptTemplatePage template={template} related={related} locale={locale} />
}

