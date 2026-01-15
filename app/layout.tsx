import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { headers } from "next/headers"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Image Banana - AI Image Editor | Edit Photos with Text",
  description:
    "Transform any image with simple text prompts. Advanced AI model delivers consistent character editing and scene preservation.",
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
  const locale = (await headers()).get("x-locale") ?? "en"

  return (
    <html lang={locale} translate="no" className="notranslate" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider defaultTheme="light" storageKey="image-banana-theme">
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
