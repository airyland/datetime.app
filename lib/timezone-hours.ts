import spacetime from 'spacetime'

export interface HourInfo {
  date: Date
  index: number
  hour24: number
  hour12: number
  period: 'am' | 'pm'
  isMidnight: boolean
  isCurrentHour: boolean
  isPastHour: boolean
  dayKey: string
  weekday: string
  monthDay: number
  displayText: string
  displaySubText: string
  backgroundClass: string
}

/**
 * Generate 48 hours of time data for a specific timezone
 * Starting from 12 hours ago to 35 hours ahead
 */
export function generateTimezoneHours(timezone: string, currentTime: Date = new Date()): HourInfo[] {
  const hours: HourInfo[] = []

  const startTime = new Date(currentTime.getTime() - 12 * 60 * 60 * 1000)

  for (let i = 0; i < 48; i++) {
    const baseDate = new Date(startTime.getTime() + i * 60 * 60 * 1000)
    const tzTime = spacetime(baseDate, timezone)
    const nowInTz = spacetime(currentTime, timezone)

    const hour24 = tzTime.hour()
    const hour12 = hour24 === 0 ? 12 : hour24 <= 12 ? hour24 : hour24 - 12
    const period: 'am' | 'pm' = hour24 >= 12 ? 'pm' : 'am'

    const isMidnight = hour24 === 0
    const isCurrentHour = tzTime.isSame(nowInTz, 'hour')
    // Use absolute time for past hour calculation to ensure vertical alignment across all timezones.
    // The current hour itself should not be marked as 'past'.
    const isPastHour = !isCurrentHour && baseDate.getTime() < currentTime.getTime()

    const hourInfo: HourInfo = {
      date: baseDate,
      index: i,
      hour24,
      hour12,
      period,
      isMidnight,
      isCurrentHour,
      isPastHour,
      dayKey: `${tzTime.year()}-${String(tzTime.month() + 1).padStart(2, '0')}-${String(tzTime.date()).padStart(2, '0')}`,
      weekday: tzTime.format('{day-short}'),
      monthDay: tzTime.date(),
      displayText: isMidnight ? tzTime.format('{day-short}') : hour12.toString(),
      displaySubText: isMidnight ? tzTime.format('date') : period,
      backgroundClass: isPastHour ? 'bg-gray-100 dark:bg-gray-800/50' : 'bg-white dark:bg-black',
    }

    hours.push(hourInfo)
  }

  return hours
}

/**
 * Debug function to print hours sequence
 */
export function debugPrintHours(timezone: string, currentTime?: Date) {
  const hours = generateTimezoneHours(timezone, currentTime)
  console.log(`\n=== Hours for ${timezone} ===`)

  hours.forEach((hour, i) => {
    const current = hour.isCurrentHour ? ' [CURRENT]' : ''
    const past = hour.isPastHour ? ' (past)' : ' (future)'
    console.log(`${i}: ${hour.hour12}${hour.period} (${hour.hour24}:00) - ${hour.dayKey}${current}${past}`)
  })
}