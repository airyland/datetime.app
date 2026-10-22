export const COUNTDOWN_YEARS = [2026, 2027, 2028, 2029, 2030]

export type CountdownHoliday = {
  id: string
  name: string
  tag: string
  year: number
  month: number // 0-based
  day: number
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

/** nth (1-based) given weekday (0=Sun) of a month, as day-of-month. */
function nthWeekday(y: number, m: number, weekday: number, n: number) {
  const first = new Date(Date.UTC(y, m, 1)).getUTCDay()
  return 1 + ((weekday - first + 7) % 7) + (n - 1) * 7
}

/** Western Easter Sunday (anonymous Gregorian algorithm). */
function easter(y: number) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4), k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return { month: month - 1, day }
}

// Astronomical dates that can't be computed cheaply
const LUNAR_NEW_YEAR: Record<number, [number, number]> = { 2026: [1, 17], 2027: [1, 6], 2028: [0, 26], 2029: [1, 13], 2030: [1, 3] }
const DIWALI: Record<number, [number, number]> = { 2026: [10, 8], 2027: [9, 29], 2028: [9, 17], 2029: [10, 5], 2030: [9, 26] }

const HANUKKAH: Record<number, [number, number]> = { 2026: [11, 4], 2027: [11, 24], 2028: [11, 12], 2029: [11, 1], 2030: [11, 20] }
const RAMADAN: Record<number, [number, number]> = { 2026: [1, 18], 2027: [1, 8], 2028: [0, 28], 2029: [0, 16], 2030: [0, 5] }
const EID_FITR: Record<number, [number, number]> = { 2026: [2, 20], 2027: [2, 9], 2028: [1, 26], 2029: [1, 14], 2030: [1, 4] }
const EID_ADHA: Record<number, [number, number]> = { 2026: [4, 27], 2027: [4, 16], 2028: [4, 5], 2029: [3, 24], 2030: [3, 13] }

/** Last given weekday (0=Sun) of a month, as day-of-month. */
function lastWeekday(y: number, m: number, weekday: number) {
  const last = new Date(Date.UTC(y, m + 1, 0))
  return last.getUTCDate() - ((last.getUTCDay() - weekday + 7) % 7)
}

export function holidaysOf(year: number): CountdownHoliday[] {
  const e = easter(year)
  const thanks = nthWeekday(year, 10, 4, 4)
  const gd = new Date(Date.UTC(year, e.month, e.day - 2))
  const gf: [number, number] = [gd.getUTCMonth(), gd.getUTCDate()]
  const list: [string, string, string, number, number][] = [
    ["new-year", "New Year's Day", "Global", 0, 1],
    ["valentines-day", "Valentine's Day", "Global", 1, 14],
    ["easter", "Easter", "Christian", e.month, e.day],
    ["mothers-day", "Mother's Day", "US", 4, nthWeekday(year, 4, 0, 2)],
    ["independence-day", "Independence Day", "US", 6, 4],
    ["halloween", "Halloween", "Seasonal", 9, 31],
    ["thanksgiving", "Thanksgiving", "US", 10, thanks],
    ["black-friday", "Black Friday", "Shopping", 10, thanks + 1],
    ["christmas-eve", "Christmas Eve", "Global", 11, 24],
    ["christmas", "Christmas", "Global", 11, 25],
    ["new-years-eve", "New Year's Eve", "Global", 11, 31],
    ["boxing-day", "Boxing Day", "UK & Commonwealth", 11, 26],
    ["mlk-day", "Martin Luther King Jr. Day", "US", 0, nthWeekday(year, 0, 1, 3)],
    ["presidents-day", "Presidents' Day", "US", 1, nthWeekday(year, 1, 1, 3)],
    ["st-patricks-day", "St. Patrick's Day", "Cultural", 2, 17],
    ["good-friday", "Good Friday", "Christian", ...gf],
    ["april-fools-day", "April Fools' Day", "Global", 3, 1],
    ["cinco-de-mayo", "Cinco de Mayo", "Cultural", 4, 5],
    ["memorial-day", "Memorial Day", "US", 4, lastWeekday(year, 4, 1)],
    ["fathers-day", "Father's Day", "US", 5, nthWeekday(year, 5, 0, 3)],
    ["juneteenth", "Juneteenth", "US", 5, 19],
    ["canada-day", "Canada Day", "Canada", 6, 1],
    ["labor-day", "Labor Day", "US", 8, nthWeekday(year, 8, 1, 1)],
    ["veterans-day", "Veterans Day", "US", 10, 11],
  ]
  for (const [id, name, tag, t] of [["hanukkah", "Hanukkah", "Jewish", HANUKKAH], ["ramadan", "Ramadan", "Islamic", RAMADAN], ["eid-al-fitr", "Eid al-Fitr", "Islamic", EID_FITR], ["eid-al-adha", "Eid al-Adha", "Islamic", EID_ADHA]] as const) {
    const v = t[year]
    if (v) list.push([id, name, tag, v[0], v[1]])
  }
  const lny = LUNAR_NEW_YEAR[year]
  if (lny) list.push(["lunar-new-year", "Lunar New Year", "Cultural", lny[0], lny[1]])
  const dw = DIWALI[year]
  if (dw) list.push(["diwali", "Diwali", "Cultural", dw[0], dw[1]])
  return list
    .map(([id, name, tag, month, day]) => ({ id, name, tag, year, month, day }))
    .sort((a, b) => a.month - b.month || a.day - b.day)
}

