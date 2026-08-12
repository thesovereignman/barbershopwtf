import { useEffect, useState } from 'react'
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

function formatClock(date: Date) {
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function App() {
  const player = useYouTubePlayer()
  const [shareLabel, setShareLabel] = useState('Share')
  const [clock, setClock] = useState(() => formatClock(new Date()))

  useEffect(() => {
    const tick = () => setClock(formatClock(new Date()))
    tick()
    const id = window.setInterval(tick, 30_000)
    return () => window.clearInterval(id)
  }, [])

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
    <div className="page">
      <div
        className="page__bg"
        role="img"
        aria-label="American barbershop interior with boombox vibes"
      />
      <section className="hero" aria-label="Barbershop.wtf">
        <header className="topbar">
          <time className="topbar__clock" aria-live="polite">
            {clock}
          </time>

          <nav className="topbar__nav" aria-label="Links">
            <button type="button" className="topbar__btn" onClick={onShare}>
              <ShareIcon />
              <span className="nav-label">{shareLabel}</span>
            </button>
            <a
              className="topbar__btn topbar__btn--icon"
              href={PLAYLIST_LINKS.spotify}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Spotify playlist"
              title="Spotify"
              onClick={() => trackPlaylistOutbound('spotify')}
            >
              <SpotifyIcon />
              <span className="nav-label">Spotify</span>
            </a>
            <a
              className="topbar__btn topbar__btn--icon"
              href={PLAYLIST_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open YouTube Music playlist"
              title="YouTube Music"
              onClick={() => trackPlaylistOutbound('youtube_music')}
            >
              <YouTubeIcon />
              <span className="nav-label">YouTube</span>
            </a>
          </nav>
        </header>

        <h1 className="headline">
          $15 Fades.
          <br />
          Boombox.
          <br />
          No Aircompressor.
        </h1>

        <div className="player-wrap">
          <BoomboxPlayer player={player} />
        </div>
      </section>

      <section className="about" aria-labelledby="about-heading">
        <h2 id="about-heading" className="about__title">
          What is Barbershop.wtf?
        </h2>
        <p className="about__lead">
          Barbershop.wtf is a free early-2000s hip-hop &amp; R&amp;B boombox site — American
          barbershop atmosphere online. Press play; no signup, no booking.
        </p>
        <div className="faq">
          {FAQS.map((item) => (
            <details key={item.q} className="faq__item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"
      />
    </svg>
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
