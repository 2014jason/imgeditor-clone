"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Eraser, Layers, Ellipsis, ChevronDown } from "lucide-react"
import { withLocale } from "@/lib/i18n"

export function Header({ locale }: { locale?: string }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 dark:border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="border-b border-border/40 dark:border-border bg-accent/10 dark:bg-accent/5">
        <div className="container">
          <Link
            href={withLocale("/generator?model=nano-banana-pro", locale)}
            className="flex items-center justify-center gap-2 py-2 text-sm hover:opacity-80 transition-opacity"
          >
            <Badge
              variant="secondary"
              className="bg-yellow-400 text-black hover:bg-yellow-500 dark:bg-yellow-500 dark:text-yellow-950"
            >
              NEW
            </Badge>
            <span className="text-2xl">🍌</span>
            <span className="font-medium">image banana Pro is now live</span>
            <span className="text-primary">Try it now →</span>
          </Link>
        </div>
      </div>

      <div className="container flex h-16 items-center justify-between">
        <Link href={withLocale("/", locale)} className="flex items-center gap-2">
          <span className="text-2xl">🍌</span>
          <span className="text-xl font-bold">image banana</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href={withLocale("/generator", locale)} className="text-sm font-medium hover:text-foreground/80 transition-colors">
            Image Editor
          </Link>
          <Link href={withLocale("/showcase", locale)} className="text-sm font-medium hover:text-foreground/80 transition-colors">
            Showcase
          </Link>

          <div className="relative group">
            <button
              className="flex items-center gap-1 p-0 bg-transparent text-sm font-medium hover:text-foreground/80 transition-colors"
              aria-haspopup="true"
              aria-expanded="false"
              type="button"
            >
              Toolbox <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute top-full left-0 mt-2 min-w-[340px] bg-background border border-border rounded-xl shadow-lg invisible opacity-0 -translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 z-50">
              <div className="absolute -top-2 left-0 right-0 h-2" />
              <div className="p-1">
                <div className="pb-2">
                  <div className="text-xs text-muted-foreground uppercase font-semibold px-3 py-2">
                    Editing Tools
                  </div>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        className="flex items-center gap-3 px-3 py-2 text-sm hover:text-foreground hover:bg-secondary/60 rounded-lg transition-colors"
                        href={withLocale("/generator?mode=batch", locale)}
                      >
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        Batch Editor
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center gap-3 px-3 py-2 text-sm hover:text-foreground hover:bg-secondary/60 rounded-lg transition-colors"
                        href={withLocale("/tools/background-remover", locale)}
                      >
                        <Eraser className="h-4 w-4 text-muted-foreground" />
                        Background Remover
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="pb-2">
                  <div className="text-xs text-muted-foreground uppercase font-semibold px-3 py-2">More Tools</div>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        className="flex items-center gap-3 px-3 py-2 text-sm hover:text-foreground hover:bg-secondary/60 rounded-lg transition-colors"
                        href={withLocale("/#features", locale)}
                      >
                        <Ellipsis className="h-4 w-4 text-muted-foreground" />
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center gap-3 px-3 py-2 text-sm hover:text-foreground hover:bg-secondary/60 rounded-lg transition-colors"
                        href={withLocale("/#faq", locale)}
                      >
                        <Ellipsis className="h-4 w-4 text-muted-foreground" />
                        FAQ
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Link href={withLocale("/pricing", locale)} className="text-sm font-medium hover:text-foreground/80 transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="outline" className="hidden sm:inline-flex bg-transparent dark:border-border">
            Sign In
          </Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href={withLocale("/generator", locale)}>Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
