# Nano Banana (imgeditor.co clone)

## Requirements

- Node.js `>= 20.9.0` (this repo uses Next.js 16)
- `pnpm`

## Setup

```bash
nvm use
pnpm install
```

Create `.env.local` and set your OpenRouter key:

```bash
OPENROUTER_API_KEY=XXX
```

## Run locally

```bash
pnpm dev
```

Open:

- `http://localhost:3000/`
- `http://localhost:3000/generator`

## Image generation/editing (Gemini 2.5 Flash Image via OpenRouter)

- UI: upload an image → enter **Main Prompt** → click **Generate Now**
- Server route: `app/api/generate/route.ts`

