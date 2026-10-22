import Link from "next/link"
import type { ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { cardClass, monoLabel } from "@/components/ds"
import type { CalendarDay, CalendarMonth } from "@/lib/calendar"

/** Round icon-only prev/next link used above calendar grids. */
export function CalNavLink({ href, title, dir }: { href: string; title: string; dir: "prev" | "next" }) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight
  return (
    <Link
      href={href}
      title={title}
      aria-label={title}
      className="inline-flex size-11 items-center justify-center rounded-full border border-line2 bg-surface transition-colors hover:border-ink"
    >
      <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
    </Link>
  )
}

export function CalPillLink({ href, title, children }: { href: string; title?: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      title={title}
      className="inline-flex h-11 items-center rounded-full border border-line2 bg-surface px-[18px] text-sm font-medium transition-colors hover:border-ink"
    >
      {children}
    </Link>
  )
}

function dayCls(day: CalendarDay, selected: boolean) {
  return cn(
    "inline-flex h-[30px] min-w-[30px] items-center justify-center rounded-full text-[12.5px] transition-colors",
    day.isToday
      ? "bg-brand font-medium text-btn-ink"
      : day.isOtherMonth
        ? "text-subtle opacity-40 hover:bg-paper"
        : "text-ink hover:bg-paper",
    selected && !day.isToday && "ring-2 ring-ink ring-offset-1 ring-offset-surface",
  )
}

/** Compact month card with ISO week-number column (Sunday-first grid, 6 rows). */
export function MonthMini({
  month,
  year,
  weekdayShort,
  monthHref,
  monthTitle,
  daysLabel,
  isCurrent,
  selectedDate,
  onSelect,
}: {
  month: CalendarMonth
  year: number
  weekdayShort: string[]
  monthHref: string
  monthTitle: string
  daysLabel: string
  isCurrent?: boolean
  selectedDate: Date | null
  onSelect: (d: Date) => void
}) {
  return (
    <div className={cn(cardClass, "px-5 pb-[18px] pt-5", isCurrent && "border-brand")}>
      <div className="mb-3.5 flex items-baseline justify-between gap-3">
        <h3 className={cn("m-0 text-lg font-semibold tracking-[-0.02em]", isCurrent && "text-brand")}>
          <Link href={monthHref} title={monthTitle} className="transition-colors hover:text-brand">
            {month.name}
          </Link>
        </h3>
        <span className={monoLabel}>{daysLabel}</span>
      </div>
      <div className="tnum grid grid-cols-[30px_repeat(7,minmax(0,1fr))] gap-y-0.5 text-center font-mono text-[12.5px]">
        <div className="flex h-6 items-center justify-center text-[10px] text-subtle">WK</div>
        {weekdayShort.map((w, i) => (
          <div key={i} className="flex h-6 items-center justify-center text-[10.5px] tracking-[.04em] text-subtle">{w}</div>
        ))}
        {Array.from({ length: 6 }, (_, wi) => {
          const row = month.days.slice(wi * 7, wi * 7 + 7)
          if (row.length === 0) return null
          return (
            <div key={wi} className="contents">
              <div className="flex h-[34px] items-center justify-center text-[10.5px] text-subtle opacity-70">{(row[1] ?? row[0]).weekNumber}</div>
              {row.map((day, di) => (
                <div key={di} className="flex h-[34px] items-center justify-center">
                  <button
                    type="button"
                    onClick={() => onSelect(day.fullDate)}
                    className={dayCls(day, selectedDate?.getTime() === day.fullDate.getTime())}
                  >
                    {day.date}
                  </button>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function SelectedDateCard({ title, rows }: { title: ReactNode; rows: { label: ReactNode; value: ReactNode }[] }) {
  return (
    <div className={cn(cardClass, "mx-auto mt-5 max-w-md px-6 py-5")}>
      <h2 className={cn("m-0 font-normal", monoLabel)}>{title}</h2>
      <dl className="m-0 mt-3 space-y-2 text-sm">
        {rows.map((r, i) => (
          <div key={i} className="flex flex-wrap gap-x-2">
            <dt className="font-medium">{r.label}:</dt>
            <dd className="m-0 text-subtle">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
