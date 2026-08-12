import { BoomboxPlayer } from './components/BoomboxPlayer'
import { PLAYLIST_LINKS } from './data/tracks'
import { useYouTubePlayer } from './hooks/useYouTubePlayer'

export default function App() {
  const player = useYouTubePlayer()
  const [elapsed, total] = player.progressLabel.split(' / ')

  return (
    <div className="shop">
      <div className="shop__bg" aria-hidden="true" />
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
          <a
            className="shop__link-btn"
            href={PLAYLIST_LINKS.spotify}
            target="_blank"
            rel="noreferrer"
          >
            Spotify
          </a>
          <a
            className="shop__link-btn"
            href={PLAYLIST_LINKS.youtube}
            target="_blank"
            rel="noreferrer"
          >
            YT Music
          </a>
        </div>
      </header>

      <section className="shop__hero">
        <p className="shop__tagline">
          $15 fades boombox on the counter. No aircompressor.
        </p>
      </section>

      <main className="shop__main">
        <BoomboxPlayer player={player} />
      </main>
    </div>
  )
}
