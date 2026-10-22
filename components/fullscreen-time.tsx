"use client"

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

interface FullscreenTimeProps {
  time: string
  isFullscreen: boolean
  onClose: () => void
}

export function FullscreenTime({ time, isFullscreen, onClose }: FullscreenTimeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState(320) // start with a large size

  useEffect(() => {
    if (!containerRef.current || !timeRef.current) return

    const calculateFontSize = () => {
      const container = containerRef.current!
      const timeElement = timeRef.current!
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight

      // Binary search for the optimal font size
      let min = 10
      let max = 1000
      let optimal = fontSize

      while (min <= max) {
        const mid = Math.floor((min + max) / 2)
        timeElement.style.fontSize = `${mid}px`

        const fits = timeElement.offsetWidth <= containerWidth * 0.9 && 
                    timeElement.offsetHeight <= containerHeight * 0.9

        if (fits) {
          optimal = mid
          min = mid + 1
        } else {
          max = mid - 1
        }
      }

      setFontSize(optimal)
      timeElement.style.fontSize = `${optimal}px`
    }

    const observer = new ResizeObserver(calculateFontSize)
    observer.observe(containerRef.current)

    // Initial calculation
    calculateFontSize()

    return () => observer.disconnect()
  }, [time, isFullscreen])

  useEffect(() => {
    if (!isFullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isFullscreen, onClose])

  if (!isFullscreen) return null

  // Accent the trailing ":SS" when the time is HH:MM:SS
  const match = /^(.*\d{2}:\d{2})(:\d{2})$/.exec(time)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-paper text-ink"
      ref={containerRef}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-label="Exit fullscreen"
        title="Exit fullscreen"
        className="absolute right-6 top-6 inline-flex size-11 items-center justify-center rounded-full border border-line bg-transparent transition-colors hover:border-line2 hover:bg-surface"
      >
        <X className="size-[18px]" strokeWidth={1.75} />
      </button>
      <div
        ref={timeRef}
        className="tnum whitespace-nowrap font-mono font-light leading-none tracking-[-0.055em]"
        style={{ fontSize: `${fontSize}px` }}
      >
        {match ? (
          <>
            {match[1]}
            <span className="text-brand">{match[2]}</span>
          </>
        ) : (
          time
        )}
      </div>
    </div>
  )
}
