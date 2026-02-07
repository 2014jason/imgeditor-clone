export type PromptMode = "image-to-image" | "text-to-image"

export type PromptTemplate = {
  slug: string
  title: string
  description: string
  mode: PromptMode
  category: string
  prompt: string
  tips: string[]
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    slug: "keep-identity-change-outfit",
    title: "Keep Identity, Change Outfit",
    description: "Upload a portrait and change the outfit while preserving the same person.",
    mode: "image-to-image",
    category: "Portrait",
    prompt:
      "Keep the same person and identity. Change the outfit to a black leather jacket. Preserve face details, skin tone, and lighting. Keep the background unchanged. Photorealistic, high detail.",
    tips: [
      "Include “keep the same person/identity” and describe what must not change (face, lighting, background).",
      "If the face drifts, add: “no face changes, no age change, keep facial features exactly the same”.",
    ],
  },
  {
    slug: "keep-identity-change-hair",
    title: "Keep Identity, Change Hair Color",
    description: "Upload a portrait and change hair color without changing the face.",
    mode: "image-to-image",
    category: "Portrait",
    prompt:
      "Keep the same person and identity. Change hair color to platinum blonde. Do not change face shape, eyes, nose, or mouth. Preserve realistic hair texture and lighting.",
    tips: [
      "Hair edits work best when the face is well-lit and sharp.",
      "If you get artifacts near the hairline, add: “clean edges around hairline, natural hairline”.",
    ],
  },
  {
    slug: "replace-background-studio",
    title: "Replace Background: Clean Studio",
    description: "Upload any subject and replace the background with a clean studio look.",
    mode: "image-to-image",
    category: "Background",
    prompt:
      "Keep the main subject exactly the same. Replace the background with a clean white studio background. Add a soft natural shadow under the subject. Keep edges crisp and realistic.",
    tips: [
      "Specify whether you want a shadow (soft, hard, none).",
      "If the subject changes, repeat: “subject must not change, preserve details”.",
    ],
  },
  {
    slug: "replace-background-snowy-mountain",
    title: "Replace Background: Snowy Mountain",
    description: "Swap the scene while preserving your subject and composition.",
    mode: "image-to-image",
    category: "Background",
    prompt:
      "Keep the main subject exactly the same. Replace the background with a snowy mountain landscape at golden hour. Match the lighting direction. Preserve composition and edges.",
    tips: [
      "Mention lighting direction (e.g. “light from the left”).",
      "If the background looks pasted, add: “realistic depth of field, consistent color grading”.",
    ],
  },
  {
    slug: "product-photo-premium",
    title: "Product Photo: Premium E-commerce",
    description: "Turn a messy product shot into a clean, premium product photo.",
    mode: "image-to-image",
    category: "Product",
    prompt:
      "Keep the product exactly the same shape and logo. Remove clutter. Create a clean studio background with soft shadows. Make the photo look premium and high-end. High resolution, realistic.",
    tips: [
      "Tell the model what must not change (logo/text/shape).",
      "Ask for “sharp edges” if the product outline gets blurry.",
    ],
  },
  {
    slug: "portrait-golden-hour-grade",
    title: "Portrait: Golden Hour Color Grade",
    description: "Apply a warm, cinematic color grade while preserving the person.",
    mode: "image-to-image",
    category: "Portrait",
    prompt:
      "Keep the same person and identity. Apply warm golden-hour color grading, soft film look, gentle contrast. Preserve realistic skin tones. Do not change facial features.",
    tips: [
      "If skin looks off, add: “natural skin tones, avoid oversaturation”.",
      "Color grade prompts work better than “make it cinematic” alone—add specifics (warm highlights, soft contrast).",
    ],
  },
  {
    slug: "stylize-anime-portrait",
    title: "Stylize: Anime Portrait (Keep Face)",
    description: "Convert a portrait to anime style while keeping recognizable features.",
    mode: "image-to-image",
    category: "Style",
    prompt:
      "Transform into high-quality anime illustration style. Keep the same person’s recognizable facial features and hairstyle. Clean line art, soft shading, vibrant but natural colors.",
    tips: [
      "For stronger identity, add a couple unique traits: “freckles, eyebrow shape, eye color”.",
      "If it becomes too cartoony, add: “semi-realistic anime, detailed rendering”.",
    ],
  },
  {
    slug: "text-to-image-studio-mug",
    title: "Text-to-Image: Studio Product Baseline",
    description: "A clean baseline prompt for quality and lighting.",
    mode: "text-to-image",
    category: "Text to Image",
    prompt:
      "A studio product photo of a ceramic coffee mug on a neutral background, soft diffused lighting, realistic shadows, ultra-detailed, photorealistic, high resolution.",
    tips: [
      "Add lens/camera hints for realism (e.g. “50mm, f/2.8”) if needed.",
      "If it looks too perfect, add: “slight imperfections, subtle texture”.",
    ],
  },
  {
    slug: "text-to-image-ugc-selfie-ad",
    title: "Text-to-Image: UGC Selfie Ad Frame",
    description: "Generate a UGC-style frame you can iterate on.",
    mode: "text-to-image",
    category: "UGC",
    prompt:
      "A casual smartphone selfie photo, natural indoor lighting, authentic UGC style, slightly imperfect framing, high realism, modern apartment background, 35mm look.",
    tips: [
      "UGC works best when you explicitly ask for “authentic, imperfect framing”.",
      "If you need consistency, start from a reference image (image-to-image).",
    ],
  },
  {
    slug: "remove-background-then-replace",
    title: "Workflow: Remove Background Then Replace",
    description: "A two-step workflow to get cleaner composites.",
    mode: "image-to-image",
    category: "Workflow",
    prompt:
      "Keep the subject exactly the same. Replace the background with a clean solid color. Preserve edges and add a soft natural shadow under the subject.",
    tips: [
      "Step 1: use the Background Remover tool for a transparent PNG.",
      "Step 2: upload the PNG into the editor and prompt a new scene/background.",
    ],
  },
  {
    slug: "thumbnail-high-contrast",
    title: "Thumbnail: High Contrast Pop",
    description: "Make an image read better at small sizes (YouTube/TikTok).",
    mode: "image-to-image",
    category: "Creator",
    prompt:
      "Keep the subject the same. Increase contrast and clarity slightly, brighten the face, add subtle background blur, make colors punchy but not oversaturated. Thumbnail-friendly.",
    tips: [
      "Ask for “brighten face” and “background blur” for stronger subject separation.",
      "Avoid extreme sharpening; add: “natural, no halos” if needed.",
    ],
  },
]

export function getPromptTemplate(slug: string): PromptTemplate | null {
  return PROMPT_TEMPLATES.find((p) => p.slug === slug) ?? null
}

