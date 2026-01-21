import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { headers } from "next/headers"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const metadataBase =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

const siteDescription =
  "Edit photos with text prompts using Image Banana. Upload an image, describe changes, and get fast, consistent results for creators, marketing, and UGC."

export const metadata: Metadata = {
  metadataBase: new URL(metadataBase),
  title: {
    default: "Image Banana - AI Image Editor | Edit Photos with Text",
    template: "%s | Image Banana",
  },
  description: siteDescription,
  keywords:
    "AI image editor, natural language image editing, batch processing, one-shot editing, photo transformation, character consistency, advanced image generation, scene blending",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Image Banana",
    title: "Image Banana - AI Image Editor | Edit Photos with Text",
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Image Banana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Banana - AI Image Editor | Edit Photos with Text",
    description: siteDescription,
    images: ["/twitter-image"],
  },
  generator: "v0.app",
  manifest: "/manifest.json",
  other: {
    google: "notranslate",
  },
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const requestHeaders = await headers()
  const locale = requestHeaders.get("x-locale") ?? "en"
  const canonicalUrl = requestHeaders.get("x-canonical-url")

  return (
    <html lang={locale} translate="no" className="notranslate" suppressHydrationWarning>
      <head>{canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}</head>
      <body className={`font-sans antialiased`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-47YK61K2PJ"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-47YK61K2PJ');`}
        </Script>

        <ThemeProvider defaultTheme="light" storageKey="image-banana-theme">
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
