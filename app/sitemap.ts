import type { MetadataRoute } from "next"
import { DEFAULT_LOCALE, ROUTED_LOCALES, withLocale } from "@/lib/i18n"

export const revalidate = 86400

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "")
}

function getBaseUrl() {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)

  return normalizeBaseUrl(fromEnv ?? "http://localhost:3000")
}

function getPriority(path: string) {
  if (path === "/") return 1
  if (path === "/generator") return 0.9
  if (path === "/pricing") return 0.8
  if (path === "/showcase") return 0.7
  if (path.startsWith("/tools/")) return 0.6
  if (path === "/privacy" || path === "/terms") return 0.3
  if (path === "/refund" || path === "/refund-application") return 0.2
  if (path === "/thank-you") return 0.1
  return 0.5
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()
  const lastModified = new Date()

  const routes = [
    "/",
    "/generator",
    "/pricing",
    "/showcase",
    "/tools/background-remover",
    "/privacy",
    "/terms",
    "/refund",
    "/refund-application",
    "/thank-you",
  ] as const

  const locales = [DEFAULT_LOCALE, ...ROUTED_LOCALES] as const

  const entries: MetadataRoute.Sitemap = []

  for (const route of routes) {
    for (const locale of locales) {
      const localizedPath = withLocale(route, locale)
      entries.push({
        url: `${baseUrl}${localizedPath}`,
        lastModified,
        changeFrequency: route === "/" ? "daily" : "weekly",
        priority: getPriority(route),
      })
    }
  }

  return entries
}