export function getHoliday(id: string, year: number) {
  return holidaysOf(year).find((h) => h.id === id)
}

export function holidayIds() {
  return holidaysOf(COUNTDOWN_YEARS[0]).map((h) => h.id)
}

export const slugOf = (id: string, year: number) => `${id}-${year}`

export function parseSlug(slug: string): { id: string; year: number } | null {
  const m = /^(.+)-(\d{4})$/.exec(slug)
  if (!m) return null
  const year = Number(m[2])
  if (!COUNTDOWN_YEARS.includes(year) || !getHoliday(m[1], year)) return null
  return { id: m[1], year }
}

export function allSlugs() {
  return COUNTDOWN_YEARS.flatMap((y) => holidaysOf(y).map((h) => slugOf(h.id, y)))
}

export const weekdayOf = (h: { year: number; month: number; day: number }) => WEEKDAYS[new Date(Date.UTC(h.year, h.month, h.day)).getUTCDay()]
export const dateLabel = (h: { year: number; month: number; day: number }) => `${MONTHS[h.month]} ${h.day}, ${h.year}`

/* ---- time-zone aware helpers (client use) ---- */

function partsIn(ts: number, tz: string) {
  const f = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" })
  const p: Record<string, number> = {}
  for (const x of f.formatToParts(new Date(ts))) if (x.type !== "literal") p[x.type] = Number(x.value)
  return p
}

function offsetMs(ts: number, tz: string) {
  const p = partsIn(ts, tz)
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(ts / 1000) * 1000
}

/** The instant at which `y-m-d` 00:00 starts in `tz`. */
export function startOfDayIn(y: number, m: number, d: number, tz: string) {
  const guess = Date.UTC(y, m, d)
  let ts = guess - offsetMs(guess, tz)
  ts = guess - offsetMs(ts, tz)
  return ts
}

/** Calendar days from today (in tz) until the date. Negative once it has passed. */
export function calendarDaysUntil(h: { year: number; month: number; day: number }, now: number, tz: string) {
  const p = partsIn(now, tz)
  return Math.round((Date.UTC(h.year, h.month, h.day) - Date.UTC(p.year, p.month - 1, p.day)) / 864e5)
}

/** Mon–Fri days strictly between today and the target date. */
export function workingDaysBetween(daysUntil: number, now: number, tz: string) {
  const p = partsIn(now, tz)
  let count = 0
  for (let i = 1; i < daysUntil; i++) {
    const wd = new Date(Date.UTC(p.year, p.month - 1, p.day + i)).getUTCDay()
    if (wd !== 0 && wd !== 6) count++
  }
  return count
}

const NAME_PATTERNS: Record<string, RegExp> = {
  "new-year": /^new year'?s? day$|^new year$/i,
  "valentines-day": /valentine/i,
  easter: /^easter( sunday)?$/i,
  "mothers-day": /mother'?s day/i,
  "independence-day": /^independence day$/i,
  halloween: /halloween/i,
  thanksgiving: /^thanksgiving( day)?$/i,
  "black-friday": /black friday/i,
  "christmas-eve": /christmas eve/i,
  christmas: /^christmas( day)?$/i,
  "new-years-eve": /new year'?s? eve/i,
  "lunar-new-year": /lunar new year|chinese new year|spring festival/i,
  diwali: /diwali|deepavali/i,
  "boxing-day": /^boxing day$/i,
  "mlk-day": /martin luther king/i,
  "presidents-day": /presidents'? day|washington'?s birthday/i,
  "st-patricks-day": /patrick/i,
  "good-friday": /^good friday$/i,
  "april-fools-day": /april fool/i,
  "cinco-de-mayo": /cinco de mayo/i,
  "memorial-day": /^memorial day$/i,
  "fathers-day": /father'?s day/i,
  juneteenth: /juneteenth/i,
  "canada-day": /^canada day$/i,
  "labor-day": /^labou?r day$/i,
  "veterans-day": /^veterans'? day$/i,
  hanukkah: /hanukkah|chanukah/i,
  ramadan: /^(first day of )?ramadan/i,
  "eid-al-fitr": /eid (al|ul)-?fitr/i,
  "eid-al-adha": /eid (al|ul)-?adha|feast of the sacrifice/i,
}

/** Countdown page slug for a holiday row, only when name and date both match a supported countdown. */
export function countdownSlugFor(name: string, date: Date): string | null {
  const year = date.getFullYear()
  if (!COUNTDOWN_YEARS.includes(year)) return null
  const n = name.replace(/[’‘]/g, "'").trim()
  for (const h of holidaysOf(year)) {
    if (!NAME_PATTERNS[h.id]?.test(n)) continue
    // multi-day festivals (Spring Festival, Diwali) list several rows around the main day
    const tol = h.id === "lunar-new-year" || h.id === "diwali" ? 3 : ["ramadan", "eid-al-fitr", "eid-al-adha"].includes(h.id) ? 1 : 0
    const diff = Math.abs(Date.UTC(year, date.getMonth(), date.getDate()) - Date.UTC(year, h.month, h.day)) / 86400000
    if (diff <= tol) return slugOf(h.id, year)
  }
  return null
}

/** Longer names used on cards and the hub hero. */
export const longName = (id: string, name: string) => (id === "easter" ? "Easter Sunday" : id === "christmas" ? "Christmas Day" : name)
