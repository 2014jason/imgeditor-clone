import { NextResponse } from "next/server"
import { Checkout } from "@creem_io/nextjs"

export const runtime = "nodejs"

const apiKey = process.env.CREEM_API_KEY

export const GET = apiKey
  ? Checkout({
      apiKey,
      testMode: process.env.NODE_ENV !== "production",
      defaultSuccessUrl: "/thank-you",
    })
  : async () => {
      return NextResponse.json(
        { error: "Missing CREEM_API_KEY. Add it to .env.local and restart the dev server." },
        { status: 500 },
      )
    }

