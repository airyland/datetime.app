"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { calendarDaysUntil, getHoliday, startOfDayIn, workingDaysBetween } from "@/lib/countdown"

const ZONES = ["America/Los_Angeles", "America/New_York", "America/Sao_Paulo", "Europe/London", "Europe/Paris", "Africa/Cairo", "Asia/Dubai", "Asia/Kolkata", "Asia/Shanghai", "Asia/Tokyo", "Australia/Sydney", "Pacific/Auckland", "UTC"]

const pad = (n: number) => String(n).padStart(2, "0")

function useNow() {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}

export function useDeviceZone() {
  const [tz, setTz] = useState("UTC")
  useEffect(() => {
    try { setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC") } catch {}
  }, [])
  return [tz, setTz] as const
}

export function dhms(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }
}

const WEEKDAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const MONTH_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function isoWeek(y: number, m: number, d: number) {
  const dt = new Date(Date.UTC(y, m, d))
  const dn = dt.getUTCDay() || 7
  dt.setUTCDate(dt.getUTCDate() + 4 - dn)
  return Math.ceil(((dt.getTime() - Date.UTC(dt.getUTCFullYear(), 0, 1)) / 864e5 + 1) / 7)
}

const labelCls = "font-mono text-[11.5px] uppercase tracking-[.08em] text-subtle"

export function CountdownLive({
  id, year, name, date, years, kicker,
}: {
  id?: string
  year: number
  name: string
  date?: { year: number; month: number; day: number }
  years?: { year: number; href: string }[]
  kicker?: string
}) {
  const h = date ?? getHoliday(id!, year)!
  const now = useNow()
  const [tz, setTz] = useDeviceZone()
  const zones = useMemo(() => (ZONES.includes(tz) ? ZONES : [tz, ...ZONES]), [tz])
  const target = startOfDayIn(h.year, h.month, h.day, tz)
  const prev = id ? getHoliday(id, year - 1) : null
  const prevTs = prev ? startOfDayIn(prev.year, prev.month, prev.day, tz) : target - 365 * 864e5

  const view = now === null ? null : (() => {
    const left = target - now
    const days = calendarDaysUntil(h, now, tz)
    const t = dhms(left)
    const pct = left < 0 ? 100 : Math.min(100, Math.max(0, ((now - prevTs) / (target - prevTs)) * 100))
    const abs = Math.abs(days)
    const working = workingDaysBetween(days, now, tz)
    return { left, days, abs, t, pct, working, weekends: Math.max(0, days - 1 - working) }
  })()

  const wd = WEEKDAY_LONG[new Date(Date.UTC(h.year, h.month, h.day)).getUTCDay()]
  const doy = Math.round((Date.UTC(h.year, h.month, h.day) - Date.UTC(h.year, 0, 0)) / 864e5)
  const leap = (h.year % 4 === 0 && h.year % 100 !== 0) || h.year % 400 === 0
  const past = view !== null && view.left < 0
  const unit = !view ? " " : past ? "days ago" : view.days === 0 ? "today" : view.days === 1 ? "day to go" : "days to go"
  const stat = (label: string, value: React.ReactNode, sub: string) => (
    <div className="min-w-0 bg-surface px-5 py-[18px]">
      <div className={labelCls}>{label}</div>
      <div className="tnum mt-2.5 whitespace-nowrap font-mono text-[28px] font-light leading-none tracking-[-0.04em]">{value}</div>
      <div className="mt-2 text-[12.5px] text-subtle">{sub}</div>
    </div>
  )

  return (
    <>
      <div className="rounded-[18px] border border-line bg-surface p-[clamp(22px,3.4vw,44px)]">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-7">
          <div className="min-w-0">
            <div className={labelCls}>{kicker ?? name}</div>
            <div className="mt-3.5 text-[clamp(26px,3.6vw,44px)] font-medium leading-[1.08] tracking-[-0.035em]">{wd}, {MONTH_LONG[h.month]} {h.day}, {h.year}</div>
            <div className="mt-2.5 text-[15px] text-subtle">Day {doy} of {leap ? 366 : 365} · ISO week {isoWeek(h.year, h.month, h.day)}</div>
            <div className="mt-[22px] flex flex-wrap gap-3">
              {years && (
                <div role="tablist" aria-label="Year" className="inline-flex flex-wrap gap-0.5 rounded-full border border-line bg-surface p-1">
                  {years.map((y) => (
                    <Link key={y.year} href={y.href} role="tab" aria-selected={y.year === year} className={cn("inline-flex h-9 items-center rounded-full px-4 text-sm font-medium", y.year === year ? "bg-ink text-paper" : "text-subtle hover:text-ink")}>{y.year}</Link>
                  ))}
                </div>
              )}
              <div className="relative w-[min(100%,230px)]">
                <select
                  value={tz}
                  onChange={(e) => setTz(e.target.value)}
                  aria-label="Time zone"
                  className="h-[42px] w-full appearance-none rounded-full border border-line2 bg-surface pl-4 pr-10 text-sm text-ink outline-none focus:border-ink"
                >
                  {zones.map((z) => <option key={z} value={z}>{z.split("/").pop()!.replace(/_/g, " ")}</option>)}
                </select>
                <svg aria-hidden="true" className="pointer-events-none absolute right-4 top-[15px]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
              </div>
            </div>
          </div>
          <div className="text-right" suppressHydrationWarning>
            <div className="tnum -mr-[0.03em] whitespace-nowrap font-mono text-[clamp(72px,12vw,160px)] font-light leading-none tracking-[-0.055em]">
              <span className="text-brand">{view ? view.abs : "—"}</span>
            </div>
            <div className={cn(labelCls, "mt-2")}>{unit}</div>
          </div>
        </div>
        <div className={cn(labelCls, "mt-7")}>Exact time left</div>
        <div className="mt-2.5 grid grid-cols-4 gap-px overflow-hidden rounded-[14px] border border-line bg-line" suppressHydrationWarning>
          {(["d", "h", "m", "s"] as const).map((k) => (
            <div key={k} className="min-w-0 bg-surface px-[18px] py-4">
              <div className="tnum font-mono text-[clamp(28px,4vw,46px)] font-light leading-none tracking-[-0.045em]">{view ? (k === "d" ? view.t.d : pad(view.t[k])) : "--"}</div>
              <div className={cn(labelCls, "mt-2")}>{{ d: "Days", h: "Hours", m: "Minutes", s: "Seconds" }[k]}</div>
            </div>
          ))}
        </div>
        <div className="mt-[22px]" suppressHydrationWarning>
          <div className={cn(labelCls, "flex justify-between gap-3")}>
            <span>Since {name} {year - 1}</span>
            <span>{view ? `${Math.round(view.pct)}% of the way` : ""}</span>
          </div>
          <div className="mt-2.5 h-1.5 rounded-[3px] bg-line" role="progressbar" aria-valuenow={view ? Math.round(view.pct) : 0} aria-valuemin={0} aria-valuemax={100} aria-label={`Progress towards ${name} ${year}`}>
            <div className="h-1.5 rounded-[3px] bg-brand" style={{ width: `${view ? view.pct : 0}%` }} />
          </div>
        </div>
      </div>
      <div className="mt-[clamp(24px,3vw,36px)] grid gap-px overflow-hidden rounded-2xl border border-line bg-line" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,190px),1fr))" }} suppressHydrationWarning>
        {stat("Weeks", view ? Math.floor(view.abs / 7) : "—", view ? `and ${view.abs % 7} ${view.abs % 7 === 1 ? "day" : "days"}` : " ")}
        {stat("Working days", view ? (view.days > 0 ? view.working : 0) : "—", "Mon–Fri, before the day")}
        {stat("Weekends", view ? (view.days > 0 ? view.weekends : 0) : "—", "Saturdays and Sundays left")}
        {stat("Hours", view ? Math.max(0, Math.floor(view.left / 36e5)).toLocaleString("en-US") : "—", "Total until midnight")}
      </div>
    </>
  )
}

