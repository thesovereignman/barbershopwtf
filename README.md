# Barbershop.wtf

American barbershop energy. Early-2000s hip-hop & R&B on a custom boombox skin — same vibe as [saloon.wtf](https://saloon.wtf), different shop.

**Live:** https://barbershopwtf.vercel.app  
**Repo:** https://github.com/thesovereignman/barbershopwtf

Playback uses the **YouTube IFrame API** under a custom UI (no Spotify embed chrome). Spotify / YouTube playlist links are outbound only.

## Dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

GitHub `main` → Vercel project `coolcompany/barbershopwtf` (auto-deploys on push).

```bash
vercel --prod --scope coolcompany
```

## Notes

- Track list lives in `src/data/tracks.ts` (YouTube video IDs).
- Background art: `public/bg.png`
- If a video fails to embed, use Next — the player no longer auto-skips the whole list.
