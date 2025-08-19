'use client'

import { useNow } from 'next-intl'
import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import spacetime from 'spacetime'
import { generateTimezoneHours, type HourInfo } from '@/lib/timezone-hours'
import { X, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Type for timezone info
export interface TimezoneInfo {
  city?: string
  name?: string
  value?: string
  label?: string
  isLocal?: boolean
}

// Helper function to get the timezone name regardless of data format
function getTimezoneName(tz: TimezoneInfo): string {
  return tz.name || tz.value || 'UTC'
}

// Helper function to get the timezone display name regardless of data format
function getTimezoneDisplayName(tz: TimezoneInfo): string {
  return tz.city || tz.label || ''
}

interface TimezoneTimelineProps {
  timezones: TimezoneInfo[]
  onSwitchToWorldClock?: () => void
}

const TimezoneTimeline = ({ 
  timezones, 
  onSwitchToWorldClock
}: TimezoneTimelineProps) => {
  // Add UTC as the second timezone if timezones array is not empty
  const timezonesWithUTC = timezones.length > 0 
    ? [
        timezones[0], // First timezone
        { city: 'UTC', name: 'UTC', value: 'UTC', label: 'UTC', isLocal: false }, // UTC as second
        ...timezones.slice(1) // Rest of the timezones
      ]
    : [{ city: 'Local', name: Intl.DateTimeFormat().resolvedOptions().timeZone, label: 'Local', value: Intl.DateTimeFormat().resolvedOptions().timeZone, isLocal: true }] // Default if empty
  const now = useNow({ updateInterval: 1000 })
  const timelineRef = useRef<HTMLDivElement>(null)
  const currentHourRef = useRef<HTMLDivElement>(null) // Ref for the current hour element

  const [hoveredHourIndex, setHoveredHourIndex] = useState<number | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [visibleHours, setVisibleHours] = useState(24) // Default to 24 hours

  // Calculate and set visible hours based on screen size
  const calculateVisibleHours = () => {
    const isMobile = window.innerWidth < 768
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024
    
    if (isMobile) {
      // On mobile, show 12-16 hours to fit the screen
      return 16
    } else if (isTablet) {
      // On tablet, show 24 hours
      return 24
    } else {
      // On desktop, show 48 hours
      return 48
    }
  }

  // Scroll to current time on load and fade in to prevent flicker
  useLayoutEffect(() => {
    // Calculate visible hours based on screen size
    const hours = calculateVisibleHours()
    setVisibleHours(hours)

    // Add a small delay to ensure the DOM is fully rendered
    setTimeout(() => {
      if (currentHourRef.current && timelineRef.current) {
        const container = timelineRef.current
        const element = currentHourRef.current

        // Check if on mobile screen (less than 768px)
        const isMobile = window.innerWidth < 768
        
        // Calculate the scroll position
        const elementWidth = element.offsetWidth
        const containerWidth = container.offsetWidth
        let scrollPosition
        
        if (isMobile) {
          // On mobile, don't auto scroll - let user scroll manually
          // Just set ready state without scrolling
        } else {
          // On desktop, center the element
          scrollPosition = element.offsetLeft - containerWidth / 2 + elementWidth / 2
          
          // Ensure we don't scroll into negative territory
          const finalScrollPosition = Math.max(0, scrollPosition)
          
          container.scrollLeft = finalScrollPosition
        }
        setIsReady(true) // Fade in after scrolling
      }
    }, 100) // 100ms delay to ensure DOM is ready
  }, []) // Empty dependency array ensures this runs only once on mount

  const hourWidth = 32 // w-8
  const totalHourWidth = hourWidth // No gap between hours

  // Add resize handler to adjust visible hours and scroll position when screen size changes
  useEffect(() => {
    const handleResize = () => {
      // Recalculate visible hours
      const hours = calculateVisibleHours()
      setVisibleHours(hours)
      
      if (currentHourRef.current && timelineRef.current) {
        const container = timelineRef.current
        const element = currentHourRef.current
        const containerWidth = container.offsetWidth
        const isMobile = window.innerWidth < 768
        
        const elementWidth = element.offsetWidth
        let scrollPosition
        
        if (isMobile) {
          // On mobile, don't auto scroll on resize - preserve user's scroll position
          return
        } else {
          scrollPosition = element.offsetLeft - containerWidth / 2 + elementWidth / 2
          container.scrollLeft = Math.max(0, scrollPosition)
        }
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="grid grid-cols-[auto_1fr] w-full mx-auto md:max-w-4xl">
      {/* Column 1: Timezone Labels */}
      <div className="col-start-1 pr-4 grid gap-y-2 relative">
        {/* Switch to World Clock Button */}
        {onSwitchToWorldClock && (
          <button 
            onClick={onSwitchToWorldClock} 
            className="absolute -top-8 right-0 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Manage timezones in World Clock"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
        {timezonesWithUTC.map(tz => {
          // 确保 tz 存在且有可用的时区名称
          if (!tz || (!tz.name && !tz.value)) return null
          
          // 获取时区名称和显示名称
          const tzName = getTimezoneName(tz)
          const tzDisplayName = getTimezoneDisplayName(tz)
          
          try {
            const s = spacetime(now, tzName)
            const offsetInHours = s.offset() / 60
            const offsetString =
              offsetInHours === 0 ? 'GMT' : `GMT${offsetInHours >= 0 ? '+' : ''}${offsetInHours}`
            
            return (
              <div key={tzName || 'timezone-' + Math.random()} className="flex h-8 items-center justify-end relative group">
                <div className="text-right">
                  <div className="flex items-center justify-end">
                    <div className="font-bold text-sm">{tzDisplayName}</div>
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
          } catch (error) {
            console.error(`Error displaying timezone ${tz.name}:`, error)
            return (
              <div key={tzName || 'unknown-' + Math.random()} className="flex h-8 items-center justify-end relative group">
                <div className="text-right">
                  <div className="flex items-center justify-end">
                    <div className="font-bold text-sm">{tzDisplayName || 'Unknown'}</div>
                    <span className="ml-2 text-[8px] border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-0.5 py-0 rounded font-mono">
                      ERROR
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">
                    Invalid timezone
                  </div>
                </div>
              </div>
            )
          }
        })}
      </div>

      {/* Column 2: Timelines (in a single scrollable container) */}
      <div
        className={`col-start-2 overflow-x-auto timeline-scroll relative grid gap-y-2 transition-opacity ${isReady ? 'opacity-100' : 'opacity-0'}`}
        ref={timelineRef}
        onMouseLeave={() => setHoveredHourIndex(null)}
        style={{ 
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          msOverflowStyle: 'auto'
        }}
      >
        {timezonesWithUTC.map((tz, tzIndex) => {
          // Generate hours for this specific timezone
          // On mobile, generate fewer hours with current time closer to the start
          const isMobile = window.innerWidth < 768
          const hoursBeforeCurrent = isMobile ? 3 : 12 // On mobile, only show 3 hours before current
          const totalHours = visibleHours
          const timezoneHours = generateTimezoneHours(getTimezoneName(tz), now, totalHours, hoursBeforeCurrent)
          const visibleTimezoneHours = timezoneHours
          return (
            <div
              key={tz.name}
              className="flex h-8 items-center rounded-lg"
              style={{ minWidth: 'max-content' }}
            >
              {visibleTimezoneHours.map(hour => (
                <div
                  key={hour.index}
                  ref={hour.isCurrentHour && tzIndex === 0 ? currentHourRef : null}
                  className={`flex-shrink-0 h-full w-8 cursor-pointer flex flex-col items-center justify-center ${hour.backgroundClass} ${hour.isMidnight && hour.index === 12 ? 'border-l-2 border-l-blue-500' : ''}`}
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

        {/* Current Hour Highlight Box - spans all timezone rows */}
        {(() => {
          const isMobile = window.innerWidth < 768
          const hoursBeforeCurrent = isMobile ? 3 : 12
          const totalHours = visibleHours
          const timezoneHours = generateTimezoneHours(getTimezoneName(timezonesWithUTC[0]), now, totalHours, hoursBeforeCurrent)
          const currentHour = timezoneHours.find(h => h.isCurrentHour)
          if (!currentHour) return null

          return (
            <div
              className="absolute top-0 bottom-0 w-8 bg-blue-500/30 border-2 border-blue-500 pointer-events-none rounded-md z-20"
              style={{ 
                transform: `translateX(${currentHour.index * totalHourWidth}px)`
              }}
            />
          )
        })()}

        {/* Hover/Selection Box - spans all timezone rows */}
        {hoveredHourIndex !== null && hoveredHourIndex < visibleHours && (
          <div
            className="absolute top-0 bottom-0 w-8 bg-blue-500/20 pointer-events-none rounded-md transition-transform duration-100 ease-in-out z-10"
            style={{
              transform: `translateX(${hoveredHourIndex * totalHourWidth}px)`
            }}
          />
        )}

      </div>
    </div>
  )
}

export default TimezoneTimeline
