import type { FlatCheckoutCompleted, FlatSubscriptionEvent } from "@creem_io/nextjs"
import { addCredits, setSubscription, tryMarkWebhookProcessed } from "@/lib/billing"
import { getCreditPackKeyForProductId, getCreditsForPack, getPlanKeyForProductId, PLANS } from "@/lib/billing/catalog"
import type { PlanKey } from "@/lib/billing/types"

function getReferenceId(metadata: Record<string, unknown> | null | undefined): string | null {
  const ref = (metadata as any)?.referenceId
  return typeof ref === "string" && ref.trim().length > 0 ? ref : null
}

function normalizeBillingPeriod(billingPeriod: unknown): "every-month" | "every-year" | null {
  return billingPeriod === "every-month" || billingPeriod === "every-year" ? billingPeriod : null
}

function creditsForSubscriptionPaid(plan: PlanKey, billingPeriod: "every-month" | "every-year" | null) {
  const base = PLANS[plan].monthlyCredits
  return billingPeriod === "every-year" ? base * 12 : base
}

export async function handleCreemCheckoutCompleted(data: FlatCheckoutCompleted) {
  const userId = getReferenceId(data.metadata as any)
  if (!userId) {
    console.warn("[creem] checkout.completed missing metadata.referenceId")
    return
  }

  const processed = await tryMarkWebhookProcessed({
    webhookId: data.webhookId,
    eventType: data.webhookEventType,
    userId,
    payload: {
      productId: data.product?.id,
      billingType: data.product?.billing_type,
      metadata: data.metadata,
    },
  })
  if (!processed) return

  const productId = data.product?.id
  const billingType = data.product?.billing_type

  if (billingType === "one-time") {
    const pack = getCreditPackKeyForProductId(productId)
    if (!pack) {
      console.warn("[creem] checkout.completed one-time product is not mapped", { productId })
      return
    }
    const credits = getCreditsForPack(pack)
    await addCredits(userId, credits)
    console.log("[creem] credits.added", { userId, pack, credits })
    return
  }

  // For recurring products, access is handled by subscription events below.
  const plan = getPlanKeyForProductId(productId) ?? (typeof (data.metadata as any)?.plan === "string" ? ((data.metadata as any).plan as PlanKey) : null)
  if (plan) {
    await setSubscription({
      userId,
      active: true,
      plan,
      status: data.subscription?.status ?? null,
      productId: productId ?? null,
      currentPeriodEnd: null,
    })
  }
}

async function handleSubscriptionGrant(data: FlatSubscriptionEvent<any>): Promise<boolean> {
  const userId = getReferenceId(data.metadata as any)
  if (!userId) {
    console.warn("[creem] subscription event missing metadata.referenceId", { eventType: data.webhookEventType })
    return false
  }

  const processed = await tryMarkWebhookProcessed({
    webhookId: data.webhookId,
    eventType: data.webhookEventType,
    userId,
    payload: {
      subscriptionId: data.id,
      status: data.status,
      productId: data.product?.id,
      billingPeriod: (data.product as any)?.billing_period,
      currentPeriodEnd: (data as any).current_period_end_date,
      metadata: data.metadata,
    },
  })
  if (!processed) return false

  const plan = getPlanKeyForProductId(data.product?.id) ?? (typeof (data.metadata as any)?.plan === "string" ? ((data.metadata as any).plan as PlanKey) : null)

  await setSubscription({
    userId,
    active: true,
    plan,
    status: data.status ?? null,
    productId: data.product?.id ?? null,
    currentPeriodEnd:
      data.current_period_end_date instanceof Date ? data.current_period_end_date.toISOString() : null,
  })

  return true
}

async function handleSubscriptionRevoke(data: FlatSubscriptionEvent<any>): Promise<boolean> {
  const userId = getReferenceId(data.metadata as any)
  if (!userId) {
    console.warn("[creem] subscription event missing metadata.referenceId", { eventType: data.webhookEventType })
    return false
  }

  const processed = await tryMarkWebhookProcessed({
    webhookId: data.webhookId,
    eventType: data.webhookEventType,
    userId,
    payload: {
      subscriptionId: data.id,
      status: data.status,
      productId: data.product?.id,
      metadata: data.metadata,
    },
  })
  if (!processed) return false

  const plan = getPlanKeyForProductId(data.product?.id) ?? (typeof (data.metadata as any)?.plan === "string" ? ((data.metadata as any).plan as PlanKey) : null)

  await setSubscription({
    userId,
    active: false,
    plan,
    status: data.status ?? null,
    productId: data.product?.id ?? null,
    currentPeriodEnd:
      data.current_period_end_date instanceof Date ? data.current_period_end_date.toISOString() : null,
  })

  return true
}

export async function handleCreemSubscriptionActive(data: FlatSubscriptionEvent<"subscription.active">) {
  await handleSubscriptionGrant(data)
}

export async function handleCreemSubscriptionTrialing(data: FlatSubscriptionEvent<"subscription.trialing">) {
  await handleSubscriptionGrant(data)
}

export async function handleCreemSubscriptionPaid(data: FlatSubscriptionEvent<"subscription.paid">) {
  const processed = await handleSubscriptionGrant(data)
  if (!processed) return

  const userId = getReferenceId(data.metadata as any)
  if (!userId) return

  const plan = getPlanKeyForProductId(data.product?.id) ?? (typeof (data.metadata as any)?.plan === "string" ? ((data.metadata as any).plan as PlanKey) : null)
  if (!plan) return

  const billingPeriod = normalizeBillingPeriod((data.product as any)?.billing_period)
  const credits = creditsForSubscriptionPaid(plan, billingPeriod)

  await addCredits(userId, credits)
  console.log("[creem] subscription.paid credits.added", { userId, plan, billingPeriod, credits })
}

export async function handleCreemSubscriptionExpired(data: FlatSubscriptionEvent<"subscription.expired">) {
  await handleSubscriptionRevoke(data)
}

export async function handleCreemSubscriptionPaused(data: FlatSubscriptionEvent<"subscription.paused">) {
  await handleSubscriptionRevoke(data)
}
