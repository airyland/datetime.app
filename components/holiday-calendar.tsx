"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { cardClass, monoLabel, Stat, StatGrid } from "@/components/ds"
import { Holiday, SUPPORTED_LANGUAGES } from "@/lib/holidays"
import { allSlugs, countdownSlugFor, parseSlug, slugOf } from "@/lib/countdown"

export const selectClass =
  "h-[46px] w-full appearance-none rounded-full border border-line2 bg-surface pl-3.5 pr-10 text-[15px] text-ink outline-none transition-colors focus:border-ink"

export function SelectField({ id, label, value, onChange, children, className }: { id: string; label: string; value: string; onChange: (v: string) => void; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <select id={id} aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-[15px] top-4 size-3.5" strokeWidth={2} aria-hidden="true" />
    </div>
  )
}

interface HolidayCalendarProps {
  countryCode: string
  countryName: string
  /** Set for region pages; also forwarded to the API. */
  regionCode?: string
  regionName?: string
  initialYear: number
  initialLanguage: string
  initialHolidays: Holiday[]
}

const TYPE_TABS = [
  { key: "all", label: "All" },
  { key: "public", label: "Public" },
  { key: "observance", label: "Observances" },
] as const

const MS_DAY = 86400000

/** Year/language controls + holiday calendar shared by country and region pages. */
export default function HolidayCalendar({ countryCode, countryName, regionCode, regionName, initialYear, initialLanguage, initialHolidays }: HolidayCalendarProps) {
  const [selectedYear, setSelectedYear] = useState<number>(initialYear)
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage)
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [typeTab, setTypeTab] = useState<string>("all")
  const [today, setToday] = useState<Date | null>(null)

  useEffect(() => {
    const d = new Date()
    setToday(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
  }, [])

  const currentYear = new Date().getFullYear()
  // Years for selection (current year +/- 5 years)
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)
  const placeName = regionName ? `${regionName}, ${countryName}` : countryName

  // Load holidays when year or language changes
  useEffect(() => {
    // Only fetch if the selection changes from initial values
    if (selectedYear === initialYear && selectedLanguage === initialLanguage) {
      return
    }

    const fetchHolidays = async () => {
      setLoading(true)
      setError(null)

      try {
        const regionQ = regionCode ? `&region=${regionCode}` : ""
        const response = await fetch(`/api/holidays?country=${countryCode}${regionQ}&year=${selectedYear}&language=${selectedLanguage}`)
        const data = await response.json()

        if (data.holidays && data.holidays.length > 0) {
          setHolidays(data.holidays)
        } else {
          setError("No holiday data available for this selection.")
        }
      } catch (err) {
        console.error("Error fetching holidays:", err)
        setError("Failed to load holiday data.")
      } finally {
        setLoading(false)
      }
    }

    fetchHolidays()
  }, [countryCode, regionCode, selectedYear, selectedLanguage, initialYear, initialLanguage])

  // Group holidays by month for better organization
  const holidaysByMonth: Record<string, Holiday[]> = {}
  holidays.forEach((holiday) => {
    const date = new Date(holiday.start)
    const monthKey = date.toLocaleString("en-US", { month: "long" })
    if (!holidaysByMonth[monthKey]) holidaysByMonth[monthKey] = []
    holidaysByMonth[monthKey].push(holiday)
  })
  const sortedMonths = Object.keys(holidaysByMonth).sort((a, b) => new Date(`${a} 1, 2000`).getMonth() - new Date(`${b} 1, 2000`).getMonth())

  // Next holiday / remaining (only meaningful for the current year, computed after mount)
  const isThisYear = selectedYear === currentYear
  const upcoming = today && isThisYear ? holidays.filter((h) => new Date(h.start) >= today) : []
  const next = upcoming[0]
  // every upcoming holiday gets a countdown: a dedicated page when one exists, else the generic one
  const countdownHref = (h: Holiday) => {
    const day = String(h.date ?? "").slice(0, 10)
    const slug = countdownSlugFor(h.name, new Date(h.start))
    if (slug) return `/countdown/${slug}`
    return `/countdown/h?c=${countryCode}&n=${encodeURIComponent(h.name)}&d=${day}`
  }
  const nextHref = next ? countdownHref(next) : null
  const nextDays = next && today ? Math.round((new Date(new Date(next.start).getFullYear(), new Date(next.start).getMonth(), new Date(next.start).getDate()).getTime() - today.getTime()) / MS_DAY) : null
  const nPublic = holidays.filter((h) => h.type === "public").length
  const nObs = holidays.filter((h) => h.type === "observance").length

  return (
    <div>
      {/* Next holiday hero + stats */}
      {next && nextDays !== null && (
        <div className={cn(cardClass, "flex flex-wrap items-end justify-between gap-x-12 gap-y-7 p-[clamp(22px,3.4vw,44px)]")}>
          <div className="min-w-0">
            <div className={monoLabel}>Next holiday &middot; {next.type}</div>
            <div className="mt-3.5 text-[clamp(30px,4.4vw,56px)] font-medium leading-[1.05] tracking-[-0.035em] [overflow-wrap:anywhere]">{next.name}</div>
            <div className="mt-2.5 text-base text-subtle">
              {new Date(next.start).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            {nextHref && (
              <Link href={nextHref} className="mt-[18px] inline-flex h-[42px] items-center gap-2 rounded-full bg-ink px-[18px] text-sm font-medium text-btn-ink">
                Live countdown <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
          <div className="text-right">
            <div className="tnum -mr-[0.03em] whitespace-nowrap font-mono text-[clamp(72px,12vw,160px)] font-light leading-none tracking-[-0.055em] text-brand">{nextDays === 0 ? "Today" : nextDays}</div>
            <div className={cn("mt-2", monoLabel)}>{nextDays === 1 ? "day to go" : nextDays === 0 ? "enjoy it" : "days to go"}</div>
          </div>
        </div>
      )}

      {holidays.length > 0 && (
        <div className={next ? "mt-5" : ""}>
          <StatGrid min={190}>
            <Stat label={`Holidays in ${selectedYear}`} value={holidays.length} />
            <Stat label="Public" value={nPublic} sub="Days off work" />
            <Stat label="Observances" value={nObs} sub="Widely observed" />
            {today && isThisYear && <Stat label="Remaining" value={upcoming.length} sub="This year" />}
          </StatGrid>
        </div>
      )}

      <h2 className="m-0 mt-[clamp(48px,6vw,72px)] text-[clamp(24px,2.6vw,32px)] font-semibold leading-[1.15] tracking-[-0.025em]">{selectedYear} holiday calendar</h2>

      {/* Controls for type, year and language */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3.5">
        <div role="tablist" aria-label="Holiday type" className="inline-flex flex-wrap gap-0.5 rounded-full border border-line bg-surface p-1">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={typeTab === tab.key}
              onClick={() => setTypeTab(tab.key)}
              className={cn("h-9 rounded-full px-4 text-sm font-medium transition-colors", typeTab === tab.key ? "bg-ink text-btn-ink" : "text-subtle hover:text-ink")}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2.5">
          <label htmlFor="h-year" className="sr-only">Year</label>
          <SelectField id="h-year" label="Select Year" value={selectedYear.toString()} onChange={(v) => setSelectedYear(parseInt(v))} className="w-[130px]">
            {years.map((year) => (
              <option key={year} value={year.toString()}>{year}</option>
            ))}
          </SelectField>
          <label htmlFor="h-lang" className="sr-only">Language</label>
          <SelectField id="h-lang" label="Select Language" value={selectedLanguage} onChange={setSelectedLanguage} className="w-[160px]">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </SelectField>
        </div>
      </div>

      {/* Holidays display */}
      <div className="mt-6">
        {loading ? (
          <div className="py-8 text-center text-subtle">Loading holidays...</div>
        ) : error ? (
          <div className="py-8 text-center text-brand">{error}</div>
        ) : holidays.length === 0 ? (
          <div className="py-8 text-center text-subtle">No holidays found for {placeName} in {selectedYear}.</div>
        ) : (
          <div className="grid items-start gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,480px),1fr))" }}>
            {sortedMonths.map((month) => {
              const items = holidaysByMonth[month]
              const visible = items.filter((h) => typeTab === "all" || h.type === typeTab).length
              return (
                <div key={month} className={cn(cardClass, "cl overflow-hidden", visible === 0 && "hidden")}>
                  <div className="flex items-baseline justify-between gap-3 px-[22px] pb-3.5 pt-[18px]">
                    <h3 className="m-0 text-lg font-semibold tracking-[-0.02em]">{month}</h3>
                    <span className={monoLabel}>{items.length}</span>
                  </div>
                  <div className="cl">
                    {items.map((holiday, index) => {
                      const date = new Date(holiday.start)
                      const isNext = next === holiday
                      const past = today && isThisYear && date < today
                      let href: string | null = past ? null : countdownHref(holiday)
                      // an already-passed holiday with a dedicated page points at its next occurrence
                      const known = countdownSlugFor(holiday.name, date)
                      if (past && known) {
                        const p = parseSlug(known)
                        const nextSlug = p ? slugOf(p.id, p.year + 1) : null
                        href = nextSlug && allSlugs().includes(nextSlug) ? `/countdown/${nextSlug}` : null
                      }
                      const hidden = typeTab !== "all" && holiday.type !== typeTab
                      return (
                        <div
                          key={index}
                          className={cn("flex items-center gap-[18px] border-t border-line px-[22px] py-3.5", isNext && "bg-paper", past && "opacity-60", hidden && "hidden")}
                        >
                          <div className="w-[52px] flex-none text-center">
                            <div className={cn("tnum font-mono text-[26px] font-light leading-none tracking-[-0.04em]", isNext && "text-brand")}>{date.getDate()}</div>
                            <div className="mt-1 font-mono text-[10.5px] uppercase tracking-[.08em] text-subtle">
                              {date.toLocaleDateString("en-US", { weekday: "short" })}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[15.5px] font-medium tracking-[-0.01em]">{holiday.name}</div>
                            <div className="mt-0.5 text-[13px] text-subtle">
                              {date.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}
                            </div>
                            {holiday.note && <div className="mt-1 text-[13px] text-subtle">{holiday.note}</div>}
                            {href && (
                              <Link href={href} className="mt-1.5 inline-block text-[13px] text-brand hover:underline">Countdown →</Link>
                            )}
                          </div>
                          <span
                            className={cn(
                              "flex-none rounded-full border px-2.5 py-[3px] font-mono text-[11px] uppercase tracking-[.06em]",
                              holiday.type === "public" ? "border-brand text-brand" : "border-line2 text-subtle",
                            )}
                          >
                            {holiday.type}
                            {holiday.substitute && " (substitute)"}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
