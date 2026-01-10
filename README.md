# image banana (imgeditor.co clone)

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
NEXT_PUBLIC_SUPABASE_URL=XXX
NEXT_PUBLIC_SUPABASE_ANON_KEY=XXX
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

## Google login (Supabase)

- Login URL: `GET /auth/login?next=/some/path`
- Callback URL: `/auth/callback`
- Sign out: `GET /auth/signout?next=/some/path`

Supabase dashboard setup:

- Enable Google provider in **Authentication → Providers**
- Add `http://localhost:3000/auth/callback` to **Authentication → URL Configuration → Redirect URLs**
- For Google Cloud Console, add `https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback` as an authorized redirect URI
