import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { addCredits, consumeCredits, getEntitlements } from "@/lib/billing"
import { BillingError } from "@/lib/billing/types"

const GUEST_TRIAL_COOKIE = "ib_guest_trial_generate_v1"

function sanitizeNextPath(path: string | null) {
  if (!path) return null
  try {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      const url = new URL(path)
      return `${url.pathname}${url.search}`
    }
  } catch {
    // ignore invalid absolute URLs
  }
  if (!path.startsWith("/")) return null
  if (path.startsWith("//")) return null
  return path
}

function getNextPath(request: Request) {
  const { searchParams } = new URL(request.url)
  const nextFromQuery = sanitizeNextPath(searchParams.get("next"))
  if (nextFromQuery) return nextFromQuery

  const referer = request.headers.get("referer")
  if (referer) {
    try {
      const url = new URL(referer)
      const nextFromReferer = sanitizeNextPath(`${url.pathname}${url.search}`)
      if (nextFromReferer) return nextFromReferer
    } catch {
      // ignore bad referer
    }
  }

  return "/generator"
}

export const runtime = "nodejs"

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

function getDebugUserId(req: Request) {
  if (process.env.DEV_BYPASS_AUTH !== "1") return null
  const candidate = req.headers.get("x-debug-user-id") ?? process.env.DEV_BYPASS_USER_ID ?? null
  if (!candidate) return null
  return isUuid(candidate) ? candidate : null
}

type GenerateRequestBody = {
  model?: unknown
  prompt?: unknown
  image?: unknown
  images?: unknown
  mode?: unknown
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function extractStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null
  const items = value.filter((v): v is string => typeof v === "string" && v.trim().length > 0)
  return items.length > 0 ? items : null
}

function extractImageUrls(payload: unknown): string[] {
  const urls: string[] = []

  if (!payload || typeof payload !== "object") return urls

  const choices = Array.isArray((payload as any).choices) ? (payload as any).choices : []
  for (const choice of choices) {
    const message = choice?.message
    if (!message) continue

    const images = Array.isArray(message.images) ? message.images : []
    for (const image of images) {
      const url = image?.image_url?.url ?? image?.imageUrl?.url
      if (typeof url === "string" && url.length > 0) urls.push(url)
    }

    const content = message.content
    if (Array.isArray(content)) {
      for (const part of content) {
        const url = part?.image_url?.url ?? part?.imageUrl?.url
        if (typeof url === "string" && url.length > 0) urls.push(url)
      }
    }
  }

  return Array.from(new Set(urls))
}

function extractText(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null
  const choices = Array.isArray((payload as any).choices) ? (payload as any).choices : []
  const message = choices[0]?.message
  if (!message) return null

  if (typeof message.content === "string") return message.content

  if (Array.isArray(message.content)) {
    const textParts = message.content
      .map((part: any) => (typeof part?.text === "string" ? part.text : ""))
      .filter(Boolean)
    if (textParts.length > 0) return textParts.join("\n")
  }

  return null
}

async function openRouterGenerate({
  apiKey,
  modelId,
  prompt,
  image,
  referer,
  title,
}: {
  apiKey: string
  modelId: string
  prompt: string
  image: string | null
  referer: string
  title: string
}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60_000)

  try {
    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": referer,
        "X-Title": title,
      },
      body: JSON.stringify({
        model: modelId,
        modalities: ["image", "text"],
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              ...(image ? [{ type: "image_url", image_url: { url: image } }] : []),
            ],
          },
        ],
      }),
      cache: "no-store",
      signal: controller.signal,
    })

    const rawText = await openRouterResponse.text()
    let json: unknown = null
    try {
      json = rawText ? (JSON.parse(rawText) as unknown) : null
    } catch {
      json = null
    }

    if (!openRouterResponse.ok) {
      const message = (json as any)?.error?.message
      const normalizedMessage =
        typeof message === "string" && message.length > 0
          ? message === "No cookie auth credentials found" || message.includes("cookie auth credentials")
            ? "OpenRouter did not receive auth credentials. Check OPENROUTER_API_KEY in .env.local and restart `pnpm dev`."
            : message
          : "OpenRouter request failed."
      return {
        ok: false as const,
        status: openRouterResponse.status,
        error: normalizedMessage,
        json,
      }
    }

    return {
      ok: true as const,
      status: openRouterResponse.status,
      json,
    }
  } catch (err) {
    const message =
      err instanceof Error && err.name === "AbortError"
        ? "OpenRouter request timed out."
        : err instanceof Error
          ? err.message
          : "OpenRouter request failed."
    return { ok: false as const, status: 504, error: message, json: null }
  } finally {
    clearTimeout(timeout)
  }
}

