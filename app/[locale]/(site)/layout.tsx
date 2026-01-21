import type React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { isRoutedLocale } from "@/lib/i18n"

export const dynamicParams = false

export function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "ko" }]
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  // If locale routes are still English mirrors, keep them noindex to avoid duplicate-content signals.
  if (locale !== "en" && process.env.INDEX_I18N_PAGES !== "1") {
    return {
      robots: { index: false, follow: true },
    }
  }
  return {}
}

export default async function LocaleSiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isRoutedLocale(locale)) notFound()

  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={locale} />
      <div className="flex-1">{children}</div>
      <Footer locale={locale} />
    </div>
  )
}
