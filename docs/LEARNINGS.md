# Barbershop.wtf — development learnings

Durable notes from building this Vite + React + TypeScript marketing/vibe site. Prefer public customer language on live surfaces; keep ops/internal notes here or in private docs.

## Stack & deploy

- **Stack:** Vite + React + TypeScript static site
- **Hosting:** Vercel project `coolcompany/barbershopwtf`
- **Domain:** [barbershop.wtf](https://barbershop.wtf)
- **Repo:** [thesovereignman/barbershopwtf](https://github.com/thesovereignman/barbershopwtf)
- Preview deploys come from **Vercel Git integration** (PR → preview URL). Do not duplicate preview deploy in GitHub Actions.

## Open Graph / iMessage

- **Do not** ship JPEG bytes labeled as PNG, or square `1200×1200` as the primary share image — scrapers (especially iMessage) break or pick a bad crop.
- Use a real **JPEG** at **1200×630** (`public/share.jpg`), advertise a **single** `og:image`, and set **Content-Type: `image/jpeg`** (see `vercel.json`).
- Keep `og:image:width` / `og:image:height` aligned with the real file.

## Favicon

- Transparent scissors SVG/PNG only — **no** gradient plate behind the mark.
- Ship both `favicon.svg` and a small PNG fallback (`favicon.png`).

## SEO / AEO & public copy

- Ship `robots.txt`, `sitemap.xml`, `llms.txt`, and JSON-LD FAQ in `index.html`.
- **Public copy only** on live pages: no internal portfolio boundaries, sister-product disclaimers, or ops jargon. Compliance detail belongs in Privacy/Terms if needed, not the homepage.

## PostHog

- Client: `posthog-js` with `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` (see `.env.example`).
- Use a **dedicated** PostHog project for this product — not Service Ghost.
- Vite bakes env at **build time** → after adding/changing env in Vercel, **redeploy**.
- Project keys are `phc_…`; personal API keys (`phx_…`) are not for the browser SDK.

## Mobile layout

- Spotify / YouTube outbound links work better as **icons**, not long text, on small screens.
- A fixed player takes the boombox out of normal document flow; without a reservation, About/FAQ can invade the first viewport.
- Fix pattern: hero `min-height` ≈ `100svh`, and when the player is `position: fixed`, give `main` **`height: 0`** (or equivalent) so secondary content stays below the fold.

## Brand & growth

- **Brand-first hero:** brand/name as hero-level signal; first viewport ≈ brand + one line + short support + CTA + dominant visual — not a dashboard of schedules/stats.
- Share button + **UTM-tagged** share/outbound events close the viral loop (PostHog).

## CI / local checks

- `npm run build` runs `check:assets` then typecheck + Vite (same path as Vercel).
- GitHub Actions: `npm ci` → asset guard → lint → `npm run build` (optional duplicate of asset check for PR clarity).
- Critical assets: `public/share.jpg` (real JPEG 1200×630), `public/favicon.svg`, `public/favicon.png`.
- Never commit secrets; configure PostHog (and anything else) in Vercel project env.
- Preview deploys: Vercel Git integration only — do not duplicate in Actions.
