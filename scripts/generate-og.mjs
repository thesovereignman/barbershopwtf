/**
 * Build public/share.jpg (1200×630) from bg + Bebas Neue hook.
 * Also refreshes og.jpg and share-2x.jpg companions.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const W = 1200
const H = 630

const fontPath = path.join(__dirname, 'assets', 'BebasNeue-Regular.ttf')
const bgPath = path.join(root, 'public', 'bg.png')

if (!fs.existsSync(fontPath)) {
  console.error('Missing font:', fontPath)
  process.exit(1)
}
if (!fs.existsSync(bgPath)) {
  console.error('Missing background:', bgPath)
  process.exit(1)
}

const lines = ['$15 Fades.', 'Boombox.', 'No Aircompressor.']
const lineHeight = 96
const startY = 218

const textRows = lines
  .map((line, i) => {
    const y = startY + i * lineHeight
    return `<text
      x="600"
      y="${y}"
      text-anchor="middle"
      font-family="Bebas Neue"
      font-size="88"
      fill="#ffffff"
      letter-spacing="2"
      filter="url(#shadow)"
    >${escapeXml(line)}</text>`
  })
  .join('\n')

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#000000" flood-opacity="0.55"/>
    </filter>
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.30"/>
      <stop offset="42%" stop-color="#000000" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.45"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#scrim)"/>
  ${textRows}
</svg>`

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: W },
  font: {
    fontFiles: [fontPath],
    loadSystemFonts: false,
    defaultFontFamily: 'Bebas Neue',
  },
})
const overlayPng = Buffer.from(resvg.render().asPng())

const bg = await sharp(bgPath)
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .toBuffer()

const composed = await sharp(bg)
  .composite([{ input: overlayPng, top: 0, left: 0 }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toBuffer()

const outShare = path.join(root, 'public', 'share.jpg')
const outOg = path.join(root, 'public', 'og.jpg')
const outOgCard = path.join(root, 'public', 'og-card.jpg')
const outShare2x = path.join(root, 'public', 'share-2x.jpg')

fs.writeFileSync(outShare, composed)
fs.writeFileSync(outOg, composed)
fs.writeFileSync(outOgCard, composed)

const share2x = await sharp(composed)
  .resize(2400, 1260, { fit: 'fill', kernel: 'lanczos3' })
  .jpeg({ quality: 85, mozjpeg: true })
  .toBuffer()
fs.writeFileSync(outShare2x, share2x)

const meta = await sharp(outShare).metadata()
console.log(
  `Wrote share.jpg / og.jpg / og-card.jpg ${meta.width}×${meta.height} (${composed.length} bytes), share-2x.jpg`,
)

function escapeXml(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
