# TODO-SEO (Cold Start Checklist)

## Current Baseline (Already in repo)

- Global metadata in `app/layout.tsx` (title/description, OG/Twitter settings)
- Canonical URLs via `middleware.ts` -> `x-canonical-url` -> `<link rel="canonical">` in `app/layout.tsx`
- Sitemap endpoint at `/sitemap.xml` via `app/sitemap.ts` (en only by default; includes zh/ko when `INDEX_I18N_PAGES=1`)
- Default locale canonicalization: `/en/* -> /*` via `middleware.ts`

## Cold Start SEO Checklist (Prioritized)

### A) Indexing / Crawl Basics

- [x] Configure and unify the primary domain + protocol (HTTPS, www vs non-www, redirect strategy)
- [x] Ensure `NEXT_PUBLIC_SITE_URL` / `SITE_URL` are set to the production canonical base URL
- [x] Add `robots.txt` (currently missing):
  - allow crawling of public pages
  - disallow `/api/*`, `/auth/*`, `/checkout`, etc.
  - include `Sitemap: https://<domain>/sitemap.xml`
- [x] Use a single source of sitemap:
  - Current repo has both `app/sitemap.ts` and `postbuild` script generating `public/sitemap.xml`
  - Keep one to avoid confusion/duplication

### B) Page-Level Metadata (Often missed at launch)

- [x] Add page-specific `title/description` (via page `metadata` or `generateMetadata`) for:
  - `/generator`
  - `/pricing`
  - `/showcase`
  - `/tools/background-remover`
  - policy pages (`/privacy`, `/terms`, `/refund`, etc.)
- [x] Add `hreflang` / `alternates.languages` for multi-locale routing (en/zh/ko) to avoid duplicate-content signals
- [x] If zh/ko are still English mirrors: either add real translations quickly or mark as `noindex` until ready

### C) Structured Data (Improve CTR / Rich Results)

- [ ] Add JSON-LD on homepage:
  - `Organization` and/or `WebSite`
- [ ] Add `FAQPage` schema for the homepage FAQ section
- [ ] Add `Product`/`Offer` (or `SoftwareApplication`) schema on `/pricing` (pick one consistent with positioning)

### D) Performance & Crawlability

- [ ] Check Core Web Vitals (LCP/CLS/INP) and reduce JS/asset weight
- [ ] Prefer `next/image` for important images (many places use `<img>` currently)
- [ ] Ensure important pages respond with 200 (avoid accidental auth/middleware blocking)
- [ ] Confirm “online URL” behavior:
  - It may be just remote image URLs in results, not a redirect
  - Validate login flow host/origin to avoid real redirects to the wrong domain

### E) Launch / Growth Ops (Must-do for cold start)

- [ ] Google Search Console:
  - verify domain ownership
  - submit sitemap
  - monitor index coverage / crawl errors
- [ ] Acquire initial high-signal backlinks:
  - Product Hunt, directories, relevant communities/blogs
  - keep anchor text aligned with landing pages
- [ ] Monitor and fix:
  - crawl errors / 404s
  - duplicate titles/descriptions
  - landing page CTR and query match
