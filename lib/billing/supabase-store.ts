import type { PostgrestError } from "@supabase/supabase-js"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import type { BillingEvent, PlanKey, UserEntitlements } from "@/lib/billing/types"
import { BillingError } from "@/lib/billing/types"

type UserEntitlementsRow = {
  user_id: string
  credits_balance: number
  subscription_active: boolean
  plan: PlanKey | null
  subscription_status: string | null
  subscription_product_id: string | null
  subscription_current_period_end: string | null
  updated_at: string
}

function toPublicEntitlements(row: UserEntitlementsRow): UserEntitlements {
  return {
    userId: row.user_id,
    creditsBalance: row.credits_balance,
    subscriptionActive: row.subscription_active,
    plan: row.plan,
    subscriptionStatus: row.subscription_status,
    subscriptionProductId: row.subscription_product_id,
    subscriptionCurrentPeriodEnd: row.subscription_current_period_end,
    updatedAt: row.updated_at,
  }
}

function initialCredits() {
  const raw = process.env.BILLING_INITIAL_CREDITS
  if (!raw) return 0
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) ? Math.max(0, n) : 0
}

function isUniqueViolation(error: PostgrestError | null) {
  return Boolean(error && (error.code === "23505" || error.details?.includes("already exists")))
}

export async function ensureSupabaseEntitlements(userId: string) {
  const supabase = createSupabaseAdminClient()
  const credits = initialCredits()

  const { error } = await supabase
    .from("user_entitlements")
    .upsert(
      {
        user_id: userId,
        credits_balance: credits,
      },
      { onConflict: "user_id", ignoreDuplicates: true },
    )

  if (error) throw error
}

export async function getSupabaseEntitlements(userId: string): Promise<UserEntitlements> {
  const supabase = createSupabaseAdminClient()
  await ensureSupabaseEntitlements(userId)

  const { data, error } = await supabase
    .from("user_entitlements")
    .select(
      "user_id,credits_balance,subscription_active,plan,subscription_status,subscription_product_id,subscription_current_period_end,updated_at",
    )
    .eq("user_id", userId)
    .maybeSingle()

  if (error) throw error
  if (!data) {
    throw new Error("Missing entitlements row after ensure.")
  }
  return toPublicEntitlements(data as UserEntitlementsRow)
}

export async function addSupabaseCredits(userId: string, amount: number): Promise<UserEntitlements> {
  if (!Number.isFinite(amount) || amount <= 0) return getSupabaseEntitlements(userId)
  const supabase = createSupabaseAdminClient()
  await ensureSupabaseEntitlements(userId)

  const { data, error } = await supabase.rpc("billing_add_credits", {
    p_user_id: userId,
    p_amount: Math.floor(amount),
  })

  if (error) throw error

  // billing_add_credits returns the updated row.
  return toPublicEntitlements(data as unknown as UserEntitlementsRow)
}

export async function consumeSupabaseCredits(userId: string, amount: number): Promise<UserEntitlements> {
  if (!Number.isFinite(amount) || amount <= 0) return getSupabaseEntitlements(userId)
  const supabase = createSupabaseAdminClient()
  await ensureSupabaseEntitlements(userId)

  const { data, error } = await supabase.rpc("billing_consume_credits", {
    p_user_id: userId,
    p_amount: Math.floor(amount),
  })

  if (error) {
    const msg = error.message || ""
    if (msg.includes("insufficient_credits")) {
      throw new BillingError("insufficient_credits", "Insufficient credits.")
    }
    throw error
  }

  return toPublicEntitlements(data as unknown as UserEntitlementsRow)
}

export async function setSupabaseSubscription({
  userId,
  active,
  plan,
  status,
  productId,
  currentPeriodEnd,
}: {
  userId: string
  active: boolean
  plan: PlanKey | null
  status?: string | null
  productId?: string | null
  currentPeriodEnd?: string | null
}): Promise<UserEntitlements> {
  const supabase = createSupabaseAdminClient()
  await ensureSupabaseEntitlements(userId)

  const patch: Partial<UserEntitlementsRow> = {
    subscription_active: Boolean(active),
    plan: plan ?? null,
    subscription_status: status ?? null,
    subscription_product_id: productId ?? null,
    subscription_current_period_end: currentPeriodEnd ?? null,
  }

  const { data, error } = await supabase
    .from("user_entitlements")
    .update(patch)
    .eq("user_id", userId)
    .select(
      "user_id,credits_balance,subscription_active,plan,subscription_status,subscription_product_id,subscription_current_period_end,updated_at",
    )
    .single()

  if (error) throw error
  return toPublicEntitlements(data as UserEntitlementsRow)
}

export async function tryMarkSupabaseWebhookProcessed(event: BillingEvent): Promise<boolean> {
  const supabase = createSupabaseAdminClient()

  const { error } = await supabase.from("billing_events").insert({
    webhook_id: event.webhookId,
    event_type: event.eventType,
    user_id: event.userId,
    payload: event.payload ?? null,
  })

  if (isUniqueViolation(error)) return false
  if (error) throw error
  return true
}

