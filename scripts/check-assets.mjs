#!/usr/bin/env node
/**
 * Guard critical public assets that break OG scrapers or branding if missing/wrong.
 */
import fs from 'node:fs'

function fail(message) {
  console.error(message)
  process.exit(1)
}

function assertExists(relPath) {
  if (!fs.existsSync(relPath)) {
    fail(`Missing critical asset: ${relPath}`)
  }
}

/** Read JPEG SOF0/SOF2 dimensions without external deps. */
function jpegDimensions(buf) {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) {
    return null
  }
  let i = 2
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) {
      i += 1
      continue
    }
    const marker = buf[i + 1]
    if (marker === 0xd9 || marker === 0xda) {
      break
    }
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      const height = buf.readUInt16BE(i + 5)
      const width = buf.readUInt16BE(i + 7)
      return { width, height }
    }
    const segmentLength = buf.readUInt16BE(i + 2)
    if (segmentLength < 2) {
      break
    }
    i += 2 + segmentLength
  }
  return null
}

assertExists('public/share.jpg')
assertExists('public/favicon.svg')
assertExists('public/favicon.png')

const share = fs.readFileSync('public/share.jpg')
if (share[0] !== 0xff || share[1] !== 0xd8 || share[2] !== 0xff) {
  fail('public/share.jpg must be a real JPEG (magic bytes FF D8 FF). Do not ship mislabeled PNG.')
}

const size = jpegDimensions(share)
if (!size || size.width !== 1200 || size.height !== 630) {
  fail(
    `public/share.jpg must be 1200×630 for OG/iMessage (got ${
      size ? `${size.width}×${size.height}` : 'unreadable dimensions'
    }).`,
  )
}

console.log('Critical assets OK (share.jpg 1200×630 JPEG, favicons present).')
