import { useState } from 'react'
import { BoomboxPlayer } from './components/BoomboxPlayer'
import { PLAYLIST_LINKS } from './data/tracks'
import { useYouTubePlayer } from './hooks/useYouTubePlayer'
import {
  trackPlaylistOutbound,
  trackShare,
} from './lib/analytics'

const SHARE_URL = 'https://barbershop.wtf/'
const SHARE_TEXT = 'Remember the $15 fade? Early 2000s boombox vibes →'

const FAQS = [
  {
    q: 'What is Barbershop.wtf?',
    a: 'Barbershop.wtf is a free web experience that plays early-2000s hip-hop and R&B in an American barbershop atmosphere — a boombox on the counter, not a booking site.',
  },
  {
    q: 'Is this a real shop I can book?',
    a: 'No. It is an online vibe and music player inspired by the shop. There are no appointments, locations, or haircut bookings.',
  },
  {
    q: 'Is it free?',
    a: 'Yes. Open the site, hit play, and listen. Optional Spotify and YouTube Music playlist links are up top.',
  },
  {
    q: 'What does “Remember the $15 fade?” mean?',
    a: 'It is the cultural hook — nostalgia for when a sharp fade was fifteen bucks and the boombox never stopped.',
  },
] as const

export default function App() {
  const player = useYouTubePlayer()
  const [elapsed, total] = player.progressLabel.split(' / ')
  const [shareLabel, setShareLabel] = useState('Share')

  async function onShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Barbershop.wtf',
          text: SHARE_TEXT,
          url: SHARE_URL,
        })
        trackShare('web_share')
        setShareLabel('Sent')
      } else {
        await navigator.clipboard.writeText(SHARE_URL)
        trackShare('clipboard')
        setShareLabel('Copied')
      }
    } catch {
      try {
        await navigator.clipboard.writeText(SHARE_URL)
        trackShare('clipboard')
        setShareLabel('Copied')
      } catch {
        trackShare('failed')
        setShareLabel('Share')
      }
    }
    window.setTimeout(() => setShareLabel('Share'), 1800)
  }

  return (
    <div className="shop">
      <div className="shop__bg" role="img" aria-label="American barbershop interior with boombox vibes" />
      <div className="shop__vignette" aria-hidden="true" />
      <div className="shop__scrim" aria-hidden="true" />

      <header className="shop__top">
        <div className="shop__time" aria-live="polite">
          <span className="shop__time-elapsed">{elapsed}</span>
          <span className="shop__time-sep">/</span>
          <span className="shop__time-total">{total}</span>
        </div>

        <h1 className="shop__logo">
          BARBERSHOP<span className="shop__tld">.wtf</span>
        </h1>

        <div className="shop__playlist-links">
          <button type="button" className="shop__link-btn" onClick={onShare}>
            {shareLabel}
          </button>
          <a
            className="shop__link-btn shop__link-btn--icon"
            href={PLAYLIST_LINKS.spotify}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Spotify playlist"
            title="Spotify"
            onClick={() => trackPlaylistOutbound('spotify')}
          >
            <SpotifyIcon />
          </a>
          <a
            className="shop__link-btn shop__link-btn--icon"
            href={PLAYLIST_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open YouTube Music playlist"
            title="YouTube Music"
            onClick={() => trackPlaylistOutbound('youtube_music')}
          >
            <YouTubeIcon />
          </a>
        </div>
      </header>

      <section className="shop__hero" aria-label="Hook">
        <p className="shop__tagline">
          $15 fades boombox on the counter. No aircompressor.
        </p>
      </section>

      <main className="shop__main">
        <BoomboxPlayer player={player} />
      </main>

      <section className="shop__about" aria-labelledby="about-heading">
        <h2 id="about-heading" className="shop__about-title">
          What is Barbershop.wtf?
        </h2>
        <p className="shop__about-lead">
          Barbershop.wtf is a free early-2000s hip-hop &amp; R&amp;B boombox site — American
          barbershop atmosphere online. Press play; no signup, no booking.
        </p>
        <div className="shop__faq">
          {FAQS.map((item) => (
            <details key={item.q} className="shop__faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
      />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186 31.247 31.247 0 0 0 0 12.017a31.247 31.247 0 0 0 .502 5.831 3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136A31.247 31.247 0 0 0 24 12.017a31.247 31.247 0 0 0-.502-5.831zM9.545 15.568V8.417l6.278 3.575-6.278 3.576z"
      />
    </svg>
  )
}
