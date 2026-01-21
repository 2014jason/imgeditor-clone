# SEO Cold Start Setup

This doc covers the minimal SEO setup needed for a clean "cold start":

- Unify **canonical domain + protocol** (HTTPS, www vs non-www)
- Set `NEXT_PUBLIC_SITE_URL` / `SITE_URL` to the canonical base URL
- Add `robots.txt` with a sitemap link and sensible disallow rules
- Use **one** sitemap source (avoid duplicate/conflicting sitemap generation)

## 1) Canonical Domain + Protocol

Decide the canonical URL you want indexed, e.g.:

- `https://imgeditor.example.com` (recommended)
- `https://www.imgeditor.example.com` (if you prefer www)

Rules to enforce:

- `http://` -> `https://` (308)
- non-canonical host -> canonical host (308)

Where to enforce:

- Prefer doing this at the edge/CDN/hosting layer (fastest + works for all paths).
- If you must do it in-app, this repo supports host/protocol redirects in `middleware.ts`:
  - set `NEXT_PUBLIC_SITE_URL` (or `SITE_URL`) to the canonical origin
  - redirects are enforced when:
    - `VERCEL_ENV=production` (on Vercel), or
    - `ENFORCE_CANONICAL_HOST=1` (explicit override)

## 2) Set `NEXT_PUBLIC_SITE_URL` / `SITE_URL`

These are used to build correct absolute URLs in:

- `app/layout.tsx` (Next metadata base)
- `app/sitemap.ts` (sitemap URLs)
- `app/robots.ts` (sitemap link in robots.txt)

Recommended:

```bash
NEXT_PUBLIC_SITE_URL=https://<your-canonical-domain>
# or
SITE_URL=https://<your-canonical-domain>
```

Keep it **exactly** the canonical origin (no trailing slash), e.g.:

- ✅ `https://imgeditor.example.com`
- ❌ `https://imgeditor.example.com/`
- ❌ `http://imgeditor.example.com`

## 3) robots.txt

This repo uses a Next.js metadata route: `app/robots.ts` -> `/robots.txt`.

Current behavior:

- Allows public pages
- Disallows:
  - `/api/`
  - `/auth/`
  - `/checkout`
  - `/_next/`
- Adds:
  - `Sitemap: https://<base>/sitemap.xml` (base computed from env)

## 4) Sitemap: Single Source of Truth

Use **only** `app/sitemap.ts` (served at `/sitemap.xml`).

Changes made:

- Removed the `postbuild` sitemap generator from `package.json` to avoid producing a second sitemap at `public/sitemap.xml`.

If you ever reintroduce static sitemap generation, make sure it does **not** conflict with `/sitemap.xml` and do not serve two different sitemaps with different URLs.

## 5) Locale SEO (en/zh/ko): hreflang + noindex for mirrors

This repo supports:

- Default locale: `en` (no `/en` prefix)
- Routed locales: `/zh`, `/ko`

### hreflang

Key pages export `alternates.languages` (via `lib/seo.ts`) so search engines can understand the en/zh/ko variants.

### Avoid indexing mirrored locales

If `/zh` and `/ko` are still English mirrors, the locale routes are marked:

- `noindex,follow`

Sitemap behavior:

- By default, `/sitemap.xml` includes **only** the canonical (en) URLs.
- When `INDEX_I18N_PAGES=1`, `/sitemap.xml` will include `/zh` and `/ko` URLs as well.

When translations are ready, allow indexing by setting:

```bash
INDEX_I18N_PAGES=1
```
