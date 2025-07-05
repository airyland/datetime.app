'use client'

import { useNow } from 'next-intl'
import { useLayoutEffect, useRef, useState } from 'react'
import spacetime from 'spacetime'
import { generateTimezoneHours, type HourInfo } from '@/lib/timezone-hours'

interface TimezoneInfo {
  city: string
  name: string
}

const TimezoneTimeline = ({ timezones }: { timezones: TimezoneInfo[] }) => {
  // Add UTC as the second timezone and Beijing at the end
  const timezonesWithUTC = [
    timezones[0], // First timezone
    { city: 'UTC', name: 'UTC' }, // UTC as second
    ...timezones.slice(1) // Rest of the timezones
  ]
  const now = useNow({ updateInterval: 1000 })
  const timelineRef = useRef<HTMLDivElement>(null)
  const currentHourRef = useRef<HTMLDivElement>(null) // Ref for the current hour element

  const [hoveredHourIndex, setHoveredHourIndex] = useState<number | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [visibleHours, setVisibleHours] = useState(48)

  // Scroll to current time on load and fade in to prevent flicker
  useLayoutEffect(() => {
    if (currentHourRef.current && timelineRef.current) {
      const container = timelineRef.current
      const element = currentHourRef.current

      // Calculate visible hours to avoid partial display
      const containerWidth = container.offsetWidth
      const maxVisibleHours = Math.floor(containerWidth / hourWidth)
      setVisibleHours(Math.min(48, maxVisibleHours))

      // Calculate the scroll position to center the element
      const elementWidth = element.offsetWidth
      const scrollPosition = element.offsetLeft - containerWidth / 2 + elementWidth / 2

      container.scrollLeft = scrollPosition
      setIsReady(true) // Fade in after scrolling
    }
  }, []) // Empty dependency array ensures this runs only once on mount

  const hourWidth = 32 // w-8
  const totalHourWidth = hourWidth // No gap between hours

  return (
    <div className="grid grid-cols-[auto_1fr] w-full max-w-4xl mx-auto">
      {/* Column 1: Timezone Labels */}
      <div className="col-start-1 pr-4 grid gap-y-2">
        {timezonesWithUTC.map(tz => {
          const s = spacetime(now, tz.name)
          const offsetInHours = s.offset() / -60
          const offsetString =
            offsetInHours === 0 ? 'GMT' : `GMT${offsetInHours > 0 ? '+' : ''}${offsetInHours}`

          return (
            <div key={tz.name} className="flex h-8 items-center justify-end">
              <div className="text-right">
                <div className="flex items-center justify-end">
                  <div className="font-bold text-sm">{tz.city}</div>
                  <span className="ml-2 text-[8px] border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-0.5 py-0 rounded font-mono">
                    {offsetString}
                  </span>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {s.format('{month-pad}-{date-pad} {hour-24-pad}:{minute-pad}')}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Column 2: Timelines (in a single scrollable container) */}
      <div
        className={`col-start-2 overflow-x-auto scrollbar-hide relative grid gap-y-2 transition-opacity ${isReady ? 'opacity-100' : 'opacity-0'}`}
        ref={timelineRef}
        onMouseLeave={() => setHoveredHourIndex(null)}
      >
        {timezonesWithUTC.map((tz, tzIndex) => {
          // Generate hours for this specific timezone
          const timezoneHours = generateTimezoneHours(tz.name, now)
          // Only show the calculated visible hours to avoid partial display
          const visibleTimezoneHours = timezoneHours.slice(0, visibleHours)
          return (
            <div
              key={tz.name}
              className="flex h-8 items-center rounded-lg overflow-hidden"
            >
              {visibleTimezoneHours.map(hour => (
                <div
                  key={hour.index}
                  ref={hour.isCurrentHour && tzIndex === 0 ? currentHourRef : null}
                  className={`flex-shrink-0 h-full w-8 cursor-pointer flex flex-col items-center justify-center ${hour.backgroundClass} ${hour.isMidnight ? 'border-l-2 border-l-blue-500' : ''}`}
                  onMouseEnter={() => setHoveredHourIndex(hour.index)}
                >
                  <div className="flex flex-col items-center leading-none">
                    <span
                      className={`text-xs font-medium ${
                        hour.isMidnight ? 'text-xs uppercase font-bold text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      {hour.displayText}
                    </span>
                    <span
                      className={`text-[10px] -mt-1 ${
                        hour.isMidnight ? 'text-xs font-bold text-blue-600 dark:text-blue-400' : 'text-gray-500'
                      }`}
                    >
                      {hour.displaySubText}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        })}

        {/* Current Hour Highlight Box */}
        {(() => {
          const timezoneHours = generateTimezoneHours(timezonesWithUTC[0].name, now)
          const visibleTimezoneHours = timezoneHours.slice(0, visibleHours)
          const currentHour = visibleTimezoneHours.find(h => h.isCurrentHour)
          if (!currentHour) return null

          return (
            <div
              className="absolute top-0 bottom-0 w-8 bg-blue-500/30 border-2 border-blue-500 pointer-events-none rounded-md z-20"
              style={{ transform: `translateX(${currentHour.index * totalHourWidth}px)` }}
            />
          )
        })()}

        {/* Hover/Selection Box */}
        {hoveredHourIndex !== null && hoveredHourIndex < visibleHours && (
          <div
            className="absolute top-0 bottom-0 w-8 bg-blue-500/20 pointer-events-none rounded-md transition-transform duration-100 ease-in-out z-10"
            style={{
              transform: `translateX(${hoveredHourIndex * totalHourWidth}px)`,
            }}
          />
        )}
      </div>
    </div>
  )
}

export default TimezoneTimeline
