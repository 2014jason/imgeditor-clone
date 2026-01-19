import type { BillingBackend, BillingEvent, PlanKey, UserEntitlements } from "@/lib/billing/types"
import {
  addLocalCredits,
  consumeLocalCredits,
  getLocalEntitlements,
  setLocalSubscription,
  tryMarkLocalWebhookProcessed,
} from "@/lib/billing/local-store"
import {
  addSupabaseCredits,
  consumeSupabaseCredits,
  getSupabaseEntitlements,
  setSupabaseSubscription,
  tryMarkSupabaseWebhookProcessed,
} from "@/lib/billing/supabase-store"

export function getBillingBackend(): BillingBackend {
  const forced = process.env.BILLING_BACKEND
  if (forced === "local" || forced === "supabase") return forced
  return process.env.SUPABASE_SERVICE_ROLE_KEY ? "supabase" : "local"
}

export async function getEntitlements(userId: string): Promise<UserEntitlements> {
  const backend = getBillingBackend()
  return backend === "supabase" ? getSupabaseEntitlements(userId) : getLocalEntitlements(userId)
}

export async function addCredits(userId: string, amount: number): Promise<UserEntitlements> {
  const backend = getBillingBackend()
  return backend === "supabase" ? addSupabaseCredits(userId, amount) : addLocalCredits(userId, amount)
}

export async function consumeCredits(userId: string, amount: number): Promise<UserEntitlements> {
  const backend = getBillingBackend()
  return backend === "supabase" ? consumeSupabaseCredits(userId, amount) : consumeLocalCredits(userId, amount)
}

export async function setSubscription(args: {
  userId: string
  active: boolean
  plan: PlanKey | null
  status?: string | null
  productId?: string | null
  currentPeriodEnd?: string | null
}): Promise<UserEntitlements> {
  const backend = getBillingBackend()
  return backend === "supabase" ? setSupabaseSubscription(args) : setLocalSubscription(args)
}

export async function tryMarkWebhookProcessed(event: BillingEvent): Promise<boolean> {
  const backend = getBillingBackend()
  return backend === "supabase" ? tryMarkSupabaseWebhookProcessed(event) : tryMarkLocalWebhookProcessed(event)
}

