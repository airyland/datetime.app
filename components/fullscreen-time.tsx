"use client"

import { useEffect, useRef, useState } from 'react'
import { JetBrains_Mono } from "next/font/google"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

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
  }, [time])

  if (!isFullscreen) return null

  return (
    <div 
      className="fixed inset-0 bg-white dark:bg-black flex items-center justify-center z-50"
      ref={containerRef}
      onClick={onClose}
    >
      <div 
        ref={timeRef}
        className={`text-black dark:text-white font-bold tracking-tight leading-none ${jetbrainsMono.className}`}
        style={{ fontSize: `${fontSize}px` }}
      >
        {time}
      </div>
    </div>
  )
}
