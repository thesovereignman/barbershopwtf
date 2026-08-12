# Barbershop.wtf

American barbershop energy. Early-2000s hip-hop & R&B on a custom boombox skin — same vibe as [saloon.wtf](https://saloon.wtf), different shop.

**Live:** https://barbershop.wtf  
**Preview / Vercel:** https://barbershopwtf.vercel.app  
**Repo:** https://github.com/thesovereignman/barbershopwtf

Playback uses the **YouTube IFrame API** under a custom UI (no Spotify embed chrome). Spotify / YouTube playlist links are outbound only.

## Dev

```bash
npm install
npm run dev
```

Copy `.env.example` → `.env.local` for optional PostHog (see below).

## Build

```bash
npm run check:assets
npm run build
npm run preview
```

`npm run build` runs TypeScript (`tsc -b`) then Vite. `check:assets` guards OG/favicon files.

## CI / CD

- **Build gate:** `npm run build` runs `check:assets` then typecheck + Vite (Vercel production/preview builds use this).
- **GitHub Actions:** `.github/workflows/ci.yml` runs `npm ci`, asset check, lint, and build on PRs and `main` (requires a GitHub token with `workflow` scope to add/update the workflow file).
- **Preview + production deploys:** Vercel Git integration for project `coolcompany/barbershopwtf`. Push/PR → preview; `main` → production. Do not duplicate deploy in Actions.
- Manual prod: `vercel --prod --scope coolcompany`

## Env (Vercel)

Set in the Vercel project (never commit secrets). Vite inlines `VITE_*` at **build** time — redeploy after changes.

| Variable | Purpose |
| --- | --- |
| `VITE_PUBLIC_POSTHOG_KEY` | Project key (`phc_…`), dedicated Barbershop project |
| `VITE_PUBLIC_POSTHOG_HOST` | e.g. `https://us.i.posthog.com` |

See `.env.example`.

## Notes

- Track list: `src/data/tracks.ts` (YouTube video IDs).
- Background art: `public/bg.png`
- Share / OG image: `public/share.jpg` (1200×630 JPEG)
- If a video fails to embed, use Next — the player no longer auto-skips the whole list.
- Ops learnings (OG, mobile, PostHog, brand rules): [docs/LEARNINGS.md](docs/LEARNINGS.md)
