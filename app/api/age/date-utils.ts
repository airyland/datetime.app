const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const MINUTES_PER_HOUR = 60
const MIN_OFFSET_MINUTES = -12 * MINUTES_PER_HOUR
const MAX_OFFSET_MINUTES = 14 * MINUTES_PER_HOUR

export function parseUtcOffsetParam(value: string | null): number {
  if (!value || value.trim() === "") {
    return 0
  }

  const normalized = value.trim()
  let offsetMinutes: number

  if (/^[+-]?\d{1,2}:\d{2}$/.test(normalized)) {
    const sign = normalized.startsWith("-") ? -1 : 1
    const unsigned = normalized.replace(/^[+-]/, "")
    const [hoursPart, minutesPart] = unsigned.split(":")
    const hours = Number(hoursPart)
    const minutes = Number(minutesPart)

    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      throw new Error("Invalid utcOffset format. Use minutes from UTC or ±HH:MM.")
    }

    if (minutes < 0 || minutes >= MINUTES_PER_HOUR) {
      throw new Error("Invalid utcOffset format. Minutes must be between 00 and 59.")
    }

    offsetMinutes = sign * (hours * MINUTES_PER_HOUR + minutes)
  } else if (/^[+-]?\d{1,4}$/.test(normalized)) {
    const numericValue = Number(normalized)

    if (!Number.isFinite(numericValue)) {
      throw new Error("Invalid utcOffset format. Use minutes from UTC or ±HH:MM.")
    }

    if (Math.abs(numericValue) <= 14) {
      offsetMinutes = numericValue * MINUTES_PER_HOUR
    } else {
      offsetMinutes = numericValue
    }
  } else {
    throw new Error("Invalid utcOffset format. Use minutes from UTC or ±HH:MM.")
  }

  if (offsetMinutes < MIN_OFFSET_MINUTES || offsetMinutes > MAX_OFFSET_MINUTES) {
    throw new Error("utcOffset must be between -12:00 and +14:00.")
  }

  return offsetMinutes
}

export function parseIsoDateWithOffset(value: string, utcOffsetMinutes: number): Date {
  if (!ISO_DATE_REGEX.test(value)) {
    throw new Error("Invalid date format. Use YYYY-MM-DD.")
  }

  const [year, month, day] = value.split("-").map(Number)
  const utcMillis = Date.UTC(year, month - 1, day)
  const parsedDate = new Date(utcMillis - utcOffsetMinutes * 60 * 1000)

  const shifted = new Date(parsedDate.getTime() + utcOffsetMinutes * 60 * 1000)
  if (
    shifted.getUTCFullYear() !== year ||
    shifted.getUTCMonth() + 1 !== month ||
    shifted.getUTCDate() !== day
  ) {
    throw new Error("Invalid date format. Use YYYY-MM-DD.")
  }

  return parsedDate
}

export function startOfDayWithOffset(date: Date, utcOffsetMinutes: number): Date {
  const shifted = new Date(date.getTime() + utcOffsetMinutes * 60 * 1000)
  const year = shifted.getUTCFullYear()
  const month = shifted.getUTCMonth()
  const day = shifted.getUTCDate()
  return new Date(Date.UTC(year, month, day) - utcOffsetMinutes * 60 * 1000)
}

export function formatDateWithOffset(date: Date, utcOffsetMinutes: number): string {
  const shifted = new Date(date.getTime() + utcOffsetMinutes * 60 * 1000)
  const year = shifted.getUTCFullYear()
  const month = String(shifted.getUTCMonth() + 1).padStart(2, "0")
  const day = String(shifted.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function formatUtcOffsetLabel(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? "+" : "-"
  const absoluteMinutes = Math.abs(offsetMinutes)
  const hours = Math.floor(absoluteMinutes / MINUTES_PER_HOUR)
  const minutes = absoluteMinutes % MINUTES_PER_HOUR
  return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

export const isoDateRegex = ISO_DATE_REGEX
