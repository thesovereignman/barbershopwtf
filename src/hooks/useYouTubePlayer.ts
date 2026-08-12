import { useCallback, useEffect, useRef, useState } from 'react'
import { tracks, type Track } from '../data/tracks'

let apiPromise: Promise<void> | null = null

function loadYouTubeAPI(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve()
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve()
    }

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    } else if (window.YT?.Player) {
      resolve()
    }
  })

  return apiPromise
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/** YouTube often refuses playback in 1×1 / clipped iframes — keep a real offscreen player. */
function ensureOffscreenHost(): HTMLDivElement {
  let host = document.getElementById('yt-offscreen-host') as HTMLDivElement | null
  if (!host) {
    host = document.createElement('div')
    host.id = 'yt-offscreen-host'
    host.setAttribute('aria-hidden', 'true')
    Object.assign(host.style, {
      position: 'fixed',
      left: '-10000px',
      top: '0',
      width: '400px',
      height: '225px',
      opacity: '0',
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: '-1',
    })
    document.body.appendChild(host)
  }
  return host
}

export function useYouTubePlayer() {
  const playerRef = useRef<YT.Player | null>(null)
  const indexRef = useRef(0)
  const volumeRef = useRef(70)
  const readyRef = useRef(false)
  const userArmedRef = useRef(false)
  const advancingRef = useRef(false)

  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(70)
  const [muted, setMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const track: Track = tracks[index] ?? tracks[0]

  const loadTrack = useCallback((nextIndex: number, shouldPlay: boolean) => {
    const player = playerRef.current
    if (!player || !readyRef.current) return

    const wrapped = ((nextIndex % tracks.length) + tracks.length) % tracks.length
    indexRef.current = wrapped
    setIndex(wrapped)
    setCurrentTime(0)
    setDuration(0)
    setError(null)
    advancingRef.current = false

    const id = tracks[wrapped].youtubeId
    try {
      if (shouldPlay && userArmedRef.current) {
        player.loadVideoById(id)
      } else {
        player.cueVideoById(id)
      }
    } catch {
      setError('Could not load track')
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    let poll: number | undefined
    const host = ensureOffscreenHost()
    host.replaceChildren()
    const mountNode = document.createElement('div')
    host.appendChild(mountNode)

    loadYouTubeAPI().then(() => {
      if (cancelled || !window.YT?.Player) return

      const player = new window.YT.Player(mountNode, {
        width: 400,
        height: 225,
        videoId: tracks[0].youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          enablejsapi: 1,
        },
        events: {
          onReady: (event) => {
            if (cancelled) return
            playerRef.current = event.target
            readyRef.current = true
            event.target.setVolume(volumeRef.current)
            setReady(true)
            setError(null)
          },
          onStateChange: (event) => {
            if (cancelled) return
            const YTState = window.YT!.PlayerState
            const state = event.data

            if (state === YTState.PLAYING) {
              advancingRef.current = false
              setIsPlaying(true)
              setError(null)
              try {
                setDuration(event.target.getDuration() || 0)
              } catch {
                /* ignore */
              }
            } else if (state === YTState.PAUSED) {
              setIsPlaying(false)
            } else if (state === YTState.CUED) {
              setIsPlaying(false)
            } else if (state === YTState.ENDED) {
              setIsPlaying(false)
              if (!advancingRef.current && userArmedRef.current) {
                advancingRef.current = true
                const next = ((indexRef.current + 1) % tracks.length + tracks.length) % tracks.length
                indexRef.current = next
                setIndex(next)
                setCurrentTime(0)
                setDuration(0)
                try {
                  event.target.loadVideoById(tracks[next].youtubeId)
                } catch {
                  setError('Could not advance track')
                }
              }
            }
          },
          onError: (event) => {
            if (cancelled) return
            console.warn('[yt] error', event.data, 'on', tracks[indexRef.current]?.youtubeId)
            setIsPlaying(false)
            setError('This track blocked embed — hit Next')
            // Intentionally no auto-skip loop
          },
        },
      })

      playerRef.current = player

      poll = window.setInterval(() => {
        const p = playerRef.current
        if (!p || !readyRef.current || typeof p.getCurrentTime !== 'function') return
        try {
          if (p.getPlayerState() === window.YT!.PlayerState.PLAYING) {
            setCurrentTime(p.getCurrentTime() || 0)
            const d = p.getDuration()
            if (d) setDuration(d)
          }
        } catch {
          /* player mid-destroy */
        }
      }, 400)
    })

    return () => {
      cancelled = true
      readyRef.current = false
      setReady(false)
      if (poll) clearInterval(poll)
      const p = playerRef.current
      playerRef.current = null
      try {
        p?.destroy()
      } catch {
        /* noop */
      }
      host.replaceChildren()
    }
  }, [])

  const play = useCallback(() => {
    const p = playerRef.current
    if (!p || !readyRef.current) return
    userArmedRef.current = true
    setError(null)
    try {
      p.playVideo()
    } catch {
      setError('Playback failed — click Play again')
    }
  }, [])

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo()
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, pause, play])

  const next = useCallback(() => {
    userArmedRef.current = true
    loadTrack(indexRef.current + 1, true)
  }, [loadTrack])

  const prev = useCallback(() => {
    const p = playerRef.current
    if (p && readyRef.current) {
      try {
        if (p.getCurrentTime() > 3) {
          p.seekTo(0, true)
          return
        }
      } catch {
        /* fall through */
      }
    }
    userArmedRef.current = true
    loadTrack(indexRef.current - 1, true)
  }, [loadTrack])

  const seek = useCallback((seconds: number) => {
    const p = playerRef.current
    if (!p || !readyRef.current) return
    p.seekTo(seconds, true)
    setCurrentTime(seconds)
  }, [])

  const setVolume = useCallback(
    (v: number) => {
      const clamped = Math.max(0, Math.min(100, v))
      volumeRef.current = clamped
      setVolumeState(clamped)
      playerRef.current?.setVolume(clamped)
      if (clamped > 0 && muted) {
        playerRef.current?.unMute()
        setMuted(false)
      }
    },
    [muted],
  )

  const toggleMute = useCallback(() => {
    const p = playerRef.current
    if (!p) return
    if (p.isMuted()) {
      p.unMute()
      setMuted(false)
    } else {
      p.mute()
      setMuted(true)
    }
  }, [])

  return {
    track,
    index,
    ready,
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    error,
    progressLabel: `${formatTime(currentTime)} / ${formatTime(duration)}`,
    play,
    pause,
    toggle,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
  }
}
