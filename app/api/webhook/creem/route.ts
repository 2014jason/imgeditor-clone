import { NextResponse } from "next/server"
import { Webhook } from "@creem_io/nextjs"
import {
  handleCreemCheckoutCompleted,
  handleCreemSubscriptionActive,
  handleCreemSubscriptionExpired,
  handleCreemSubscriptionPaid,
  handleCreemSubscriptionPaused,
  handleCreemSubscriptionTrialing,
} from "@/lib/billing/creem"

export const runtime = "nodejs"

const webhookSecret = process.env.CREEM_WEBHOOK_SECRET

export const POST = webhookSecret
  ? Webhook({
      webhookSecret,
      onCheckoutCompleted: async (data) => {
        await handleCreemCheckoutCompleted(data)
      },
      onSubscriptionActive: async (data) => {
        await handleCreemSubscriptionActive(data)
      },
      onSubscriptionTrialing: async (data) => {
        await handleCreemSubscriptionTrialing(data)
      },
      onSubscriptionPaid: async (data) => {
        await handleCreemSubscriptionPaid(data)
      },
      onSubscriptionPaused: async (data) => {
        await handleCreemSubscriptionPaused(data)
      },
      onSubscriptionExpired: async (data) => {
        await handleCreemSubscriptionExpired(data)
      },
    })
  : async () => {
      return NextResponse.json(
        { error: "Missing CREEM_WEBHOOK_SECRET. Add it to .env.local to enable webhook verification." },
        { status: 500 },
      )
    }
