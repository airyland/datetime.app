const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

export interface YMD { year: number; month: number; day: number }

export function parseYmd(value: string): YMD {
  const m = ISO_DATE.exec(value)
  if (!m) throw new Error("Invalid date format. Use YYYY-MM-DD.")
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const d = new Date(Date.UTC(year, month - 1, day))
  if (d.getUTCFullYear() !== year || d.getUTCMonth() + 1 !== month || d.getUTCDate() !== day) {
    throw new Error("Invalid date: that day does not exist.")
  }
  return { year, month, day }
}

export function formatYmd({ year, month, day }: YMD): string {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

/** utcOffset: "+08:00", "-05:30", "8" (hours) or minutes like "480". Returns minutes. */
export function parseUtcOffset(value: string | null): number {
  if (!value || !value.trim()) return 0
  const v = value.trim()
  let minutes: number
  const hm = /^([+-]?)(\d{1,2}):(\d{2})$/.exec(v)
  if (hm) {
    if (Number(hm[3]) > 59) throw new Error("Invalid utcOffset: minutes must be 00-59.")
    minutes = (hm[1] === "-" ? -1 : 1) * (Number(hm[2]) * 60 + Number(hm[3]))
  } else if (/^[+-]?\d{1,4}$/.test(v)) {
    const n = Number(v)
    minutes = Math.abs(n) <= 14 ? n * 60 : n
  } else {
    throw new Error("Invalid utcOffset. Use ±HH:MM, hours, or minutes.")
  }
  if (minutes < -12 * 60 || minutes > 14 * 60) throw new Error("utcOffset must be between -12:00 and +14:00.")
  return minutes
}

export function formatOffset(minutes: number): string {
  const a = Math.abs(minutes)
  return `${minutes < 0 ? "-" : "+"}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`
}

/** Today's calendar date at the given UTC offset. */
export function todayAt(offsetMinutes: number, now = new Date()): YMD {
  const d = new Date(now.getTime() + offsetMinutes * 60_000)
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() }
}

const toUtc = ({ year, month, day }: YMD) => Date.UTC(year, month - 1, day)

/** Calendar age between two dates (timezone independent). */
export function ageBetween(birth: YMD, target: YMD) {
  if (toUtc(birth) > toUtc(target)) throw new Error("birthdate cannot be after targetDate.")
  // Whole months elapsed, then the leftover days from the (end-of-month clamped) anniversary.
  let totalMonths = (target.year - birth.year) * 12 + (target.month - birth.month)
  if (target.day < birth.day) totalMonths--
  const idx = birth.year * 12 + (birth.month - 1) + totalMonths
  const ay = Math.floor(idx / 12)
  const am = idx % 12
  const lastDay = new Date(Date.UTC(ay, am + 1, 0)).getUTCDate()
  const anchor = Date.UTC(ay, am, Math.min(birth.day, lastDay))
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const days = Math.round((toUtc(target) - anchor) / 86_400_000)
  const totalDays = Math.round((toUtc(target) - toUtc(birth)) / 86_400_000)
  return {
    years,
    months,
    days,
    totalDays,
    totalMonths,
    totalWeeks: Math.floor(totalDays / 7),
    decimalAge: Number((totalDays / 365.25).toFixed(2)),
    formatted: {
      readable: `${years} years and ${months} months`,
      ymd: `${years} years, ${months} months, ${days} days`,
      short: `${years}y ${months}m ${days}d`,
    },
  }
}
