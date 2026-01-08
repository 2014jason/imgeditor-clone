import { NextResponse } from "next/server"

export const runtime = "nodejs"

type GenerateRequestBody = {
  prompt?: unknown
  image?: unknown
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
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

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
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

  const prompt = isNonEmptyString(body.prompt) ? body.prompt : ""
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 })
  }

  const image = isNonEmptyString(body.image) ? body.image : null

  const referer =
    process.env.OPENROUTER_HTTP_REFERER ??
    process.env.OPENROUTER_SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"

  const title = process.env.OPENROUTER_X_TITLE ?? process.env.OPENROUTER_APP_NAME ?? "nano-banana"

  const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": referer,
      "X-Title": title,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image-preview",
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
    return NextResponse.json(
      {
        error: normalizedMessage,
        status: openRouterResponse.status,
      },
      { status: openRouterResponse.status },
    )
  }

  const images = extractImageUrls(json)
  const text = extractText(json)

  if (images.length === 0) {
    return NextResponse.json(
      { error: "No images returned from the model.", text },
      { status: 502 },
    )
  }

  return NextResponse.json({ images, text }, { status: 200 })
}
