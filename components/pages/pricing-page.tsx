"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js"
import { CreemCheckout } from "@creem_io/nextjs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Check, Sparkles } from "lucide-react"
import { withLocale } from "@/lib/i18n"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { getSupabaseConfigOptional } from "@/lib/supabase/config"

type BillingCycle = "monthly" | "yearly"
type Currency = "USD" | "EUR" | "GBP" | "CNY"

type PlanKey = "basic"

type Plan = {
  key: PlanKey
  name: string
  description: string
  badge?: string
  monthlyPriceUsd: number
  yearlyPriceUsd: number
  monthlyCredits: number
  maxImagesPerBatch: number
  priority: string
  maxQueue: number
  commercialUse: boolean
  creditPurchase: boolean
  hqExports: boolean
  upscale: boolean
  unblur: boolean
}

function formatUsd(value: number) {
  return `$${value.toFixed(2)}`
}

function getDisplayName(user: User) {
  const metadata = user.user_metadata as Record<string, unknown> | null
  const fullName = typeof metadata?.full_name === "string" ? metadata.full_name : null
  const name = typeof metadata?.name === "string" ? metadata.name : null
  return fullName || name || user.email || "Customer"
}

function FeatureRow({ label, value }: { label: string; value: string | boolean }) {
  const text = typeof value === "boolean" ? (value ? "✅" : "—") : value
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{text}</span>
    </div>
  )
}

function CheckoutCta({
  label,
  productId,
  referenceId,
  customerEmail,
  customerName,
  units = 1,
  successUrl,
  cancelUrl,
  metadata,
  disabledReason,
}: {
  label: string
  productId: string | null
  referenceId: string | null
  customerEmail: string | null
  customerName: string | null
  units?: number
  successUrl: string
  cancelUrl: string
  metadata: Record<string, string | number | null>
  disabledReason?: string
}) {
  if (!referenceId) {
    return (
      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled>
        Sign in to purchase
      </Button>
    )
  }

  if (!productId) {
    return (
      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled title={disabledReason}>
        Configure productId
      </Button>
    )
  }

  return (
    <CreemCheckout
      productId={productId}
      units={units}
      successUrl={successUrl}
      customer={customerEmail ? { email: customerEmail, name: customerName ?? undefined } : undefined}
      referenceId={referenceId}
      metadata={metadata}
    >
      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">{label}</Button>
    </CreemCheckout>
  )
}