export async function POST(req: Request) {
  const origin = new URL(req.url).origin
  const loginPath = getNextPath(req)
  const loginUrl = `${origin}/auth/login?next=${encodeURIComponent(loginPath)}`

  const mockGeneration = process.env.MOCK_IMAGE_GENERATION === "1"

  let userId = getDebugUserId(req)
  const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  if (!userId && supabaseConfigured) {
    try {
      const supabase = await createSupabaseServerClient()
      const { data, error } = await supabase.auth.getUser()
      if (!error && data.user) userId = data.user.id
    } catch {
      // Treat failures as unauthenticated. Guest trial can still work locally.
    }
  }

  const apiKey = process.env.OPENROUTER_API_KEY ?? null
  if (!mockGeneration && !apiKey) {
    return NextResponse.json(
      { error: "Missing OPENROUTER_API_KEY. Add it to .env.local and restart the dev server." },
      { status: 500 },
    )
  }

  let body: GenerateRequestBody
  try {
    body = (await req.json()) as GenerateRequestBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const requestedModel = isNonEmptyString(body.model) ? body.model.trim() : "nano-banana"
  const modelId =
    requestedModel === "nano-banana-pro"
      ? process.env.OPENROUTER_IMAGE_MODEL_PRO ?? "google/gemini-3-pro-image-preview"
      : process.env.OPENROUTER_IMAGE_MODEL ?? "google/gemini-2.5-flash-image"

  const prompt = isNonEmptyString(body.prompt) ? body.prompt : ""
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 })
  }

  const imagesFromArray = extractStringArray(body.images)
  const imageFromLegacy = isNonEmptyString(body.image) ? body.image : null
  const images = imagesFromArray ?? (imageFromLegacy ? [imageFromLegacy] : [])

  const requestedMode =
    body.mode === "text-to-image" || body.mode === "image-to-image" ? body.mode : null
  const mode = requestedMode ?? (images.length > 0 ? "image-to-image" : "text-to-image")

  if (mode === "image-to-image" && images.length === 0) {
    return NextResponse.json({ error: "Reference image is required for image-to-image mode." }, { status: 400 })
  }

  const referer =
    process.env.OPENROUTER_HTTP_REFERER ??
    process.env.OPENROUTER_SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"

  const title = process.env.OPENROUTER_X_TITLE ?? process.env.OPENROUTER_APP_NAME ?? "image-banana"

  const runOnce = async (image: string | null) => {
    if (mockGeneration) {
      const id = mode === "text-to-image" ? "2" : "3"
      return {
        ok: true as const,
        status: 200,
        images: [`/showcase/${id}.png`],
        text: null,
      }
    }

    const resp = await openRouterGenerate({ apiKey: apiKey as string, modelId, prompt, image, referer, title })
    if (!resp.ok) {
      return { ok: false as const, status: resp.status, error: resp.error }
    }

    const images = extractImageUrls(resp.json)
    const text = extractText(resp.json)

    if (images.length === 0) {
      return { ok: false as const, status: 502, error: "No images returned from the model.", text }
    }

    return { ok: true as const, status: 200, images, text }
  }

  const cookieStore = await cookies()
  const guestTrialUsed = cookieStore.get(GUEST_TRIAL_COOKIE)?.value === "1"

  // Guest trial: allow a single non-batch generation without logging in.
  if (!userId) {
    if (mode === "image-to-image" && images.length > 1) {
      return NextResponse.json(
        { error: "auth_required", reason: "batch_requires_login", loginUrl },
        { status: 401 },
      )
    }
    if (guestTrialUsed) {
      return NextResponse.json(
        { error: "auth_required", reason: "trial_exhausted", loginUrl },
        { status: 401 },
      )
    }

    const resp = await runOnce(mode === "text-to-image" ? null : (images[0] ?? null))
    if (!resp.ok) {
      return NextResponse.json(
        { error: resp.error, text: "text" in resp ? resp.text : undefined },
        { status: resp.status },
      )
    }

    const response = NextResponse.json(
      { images: resp.images, text: resp.text, trialUsed: true },
      { status: 200 },
    )
    response.cookies.set(GUEST_TRIAL_COOKIE, "1", {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    })
    return response
  }

  // Billing: reserve 1 credit per OpenRouter request. Batch requires an active subscription.
  const creditsToReserve = mode === "text-to-image" ? 1 : Math.max(1, images.length)

  let entitlements = await getEntitlements(userId)
  if (mode === "image-to-image" && images.length > 1 && !entitlements.subscriptionActive) {
    return NextResponse.json(
      { error: "subscription_required", upgradeUrl: `${origin}/pricing` },
      { status: 403 },
    )
  }

  let reservedCredits = 0
  try {
    entitlements = await consumeCredits(userId, creditsToReserve)
    reservedCredits = creditsToReserve

    const refundCredits = async (amount: number) => {
      const toRefund = Math.max(0, Math.floor(amount))
      if (toRefund === 0) return
      entitlements = await addCredits(userId, toRefund)
      reservedCredits -= toRefund
    }

    // text-to-image (single request)
    if (mode === "text-to-image") {
      const resp = await runOnce(null)
      if (!resp.ok) {
        await refundCredits(1)
        return NextResponse.json(
          { error: resp.error, text: "text" in resp ? resp.text : undefined, creditsBalance: entitlements.creditsBalance },
          { status: resp.status },
        )
      }
      return NextResponse.json(
        { images: resp.images, text: resp.text, creditsBalance: entitlements.creditsBalance },
        { status: 200 },
      )
    }

    // image-to-image: single or batch (one request per input image)
    const results: Array<{ input: string; images: string[]; text: string | null }> = []
    const errors: Array<{ index: number; error: string }> = []

    for (const [index, image] of images.entries()) {
      const resp = await runOnce(image)
      if (!resp.ok) {
        errors.push({ index, error: resp.error })
        continue
      }
      results.push({ input: image, images: resp.images, text: resp.text })
    }

    // Refund failed items so we only charge for successful generations.
    if (errors.length > 0) {
      await refundCredits(errors.length)
    }

    const allImages = results.flatMap((r) => r.images)
    const combinedText = results
      .map((r) => r.text)
      .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
      .join("\n\n")

    if (allImages.length === 0) {
      // Nothing succeeded: refund everything that is still reserved.
      if (reservedCredits > 0) {
        await refundCredits(reservedCredits)
      }
      return NextResponse.json(
        {
          error: errors.length > 0 ? errors[0]?.error ?? "Generation failed." : "No images returned from the model.",
          errors: errors.length > 0 ? errors : undefined,
          creditsBalance: entitlements.creditsBalance,
        },
        { status: 502 },
      )
    }

    return NextResponse.json(
      {
        images: allImages,
        text: combinedText || null,
        results: results.length > 0 ? results : undefined,
        errors: errors.length > 0 ? errors : undefined,
        creditsBalance: entitlements.creditsBalance,
      },
      { status: 200 },
    )
  } catch (err) {
    // Best effort: refund any reserved credits on unexpected failures.
    if (reservedCredits > 0) {
      try {
        entitlements = await addCredits(userId, reservedCredits)
      } catch {
        // ignore refund failures
      }
    }

    if (err instanceof BillingError) {
      return NextResponse.json(
        {
          error: err.code,
          message: err.message,
          upgradeUrl: `${origin}/pricing`,
          creditsBalance: entitlements.creditsBalance,
        },
        { status: err.code === "insufficient_credits" ? 402 : 400 },
      )
    }

    const message = err instanceof Error ? err.message : "Generation failed."
    return NextResponse.json({ error: message }, { status: 500 })
  }

}
