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
CREEM_API_KEY=XXX
CREEM_WEBHOOK_SECRET=XXX

# Creem product IDs (copy from Creem Dashboard → Products)
NEXT_PUBLIC_CREEM_PRODUCT_BASIC_MONTHLY=prod_xxx
NEXT_PUBLIC_CREEM_PRODUCT_BASIC_YEARLY=prod_xxx
NEXT_PUBLIC_CREEM_PRODUCT_PACK_STARTER=prod_xxx
NEXT_PUBLIC_CREEM_PRODUCT_PACK_GROWTH=prod_xxx
NEXT_PUBLIC_CREEM_PRODUCT_PACK_PROFESSIONAL=prod_xxx
NEXT_PUBLIC_CREEM_PRODUCT_PACK_ENTERPRISE=prod_xxx
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

## Payments (Creem)

- Checkout route: `app/checkout/route.ts` (used by `<CreemCheckout />`)
- Webhook route: `app/api/webhook/creem/route.ts`

Creem dashboard setup:

- Create products for each plan/billing cycle and credit pack, then copy product IDs into `.env.local`
- Add a webhook endpoint pointing to `https://<your-domain>/api/webhook/creem` and paste the webhook secret into `.env.local`
