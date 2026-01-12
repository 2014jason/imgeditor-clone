import { NextResponse } from "next/server"
import { Webhook } from "@creem_io/nextjs"

export const runtime = "nodejs"

const webhookSecret = process.env.CREEM_WEBHOOK_SECRET

export const POST = webhookSecret
  ? Webhook({
      webhookSecret,
      onCheckoutCompleted: async ({ customer, product, metadata }) => {
        console.log("[creem] checkout.completed", {
          customer: customer?.email,
          product: product?.id,
          metadata,
        })
      },
      onGrantAccess: async ({ reason, customer, product, metadata }) => {
        console.log("[creem] grant.access", {
          reason,
          customer: customer?.email,
          product: product?.id,
          metadata,
        })
      },
      onRevokeAccess: async ({ reason, customer, product, metadata }) => {
        console.log("[creem] revoke.access", {
          reason,
          customer: customer?.email,
          product: product?.id,
          metadata,
        })
      },
    })
  : async () => {
      return NextResponse.json(
        { error: "Missing CREEM_WEBHOOK_SECRET. Add it to .env.local to enable webhook verification." },
        { status: 500 },
      )
    }

