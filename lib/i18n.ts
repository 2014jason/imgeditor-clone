export const SUPPORTED_LOCALES = ["en", "zh", "ko"] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "en"

export const ROUTED_LOCALES = ["zh", "ko"] as const
export type RoutedLocale = (typeof ROUTED_LOCALES)[number]

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

export function isRoutedLocale(value: string | undefined): value is RoutedLocale {
  return value !== undefined && (ROUTED_LOCALES as readonly string[]).includes(value)
}

export function withLocale(path: string, locale?: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`
  if (!locale || locale === DEFAULT_LOCALE) return normalized
  if (normalized === "/") return `/${locale}`
  return `/${locale}${normalized}`
}
