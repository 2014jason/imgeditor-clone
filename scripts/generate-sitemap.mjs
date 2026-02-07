import fs from "node:fs/promises"
import path from "node:path"

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "")
}

function getBaseUrl() {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)

  return normalizeBaseUrl(fromEnv ?? "http://localhost:3000")
}

function withLocale(route, locale) {
  const normalized = route.startsWith("/") ? route : `/${route}`
  if (!locale || locale === "en") return normalized
  if (normalized === "/") return `/${locale}`
  return `/${locale}${normalized}`
}

function getPriority(route) {
  if (route === "/") return 1
  if (route === "/generator") return 0.9
  if (route === "/pricing") return 0.8
  if (route === "/showcase") return 0.7
  if (route === "/tools") return 0.65
  if (route.startsWith("/tools/")) return 0.6
  if (route === "/prompts") return 0.6
  if (route.startsWith("/prompts/")) return 0.58
  if (route.startsWith("/compare/")) return 0.55
  if (route === "/privacy" || route === "/terms") return 0.3
  if (route === "/refund" || route === "/refund-application") return 0.2
  return 0.5
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

async function main() {
  const baseUrl = getBaseUrl()
  const lastmod = new Date().toISOString()

  const routes = [
    "/",
    "/generator",
    "/pricing",
    "/showcase",
    "/compare/flux-kontext",
    "/tools",
    "/tools/background-remover",
    "/prompts",
    "/privacy",
    "/terms",
    "/refund",
    "/refund-application",
  ]

  // Default locale is served without prefix; routed locales are prefixed.
  const locales = ["en", "zh", "ko"]

  const urls = []
  for (const route of routes) {
    for (const locale of locales) {
      const loc = `${baseUrl}${withLocale(route, locale)}`
      urls.push(
        [
          "  <url>",
          `    <loc>${escapeXml(loc)}</loc>`,
          `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
          `    <changefreq>${route === "/" ? "daily" : "weekly"}</changefreq>`,
          `    <priority>${getPriority(route).toFixed(1)}</priority>`,
          "  </url>",
        ].join("\n"),
      )
    }
  }

  const xml =
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls,
      "</urlset>",
      "",
    ].join("\n")

  const outPath = path.join(process.cwd(), "public", "sitemap.xml")
  await fs.mkdir(path.dirname(outPath), { recursive: true })
  await fs.writeFile(outPath, xml, "utf8")

  // eslint-disable-next-line no-console
  console.log(`Generated ${outPath}`)
}

await main()
