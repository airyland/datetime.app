export interface CountdownEvent {
  slug: string
  getNextDate: () => Date  // function to get next occurrence
  emoji: string
}

export const countdownEvents: CountdownEvent[] = [
  {
    slug: 'new-year',
    getNextDate: () => {
      const now = new Date()
      const year = now.getMonth() === 11 && now.getDate() === 31 ? now.getFullYear() + 1 : now.getFullYear() + (now.getMonth() >= 0 ? 1 : 0)
      // Simple: next Jan 1
      const next = new Date(now.getFullYear() + 1, 0, 1)
      if (new Date(now.getFullYear(), 0, 1) > now) return new Date(now.getFullYear(), 0, 1)
      return next
    },
    emoji: '🎆',
  },
  {
    slug: 'christmas',
    getNextDate: () => {
      const now = new Date()
      const thisYear = new Date(now.getFullYear(), 11, 25)
      return thisYear > now ? thisYear : new Date(now.getFullYear() + 1, 11, 25)
    },
    emoji: '🎄',
  },
  {
    slug: 'halloween',
    getNextDate: () => {
      const now = new Date()
      const thisYear = new Date(now.getFullYear(), 9, 31)
      return thisYear > now ? thisYear : new Date(now.getFullYear() + 1, 9, 31)
    },
    emoji: '🎃',
  },
  {
    slug: 'valentines-day',
    getNextDate: () => {
      const now = new Date()
      const thisYear = new Date(now.getFullYear(), 1, 14)
      return thisYear > now ? thisYear : new Date(now.getFullYear() + 1, 1, 14)
    },
    emoji: '❤️',
  },
  {
    slug: 'mid-autumn',
    getNextDate: () => {
      // Approximate dates for upcoming years
      const dates: Record<number, [number, number]> = {
        2025: [9, 6], 2026: [8, 25], 2027: [9, 15], 2028: [9, 3], 2029: [8, 22], 2030: [9, 12]
      }
      const now = new Date()
      for (const [year, [month, day]] of Object.entries(dates)) {
        const d = new Date(parseInt(year), month - 1, day)
        if (d > now) return d
      }
      return new Date(now.getFullYear() + 1, 8, 15) // fallback
    },
    emoji: '🥮',
  },
  {
    slug: 'spring-festival',
    getNextDate: () => {
      const dates: Record<number, [number, number]> = {
        2025: [1, 29], 2026: [2, 17], 2027: [2, 6], 2028: [1, 26], 2029: [2, 13], 2030: [2, 3]
      }
      const now = new Date()
      for (const [year, [month, day]] of Object.entries(dates)) {
        const d = new Date(parseInt(year), month - 1, day)
        if (d > now) return d
      }
      return new Date(now.getFullYear() + 1, 1, 1) // fallback
    },
    emoji: '🧧',
  },
  {
    slug: 'independence-day',
    getNextDate: () => {
      const now = new Date()
      const thisYear = new Date(now.getFullYear(), 6, 4)
      return thisYear > now ? thisYear : new Date(now.getFullYear() + 1, 6, 4)
    },
    emoji: '🇺🇸',
  },
  {
    slug: 'thanksgiving',
    getNextDate: () => {
      const now = new Date()
      // 4th Thursday of November
      const getDate = (year: number) => {
        const nov1 = new Date(year, 10, 1)
        const dayOfWeek = nov1.getDay()
        const firstThursday = dayOfWeek <= 4 ? 1 + (4 - dayOfWeek) : 1 + (11 - dayOfWeek)
        return new Date(year, 10, firstThursday + 21)
      }
      const thisYear = getDate(now.getFullYear())
      return thisYear > now ? thisYear : getDate(now.getFullYear() + 1)
    },
    emoji: '🦃',
  },
]

export function getEventBySlug(slug: string): CountdownEvent | undefined {
  return countdownEvents.find(e => e.slug === slug)
}
