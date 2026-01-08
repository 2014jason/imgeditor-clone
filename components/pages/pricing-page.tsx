"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly")

  const plans = useMemo(
    () => [
      {
        name: "Basic",
        description: "Perfect for individuals and light users",
        monthly: 9,
        yearly: 79,
        features: ["Standard generation speed", "JPG/PNG format downloads", "Basic customer support"],
      },
      {
        name: "Pro",
        description: "For professional creators and teams",
        monthly: 19,
        yearly: 149,
        badge: "Most Popular",
        features: [
          "Priority generation queue",
          "Support Seedream-4 Model",
          "Support Nanobanana-Pro Model",
          "JPG/PNG/WebP format downloads",
          "Batch generation feature",
        ],
      },
      {
        name: "Max",
        description: "Designed for large teams and studios",
        monthly: 49,
        yearly: 349,
        features: ["Fastest generation speed", "All format downloads", "Batch generation feature", "Dedicated support"],
      },
    ],
    [],
  )

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200">
          🍌 Limited Time: Save with Annual Billing
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mt-4">Choose Your Perfect Plan</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-3">
          Pricing is a placeholder in this clone. Wire up billing when you’re ready.
        </p>
      </div>

      <Tabs defaultValue="subscriptions" className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <TabsList>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="team">Team Plans</TabsTrigger>
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
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full">
                🔥 LIMITED TIME: Save 50%
              </span>
            </button>
          </div>
        </div>

        <TabsContent value="subscriptions">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const price = billing === "monthly" ? plan.monthly : plan.yearly
              const suffix = billing === "monthly" ? "/mo" : "/year"
              return (
                <Card key={plan.name} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{plan.name}</CardTitle>
                      {plan.badge ? (
                        <Badge className="bg-yellow-500 text-yellow-950 hover:bg-yellow-500">{plan.badge}</Badge>
                      ) : null}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">
                      ${price}
                      <span className="text-sm font-normal text-muted-foreground">{suffix}</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature}>• {feature}</li>
                      ))}
                    </ul>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="team">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Team Plans</CardTitle>
              <CardDescription>Placeholder team workspace / seats UI (to align with imgeditor.co layout).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Implement seats, permissions, centralized billing and usage reports when you wire up auth + billing.
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Contact Support</Button>
                <Button variant="outline" className="bg-transparent">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packs">
          <div className="mb-6 rounded-2xl border border-border bg-secondary/30 dark:bg-secondary/20 p-4">
            <div className="text-sm font-medium">💡 No Subscription Required - One-Time Payment</div>
            <div className="text-xs text-muted-foreground mt-1">
              Credit packs are one-time purchases that never expire.
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Starter Pack", credits: 200, desc: "Try out our AI capabilities" },
              { name: "Growth Pack", credits: 533, desc: "Perfect for regular creators" },
              { name: "Professional Pack", credits: 1333, desc: "For serious content creators" },
              { name: "Enterprise Pack", credits: 5333, desc: "Maximum value for teams" },
            ].map((pack) => (
              <Card key={pack.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{pack.name}</CardTitle>
                  <CardDescription>{pack.desc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-2xl font-bold">{pack.credits} credits</div>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Buy Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
