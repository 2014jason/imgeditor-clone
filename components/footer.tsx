import Link from "next/link"
import { withLocale } from "@/lib/i18n"

export function Footer({ locale }: { locale?: string }) {
  return (
    <footer className="border-t border-border/40 dark:border-border py-12">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href={withLocale("/", locale)} className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍌</span>
              <span className="text-xl font-bold">Image Banana</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Independent product. Not affiliated with Google or AI model providers.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={withLocale("/generator", locale)} className="hover:text-foreground transition-colors">
                  Image Editor
                </Link>
              </li>
              <li>
                <Link href={withLocale("/pricing", locale)} className="hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href={withLocale("/showcase", locale)} className="hover:text-foreground transition-colors">
                  Showcase
                </Link>
              </li>
              <li>
                <Link href={withLocale("/tools/background-remover", locale)} className="hover:text-foreground transition-colors">
                  Background Remover
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={withLocale("/privacy", locale)} className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={withLocale("/terms", locale)} className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href={withLocale("/refund", locale)} className="hover:text-foreground transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href={withLocale("/refund-application", locale)} className="hover:text-foreground transition-colors">
                  Refund Application
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 dark:border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Image Banana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