/** Month grid with the holiday highlighted, days already gone muted and today outlined. */
export function MonthCalendar({ year, month, day, name }: { year: number; month: number; day: number; name: string }) {
  const now = useNow()
  const [tz] = useDeviceZone()
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay()
  const dim = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: dim }, (_, i) => i + 1)]
  const gone = (d: number) => now !== null && calendarDaysUntil({ year, month, day: d }, now, tz) < 0
  const isToday = (d: number) => now !== null && calendarDaysUntil({ year, month, day: d }, now, tz) === 0
  return (
    <div className="min-w-0 rounded-[18px] border border-line bg-surface px-6 py-[22px]">
      <div className="flex items-baseline justify-between">
        <h3 className="m-0 text-lg font-semibold tracking-[-0.02em]">{MONTH_LONG[month]} {year}</h3>
        <span className={labelCls}>Calendar</span>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center" aria-label={`${MONTH_LONG[month]} ${year}, ${name} on the ${day}`}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} className={cn(labelCls, "py-1 !text-[10.5px]")}>{d}</div>)}
        {cells.map((c, i) => (
          <div
            key={i}
            suppressHydrationWarning
            className={cn(
              "tnum flex aspect-square items-center justify-center rounded-[10px] font-mono text-sm",
              c === day ? "bg-brand font-semibold text-btn-ink" : c && isToday(c) ? "bg-paper text-ink" : c && gone(c) ? "text-subtle" : "text-ink",
            )}
          >
            {c ?? ""}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Compact "N days" tag, rendered after mount to avoid hydration mismatches. */
export function DaysAway({ year, month, day, suffix = "days", bare = false }: { year: number; month: number; day: number; suffix?: string; bare?: boolean }) {
  const now = useNow()
  const [tz] = useDeviceZone()
  if (now === null) return <span className="tnum">—</span>
  const n = calendarDaysUntil({ year, month, day }, now, tz)
  if (n < 0) return <span>passed</span>
  if (n === 0) return <span className="text-brand">today</span>
  if (bare) return <span className="tnum">{n}</span>
  return <span className="tnum">{n} {n === 1 ? "day" : suffix}</span>
}
