import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "Image Banana - AI Image Editor"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b0f",
          color: "white",
          padding: 64,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 48,
            background: "linear-gradient(135deg, #F59E0B 0%, #FDE68A 50%, #F59E0B 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 72,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 36,
              background: "rgba(0,0,0,0.75)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 72,
              gap: 18,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 64, lineHeight: "64px" }}>🍌</div>
              <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: "-0.02em" }}>Image Banana</div>
            </div>
            <div style={{ fontSize: 30, opacity: 0.9 }}>AI Image Editor</div>
            <div style={{ fontSize: 22, opacity: 0.8, maxWidth: 860 }}>
              Edit photos with text prompts. Fast, consistent results — built for creators.
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}