export function PricingPage({ locale }: { locale?: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const next = useMemo(() => {
    const query = searchParams?.toString()
    return query ? `${pathname}?${query}` : pathname
  }, [pathname, searchParams])

  const loginHref = useMemo(() => `/auth/login?next=${encodeURIComponent(next)}`, [next])

  const [billing, setBilling] = useState<BillingCycle>("yearly")
  const [currency, setCurrency] = useState<Currency>("USD")

  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const config = getSupabaseConfigOptional()
    if (!config) {
      setUser(null)
      setAuthReady(true)
      return
    }

    const supabase = createSupabaseBrowserClient()
    let mounted = true

    const load = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        if (!mounted) return
        setUser(data.user ?? null)
      } finally {
        if (mounted) setAuthReady(true)
      }
    }
    void load()

    const { data } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  const plans = useMemo<Plan[]>(
    () => [
      {
        key: "basic",
        name: "Basic",
        description: "Great for individuals and casual users",
        monthlyPriceUsd: 13.5,
        yearlyPriceUsd: 129.6,
        monthlyCredits: 200,
        maxImagesPerBatch: 100,
        priority: "Standard",
        maxQueue: 5,
        commercialUse: true,
        creditPurchase: true,
        hqExports: true,
        upscale: false,
        unblur: false,
      },
    ],
    [],
  )

  const productIds = useMemo(
    () => ({
      basic: {
        monthly: process.env.NEXT_PUBLIC_CREEM_PRODUCT_BASIC_MONTHLY ?? null,
        yearly: process.env.NEXT_PUBLIC_CREEM_PRODUCT_BASIC_YEARLY ?? null,
      },
      packs: {
        starter: process.env.NEXT_PUBLIC_CREEM_PRODUCT_PACK_STARTER ?? null,
        growth: process.env.NEXT_PUBLIC_CREEM_PRODUCT_PACK_GROWTH ?? null,
        professional: process.env.NEXT_PUBLIC_CREEM_PRODUCT_PACK_PROFESSIONAL ?? null,
        enterprise: process.env.NEXT_PUBLIC_CREEM_PRODUCT_PACK_ENTERPRISE ?? null,
      },
    }),
    [],
  )

  const successUrl = withLocale("/thank-you", locale)
  const cancelUrl = withLocale("/pricing", locale)

  const customerName = user ? getDisplayName(user) : null
  const customerEmail = user?.email ?? null
  const referenceId = user?.id ?? null

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
          <span className="text-lg">🍌</span>
          <span>image banana</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mt-3">Pricing</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-2xl mx-auto leading-relaxed">
          Choose the best plan for your workflow. This clone follows the layout of imgeditor.co and wires checkout via
          Creem.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            LIMITED TIME: 10% lower than imgeditor
          </Badge>

          <div className="inline-flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Currency</span>
            <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="CNY">CNY (¥)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="subscriptions" className="mx-auto mt-10 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <TabsList>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="packs">Credit Packs</TabsTrigger>
          </TabsList>

          <div className="inline-flex items-center rounded-2xl p-0.5 border border-border bg-secondary/30 dark:bg-secondary/20">
            <button
              type="button"
              className={`px-5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                billing === "monthly"
                  ? "bg-background shadow-sm"
                  : "hover:bg-background/50 dark:hover:bg-card/50 text-muted-foreground"
              }`}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`relative px-5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                billing === "yearly"
                  ? "bg-yellow-500 text-yellow-950 shadow-sm"
                  : "hover:bg-yellow-500/20 text-muted-foreground"
              }`}
              onClick={() => setBilling("yearly")}
            >
              Yearly
            </button>
          </div>
        </div>

        <TabsContent value="subscriptions">
          {!authReady ? (
            <div className="text-sm text-muted-foreground">Loading account…</div>
          ) : !user ? (
            <div className="mb-6 rounded-2xl border border-border bg-secondary/30 dark:bg-secondary/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm">
                <div className="font-medium">Sign in to subscribe</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  We attach purchases to your account via Supabase user id.
                </div>
              </div>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href={loginHref}>Continue with Google</Link>
              </Button>
            </div>
          ) : null}

          <div className="grid gap-6 max-w-3xl mx-auto">
            {plans.map((plan) => {
              const price = billing === "monthly" ? plan.monthlyPriceUsd : plan.yearlyPriceUsd
              const perMonth = billing === "yearly" ? plan.yearlyPriceUsd / 12 : plan.monthlyPriceUsd

              const productId = productIds[plan.key][billing]
              const disabledReason = `Missing NEXT_PUBLIC_CREEM_PRODUCT_${plan.key.toUpperCase()}_${billing.toUpperCase()} in .env.local`

              return (
                <Card key={plan.key} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      {plan.badge ? (
                        <Badge className="bg-yellow-500 text-yellow-950 hover:bg-yellow-500">{plan.badge}</Badge>
                      ) : null}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-1">
                      <div className="text-4xl font-bold">
                        {currency === "USD" ? formatUsd(perMonth) : formatUsd(perMonth)}
                        <span className="text-sm font-normal text-muted-foreground ml-1">/mo</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {billing === "monthly" ? `Billed monthly (${formatUsd(price)})` : `Billed yearly (${formatUsd(price)})`}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <FeatureRow label="Monthly credits" value={`${plan.monthlyCredits}`} />
                      <FeatureRow label="Max images per batch" value={`${plan.maxImagesPerBatch}`} />
                      <FeatureRow label="Priority" value={plan.priority} />
                      <FeatureRow label="Max queue" value={`${plan.maxQueue}`} />
                      <FeatureRow label="Commercial use" value={plan.commercialUse} />
                      <FeatureRow label="Credit purchase" value={plan.creditPurchase} />
                      <FeatureRow label="HQ exports" value={plan.hqExports} />
                      <FeatureRow label="Upscale" value={plan.upscale} />
                      <FeatureRow label="Unblur" value={plan.unblur} />
                    </div>

                    {user ? (
                      <CheckoutCta
                        label={`Get ${plan.name}`}
                        productId={productId}
                        referenceId={referenceId}
                        customerEmail={customerEmail}
                        customerName={customerName}
                        successUrl={successUrl}
                        cancelUrl={cancelUrl}
                        disabledReason={disabledReason}
                        metadata={{
                          plan: plan.key,
                          billing,
                          currency,
                        }}
                      />
                    ) : (
                      <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link href={loginHref}>Sign in to purchase</Link>
                      </Button>
                    )}

                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Cancel anytime. No hidden fees.
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="packs">
          <div className="mb-6 rounded-2xl border border-border bg-secondary/30 dark:bg-secondary/20 p-4">
            <div className="text-sm font-medium">💡 No Subscription Required - One-Time Payment</div>
            <div className="text-xs text-muted-foreground mt-1">Credit packs are one-time purchases that never expire.</div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { key: "starter", name: "Starter Pack", credits: 500, priceUsd: 27, productId: productIds.packs.starter },
              { key: "growth", name: "Growth Pack", credits: 1500, priceUsd: 72, productId: productIds.packs.growth },
              {
                key: "professional",
                name: "Professional Pack",
                credits: 3600,
                priceUsd: 180,
                productId: productIds.packs.professional,
              },
              { key: "enterprise", name: "Enterprise Pack", credits: 15000, priceUsd: 720, productId: productIds.packs.enterprise },
            ].map((pack) => {
              const disabledReason = `Missing NEXT_PUBLIC_CREEM_PRODUCT_PACK_${pack.key.toUpperCase()} in .env.local`
              return (
                <Card key={pack.key}>
                  <CardHeader>
                    <CardTitle className="text-lg">{pack.name}</CardTitle>
                    <CardDescription>{pack.credits} credits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">
                      {currency === "USD" ? formatUsd(pack.priceUsd) : formatUsd(pack.priceUsd)}
                      <span className="text-sm font-normal text-muted-foreground"> one-time</span>
                    </div>

                    {user ? (
                      <CheckoutCta
                        label="Buy Now"
                        productId={pack.productId}
                        referenceId={referenceId}
                        customerEmail={customerEmail}
                        customerName={customerName}
                        successUrl={successUrl}
                        cancelUrl={cancelUrl}
                        disabledReason={disabledReason}
                        metadata={{
                          type: "credit-pack",
                          pack: pack.key,
                          currency,
                          credits: pack.credits,
                        }}
                      />
                    ) : (
                      <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link href={loginHref}>Sign in to purchase</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mx-auto max-w-4xl mt-16">
        <h2 className="text-2xl font-bold mb-2">FAQs</h2>
        <p className="text-sm text-muted-foreground mb-6">Common questions about subscriptions and credits.</p>
        <Accordion type="single" collapsible className="space-y-3">
          {[
            {
              q: "How do I cancel?",
              a: "You can cancel anytime. After canceling, you keep access until the end of your billing period.",
            },
            {
              q: "Do credits expire?",
              a: "Credit packs are one-time purchases and do not expire in this clone. Adjust to your product policy.",
            },
            {
              q: "Can I upgrade later?",
              a: "Yes. Upgrading/downgrading typically takes effect on the next billing cycle depending on your billing setup.",
            },
            {
              q: "Where is payment handled?",
              a: "Checkout is handled by Creem. After payment, webhooks are used to grant/revoke access.",
            },
          ].map((item) => (
            <AccordionItem key={item.q} value={item.q} className="border border-border rounded-lg px-5 bg-card">
              <AccordionTrigger className="text-left hover:no-underline py-4">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
