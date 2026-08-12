import posthog from 'posthog-js'

const KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY as string | undefined
const HOST =
  (import.meta.env.VITE_PUBLIC_POSTHOG_HOST as string | undefined) ||
  'https://us.i.posthog.com'

let started = false

function utmProps(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const out: Record<string, string> = {}
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref']) {
    const v = params.get(k)
    if (v) out[k] = v
  }
  return out
}

/** Init once. No-ops when key is missing (local / preview without secrets). */
export function initAnalytics() {
  if (started || !KEY || typeof window === 'undefined') return
  started = true

  posthog.init(KEY, {
    api_host: HOST,
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
    autocapture: false,
  })

  const utms = utmProps()
  if (Object.keys(utms).length) {
    posthog.register(utms)
  }

  posthog.capture('shop_opened', {
    ...utms,
    path: window.location.pathname,
    referrer: document.referrer || undefined,
  })
}

export function track(
  event: string,
  properties?: Record<string, string | number | boolean | undefined | null>,
) {
  if (!started || !KEY) return
  const cleaned: Record<string, string | number | boolean> = {}
  if (properties) {
    for (const [k, v] of Object.entries(properties)) {
      if (v !== undefined && v !== null) cleaned[k] = v
    }
  }
  posthog.capture(event, cleaned)
}

export function trackPlaylistOutbound(destination: 'spotify' | 'youtube_music') {
  track('playlist_outbound_clicked', { destination })
}

export function trackPlayToggle(isPlaying: boolean, trackTitle: string, trackArtist: string) {
  track(isPlaying ? 'track_played' : 'track_paused', {
    track_title: trackTitle,
    track_artist: trackArtist,
  })
}

export function trackTrackChange(
  direction: 'next' | 'prev' | 'auto',
  trackTitle: string,
  trackArtist: string,
) {
  track('track_changed', {
    direction,
    track_title: trackTitle,
    track_artist: trackArtist,
  })
}

export function trackShare(method: 'web_share' | 'clipboard' | 'failed') {
  track('share_clicked', { method })
}
