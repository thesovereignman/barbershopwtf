# Barbershop.wtf

American barbershop energy. Early-2000s hip-hop & R&B on a custom boombox skin — same vibe as [saloon.wtf](https://saloon.wtf), different shop.

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

Static Vite app — drop on Vercel:

```bash
npx vercel
```

Point a domain like `barbershop.wtf` at the project when ready.

## Notes

- Track list lives in `src/data/tracks.ts` (YouTube video IDs).
- Background art: `public/bg.png`
- If a video fails to embed, the player auto-skips to the next track.
