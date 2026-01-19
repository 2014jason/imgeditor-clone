import type { PlanKey } from "@/lib/billing/types"

export const PLANS: Record<
  PlanKey,
  {
    monthlyCredits: number
  }
> = {
  basic: {
    monthlyCredits: 200,
  },
}

export const CREDIT_PACKS = {
  starter: { credits: 500 },
  growth: { credits: 1500 },
  professional: { credits: 3600 },
  enterprise: { credits: 15000 },
} as const

export type CreditPackKey = keyof typeof CREDIT_PACKS

export function getCreditsForPack(pack: CreditPackKey) {
  return CREDIT_PACKS[pack].credits
}

export function getPlanKeyForProductId(productId: string | null | undefined): PlanKey | null {
  if (!productId) return null

  const basicMonthly = process.env.NEXT_PUBLIC_CREEM_PRODUCT_BASIC_MONTHLY
  const basicYearly = process.env.NEXT_PUBLIC_CREEM_PRODUCT_BASIC_YEARLY

  if (productId === basicMonthly || productId === basicYearly) return "basic"
  return null
}

export function getCreditPackKeyForProductId(productId: string | null | undefined): CreditPackKey | null {
  if (!productId) return null

  const starter = process.env.NEXT_PUBLIC_CREEM_PRODUCT_PACK_STARTER
  const growth = process.env.NEXT_PUBLIC_CREEM_PRODUCT_PACK_GROWTH
  const professional = process.env.NEXT_PUBLIC_CREEM_PRODUCT_PACK_PROFESSIONAL
  const enterprise = process.env.NEXT_PUBLIC_CREEM_PRODUCT_PACK_ENTERPRISE

  if (productId === starter) return "starter"
  if (productId === growth) return "growth"
  if (productId === professional) return "professional"
  if (productId === enterprise) return "enterprise"
  return null
}

