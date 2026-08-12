import type { CSSProperties } from 'react'
import { coverUrl } from '../data/tracks'
import type { useYouTubePlayer } from '../hooks/useYouTubePlayer'
import { trackPlayToggle, trackTrackChange } from '../lib/analytics'

type PlayerApi = ReturnType<typeof useYouTubePlayer>

type Props = {
  player: PlayerApi
}

export function BoomboxPlayer({ player }: Props) {
  const {
    track,
    ready,
    isPlaying,
    currentTime,
    duration,
    error,
    toggle,
    next,
    prev,
    seek,
    progressLabel,
  } = player

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  function onToggle() {
    trackPlayToggle(!isPlaying, track.title, track.artist)
    toggle()
  }

  function onNext() {
    trackTrackChange('next', track.title, track.artist)
    next()
  }

  function onPrev() {
    trackTrackChange('prev', track.title, track.artist)
    prev()
  }

  return (
    <div className="player" role="region" aria-label="Music player">
      <img
        className="player-artwork"
        src={coverUrl(track.youtubeId)}
        alt=""
        width={80}
        height={80}
        draggable={false}
      />

      <div className="track-info">
        <p className="track-title">{track.title}</p>
        <p className="artist">{track.artist}</p>
        {error ? <p className="player__error">{error}</p> : null}
        <input
          className="player__progress"
          type="range"
          min={0}
          max={duration || 1}
          step={0.1}
          value={currentTime}
          aria-label="Seek"
          disabled={!ready}
          onChange={(e) => seek(Number(e.target.value))}
          style={{ '--progress': `${progress}%` } as CSSProperties}
        />
        <p className="player__times">{progressLabel}</p>
      </div>

      <div className="player__controls">
        <button
          type="button"
          className="player__btn"
          onClick={onPrev}
          disabled={!ready}
          aria-label="Previous track"
        >
          <PrevIcon />
        </button>
        <button
          type="button"
          className="play-button"
          onClick={onToggle}
          disabled={!ready}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          type="button"
          className="player__btn"
          onClick={onNext}
          disabled={!ready}
          aria-label="Next track"
        >
          <NextIcon />
        </button>
      </div>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="currentColor" d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="currentColor" d="M6 5h4v14H6zm8 0h4v14h-4z" />
    </svg>
  )
}

function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
    </svg>
  )
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" />
    </svg>
  )
}
