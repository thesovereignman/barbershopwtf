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
            className="shop__link-btn"
            href={PLAYLIST_LINKS.spotify}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackPlaylistOutbound('spotify')}
          >
            Spotify
          </a>
          <a
            className="shop__link-btn"
            href={PLAYLIST_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackPlaylistOutbound('youtube_music')}
          >
            YT Music
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
