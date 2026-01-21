import type { Metadata } from "next"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, withLocale } from "@/lib/i18n"

type BuildPageMetadataArgs = {
  path: string
  locale?: string
  title?: string
  description?: string
}

function shouldIndexLocale(locale?: string) {
  if (!locale || locale === DEFAULT_LOCALE) return true
  // By default, routed locales (e.g. /zh, /ko) are noindex until real translations exist.
  return process.env.INDEX_I18N_PAGES === "1"
}

function buildAlternates(path: string): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {}
  for (const l of SUPPORTED_LOCALES) {
    languages[l] = withLocale(path, l)
  }
  languages["x-default"] = withLocale(path, DEFAULT_LOCALE)

  return {
    languages,
  }
}

export function buildPageMetadata({ path, locale, title, description }: BuildPageMetadataArgs): Metadata {
  const index = shouldIndexLocale(locale)

  const metadata: Metadata = {
    alternates: buildAlternates(path),
  }

  if (title) metadata.title = title
  if (description) metadata.description = description

  if (!index) {
    metadata.robots = {
      index: false,
      follow: true,
    }
  }

  return metadata
}
