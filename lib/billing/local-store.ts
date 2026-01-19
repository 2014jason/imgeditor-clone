import fs from "node:fs/promises"
import path from "node:path"
import type { BillingEvent, PlanKey, UserEntitlements } from "@/lib/billing/types"
import { BillingError } from "@/lib/billing/types"

type StoredEntitlements = {
  user_id: string
  credits_balance: number
  subscription_active: boolean
  plan: PlanKey | null
  subscription_status?: string | null
  subscription_product_id?: string | null
  subscription_current_period_end?: string | null
  updated_at: string
}

type StoreFile = {
  entitlements: Record<string, StoredEntitlements>
  processed_webhooks: Record<
    string,
    {
      webhook_id: string
      event_type: string
      user_id: string | null
      processed_at: string
    }
  >
}

function getStorePath() {
  return path.join(process.cwd(), ".local", "billing.json")
}

function nowIso() {
  return new Date().toISOString()
}

function parseInitialCredits() {
  const raw = process.env.BILLING_INITIAL_CREDITS
  if (!raw) return 50 // local-only convenience default
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) ? Math.max(0, n) : 50
}

async function readStore(): Promise<StoreFile> {
  const storePath = getStorePath()
  try {
    const raw = await fs.readFile(storePath, "utf8")
    const json = JSON.parse(raw) as StoreFile
    return {
      entitlements: json.entitlements ?? {},
      processed_webhooks: json.processed_webhooks ?? {},
    }
  } catch (err) {
    // file does not exist or invalid json
    return { entitlements: {}, processed_webhooks: {} }
  }
}

async function writeStore(store: StoreFile) {
  const storePath = getStorePath()
  await fs.mkdir(path.dirname(storePath), { recursive: true })
  await fs.writeFile(storePath, JSON.stringify(store, null, 2), "utf8")
}

function toPublicEntitlements(row: StoredEntitlements): UserEntitlements {
  return {
    userId: row.user_id,
    creditsBalance: row.credits_balance,
    subscriptionActive: row.subscription_active,
    plan: row.plan,
    subscriptionStatus: row.subscription_status ?? null,
    subscriptionProductId: row.subscription_product_id ?? null,
    subscriptionCurrentPeriodEnd: row.subscription_current_period_end ?? null,
    updatedAt: row.updated_at,
  }
}

export async function ensureLocalEntitlements(userId: string): Promise<UserEntitlements> {
  const store = await readStore()
  const existing = store.entitlements[userId]
  if (existing) return toPublicEntitlements(existing)

  const row: StoredEntitlements = {
    user_id: userId,
    credits_balance: parseInitialCredits(),
    subscription_active: false,
    plan: null,
    updated_at: nowIso(),
  }
  store.entitlements[userId] = row
  await writeStore(store)
  return toPublicEntitlements(row)
}

export async function getLocalEntitlements(userId: string): Promise<UserEntitlements> {
  return ensureLocalEntitlements(userId)
}

export async function addLocalCredits(userId: string, amount: number): Promise<UserEntitlements> {
  if (!Number.isFinite(amount) || amount <= 0) return getLocalEntitlements(userId)

  const store = await readStore()
  const existing = store.entitlements[userId]
  const row: StoredEntitlements = existing ?? {
    user_id: userId,
    credits_balance: 0,
    subscription_active: false,
    plan: null,
    updated_at: nowIso(),
  }
  row.credits_balance = Math.max(0, row.credits_balance + Math.floor(amount))
  row.updated_at = nowIso()
  store.entitlements[userId] = row
  await writeStore(store)
  return toPublicEntitlements(row)
}

export async function consumeLocalCredits(userId: string, amount: number): Promise<UserEntitlements> {
  if (!Number.isFinite(amount) || amount <= 0) return getLocalEntitlements(userId)

  const store = await readStore()
  const row = store.entitlements[userId]
  if (!row) {
    // ensure creates initial credits
    await writeStore(store)
    return consumeLocalCredits(userId, amount)
  }

  const needed = Math.floor(amount)
  if (row.credits_balance < needed) {
    throw new BillingError("insufficient_credits", "Insufficient credits.")
  }

  row.credits_balance -= needed
  row.updated_at = nowIso()
  store.entitlements[userId] = row
  await writeStore(store)
  return toPublicEntitlements(row)
}

export async function setLocalSubscription({
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
  const store = await readStore()
  const existing = store.entitlements[userId]
  const row: StoredEntitlements = existing ?? {
    user_id: userId,
    credits_balance: parseInitialCredits(),
    subscription_active: false,
    plan: null,
    updated_at: nowIso(),
  }

  row.subscription_active = Boolean(active)
  row.plan = plan ?? row.plan ?? null
  row.subscription_status = status ?? row.subscription_status ?? null
  row.subscription_product_id = productId ?? row.subscription_product_id ?? null
  row.subscription_current_period_end = currentPeriodEnd ?? row.subscription_current_period_end ?? null
  row.updated_at = nowIso()

  store.entitlements[userId] = row
  await writeStore(store)
  return toPublicEntitlements(row)
}

export async function tryMarkLocalWebhookProcessed(event: BillingEvent): Promise<boolean> {
  const store = await readStore()
  if (store.processed_webhooks[event.webhookId]) return false

  store.processed_webhooks[event.webhookId] = {
    webhook_id: event.webhookId,
    event_type: event.eventType,
    user_id: event.userId,
    processed_at: nowIso(),
  }
  await writeStore(store)
  return true
}

