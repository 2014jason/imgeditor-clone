export type PlanKey = "basic"

export type UserEntitlements = {
  userId: string
  creditsBalance: number
  subscriptionActive: boolean
  plan: PlanKey | null
  subscriptionStatus?: string | null
  subscriptionProductId?: string | null
  subscriptionCurrentPeriodEnd?: string | null
  updatedAt?: string | null
}

export type BillingEvent = {
  webhookId: string
  eventType: string
  userId: string | null
  payload?: unknown
}

export type BillingBackend = "supabase" | "local"

export type BillingErrorCode = "insufficient_credits" | "subscription_required" | "billing_not_configured"

export class BillingError extends Error {
  code: BillingErrorCode

  constructor(code: BillingErrorCode, message: string) {
    super(message)
    this.code = code
  }
}

