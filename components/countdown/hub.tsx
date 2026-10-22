"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { calendarDaysUntil, dateLabel, holidaysOf, longName, slugOf, startOfDayIn, weekdayOf } from "@/lib/countdown"
import { dhms, useDeviceZone } from "./live"

function useTick() {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}

const pad = (n: number) => String(n).padStart(2, "0")
const label = "font-mono text-[11.5px] uppercase tracking-[.08em] text-subtle"
const dateStr = (h: ReturnType<typeof holidaysOf>[number]) => `${weekdayOf(h)}, ${dateLabel(h)}`

export function CountdownHub({ baseYear }: { baseYear: number }) {
  const now = useTick()
  const [tz] = useDeviceZone()
  const [tab, setTab] = useState<"soon" | "all">("soon")

  const all = [...holidaysOf(baseYear), ...holidaysOf(baseYear + 1)]
  const withDays = now === null ? [] : all.map((h) => ({ h, days: calendarDaysUntil(h, now, tz) })).filter((x) => x.days >= 0).sort((a, b) => a.days - b.days)
  const next = withDays[0]
  const year = next?.h.year ?? baseYear
  const shown = (tab === "all" ? withDays.filter((x) => x.h.year === year) : withDays.filter((x) => x.days <= 90))
  const left = next && now !== null ? dhms(startOfDayIn(next.h.year, next.h.month, next.h.day, tz) - now) : null

  return (
    <>
      <section className="mx-auto w-full max-w-[1200px] px-[clamp(16px,4vw,40px)]" style={{ paddingTop: "clamp(8px,2vw,24px)" }}>
        <div className="rounded-[18px] border border-line bg-surface p-[clamp(22px,3.4vw,44px)]" suppressHydrationWarning>
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-7">
            <div className="min-w-0">
              <div className={label}>Next up{next ? ` · ${next.h.tag}` : ""}</div>
              <div className="mt-3.5 text-[clamp(30px,4.4vw,56px)] font-medium leading-[1.05] tracking-[-0.035em]">{next ? `${longName(next.h.id, next.h.name)} ${next.h.year}` : "—"}</div>
              <div className="mt-2.5 text-base text-subtle">{next ? dateStr(next.h) : " "}</div>
              {next && (
                <Link href={`/countdown/${slugOf(next.h.id, next.h.year)}`} className="mt-5 inline-flex h-[42px] items-center gap-2 rounded-full bg-ink px-[18px] text-sm font-medium text-btn-ink">
                  Open countdown <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
            <div className="text-right">
              <div className="tnum -mr-[0.03em] whitespace-nowrap font-mono text-[clamp(72px,12vw,160px)] font-light leading-none tracking-[-0.055em]"><span className="text-brand">{next ? next.days : "—"}</span></div>
              <div className={cn(label, "mt-2")}>days to go</div>
            </div>
          </div>
          <div className="mt-7 grid grid-cols-4 gap-px overflow-hidden rounded-[14px] border border-line bg-line">
            {(["d", "h", "m", "s"] as const).map((k) => (
              <div key={k} className="min-w-0 bg-surface px-[18px] py-4">
                <div className="tnum font-mono text-[clamp(28px,4vw,46px)] font-light leading-none tracking-[-0.045em]">{left ? (k === "d" ? left.d : pad(left[k])) : "--"}</div>
                <div className={cn(label, "mt-2")}>{{ d: "Days", h: "Hours", m: "Minutes", s: "Seconds" }[k]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-[clamp(16px,4vw,40px)]" style={{ paddingTop: "clamp(48px,6vw,72px)" }}>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-3.5">
          <div>
            <h2 className="m-0 text-[clamp(24px,2.6vw,32px)] font-semibold leading-[1.15] tracking-[-0.025em]">{year} countdowns</h2>
            <p className="m-0 mt-2 text-[15px] text-subtle">Dates follow the Gregorian calendar; moving feasts are calculated for each year.</p>
          </div>
          <div role="tablist" aria-label="Filter" className="inline-flex flex-wrap gap-0.5 rounded-full border border-line bg-surface p-1">
            {([["soon", "Next 90 days"], ["all", `All of ${year}`]] as const).map(([k, text]) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn("h-9 rounded-full px-4 text-sm font-medium", tab === k ? "bg-ink text-paper" : "text-subtle")}>{text}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,260px),1fr))" }} suppressHydrationWarning>
          {shown.map(({ h, days }) => {
            const isNext = next?.h === h
            return (
              <Link key={slugOf(h.id, h.year)} href={`/countdown/${slugOf(h.id, h.year)}`} className="flex min-h-[200px] flex-col justify-between rounded-[18px] border border-line bg-surface p-[22px] text-ink transition-colors hover:border-ink">
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold tracking-[-0.02em]">{longName(h.id, h.name)} {h.year}</div>
                    <div className="mt-1 text-[13.5px] text-subtle">{dateStr(h)}</div>
                  </div>
                  <span className="flex-none self-start rounded-full border border-line2 px-2.5 py-[3px] font-mono text-[10.5px] uppercase tracking-[.08em] text-subtle">{h.tag}</span>
                </div>
                <div>
                  <div className={cn("tnum font-mono text-[56px] font-light leading-none tracking-[-0.05em]", isNext && "text-brand")}>{days}</div>
                  <div className={cn(label, "mt-1.5")}>{days === 1 ? "day to go" : days === 0 ? "today" : "days to go"}</div>
                  <div className="mt-3.5 h-[3px] rounded-sm bg-line"><div className={cn("h-[3px] rounded-sm", isNext ? "bg-brand" : "bg-ink")} style={{ width: `${Math.max(2, Math.round(100 - Math.min(100, (days / 365) * 100)))}%` }} /></div>
                </div>
              </Link>
            )
          })}
          {now !== null && shown.length === 0 && <p className="m-0 text-sm text-subtle">No holidays in this range.</p>}
        </div>
      </section>
    </>
  )
}
