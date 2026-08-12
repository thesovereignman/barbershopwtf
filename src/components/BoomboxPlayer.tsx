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
    volume,
    muted,
    error,
    toggle,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
  } = player

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  function onToggle() {
    // Fire before toggle so isPlaying reflects the action about to happen
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
      <div className="player__card">
        <button
          type="button"
          className="player__cover-btn"
          onClick={onToggle}
          disabled={!ready}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <img
            className="player__cover"
            src={coverUrl(track.youtubeId)}
            alt=""
            width={96}
            height={96}
            draggable={false}
          />
          <span className="player__cover-play" aria-hidden="true">
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </span>
        </button>

        <div className="player__body">
          <div className="player__meta">
            <p className="player__title">{track.title}</p>
            <p className="player__artist">{track.artist}</p>
            {error ? <p className="player__error">{error}</p> : null}
          </div>

          <div className="player__timeline">
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
          </div>

          <div className="player__row">
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
                className={`player__btn player__btn--play${isPlaying ? ' is-playing' : ''}`}
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

            <div className="player__volume">
              <button
                type="button"
                className="player__btn player__btn--mute"
                onClick={toggleMute}
                disabled={!ready}
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted || volume === 0 ? <MuteIcon /> : <VolumeIcon />}
              </button>
              <input
                className="player__vol-slider"
                type="range"
                min={0}
                max={100}
                value={muted ? 0 : volume}
                aria-label="Volume"
                disabled={!ready}
                onChange={(e) => setVolume(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="currentColor" d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
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

function VolumeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 10v4h4l5 5V5L7 10H3zm13.5 2c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4z"
      />
    </svg>
  )
}

function MuteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.5 12c0-1.8-1-3.3-2.5-4v2.2l2.5 2.5V12zm2.5 0c0 .9-.2 1.8-.5 2.6l1.5 1.5c.6-1.3 1-2.7 1-4.1 0-3.2-1.9-5.9-4.5-7.1v2.1c1.8.9 3 2.8 3 5zm-13-2H3v4h4l5 5v-6.2l-4.2-4.2L6 10zm11.7-5.7L3.3 18.7l1.4 1.4L19.6 5.2l-1.4-1.4z"
      />
    </svg>
  )
}
