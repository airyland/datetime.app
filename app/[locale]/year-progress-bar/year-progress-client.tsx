"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { calculateYearProgress, calculateTimeLeftData, formatTimeLeft } from "@/lib/year-progress"
import { useLocale, useTranslations } from "next-intl"

interface YearProgressClientProps {
  initialProgress: number
  initialTimeLeft: string
  currentYear: number
  /** tick every second (current year only) */
  live?: boolean
}

export default function YearProgressClient({
  initialProgress,
  initialTimeLeft,
  currentYear,
  live = true,
}: YearProgressClientProps) {
  const [progress, setProgress] = useState(initialProgress)
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft)

  const t = useTranslations('yearProgress')
  const locale = useLocale()
  
  // Create translation function for formatTimeLeft
  const timeTranslationFunction = (key: string, params?: any) => {
    const count = params?.count || 0
    switch (key) {
      case 'yearCompleted':
        return t('yearCompleted')
      case 'yearNotStarted':
        return t('yearNotStarted')
      case 'timeLeftMonths':
        return t('timeLeftMonths', { count })
      case 'timeLeftDays':
        return t('timeLeftDays', { count })
      case 'timeLeftHours':
        return t('timeLeftHours', { count })
      case 'timeLeftMinutes':
        return t('timeLeftMinutes', { count })
      case 'timeLeftSeconds':
        return t('timeLeftSeconds', { count })
      case 'left':
        return t('left')
      default:
        return key
    }
  }

  // Update time every second
  useEffect(() => {
    if (!live) return
    const timer = setInterval(() => {
      const now = new Date()
      setProgress(calculateYearProgress(now, currentYear))
      const timeData = calculateTimeLeftData(now, currentYear)
      setTimeLeft(formatTimeLeft(timeData, timeTranslationFunction))
    }, 1000)

    return () => clearInterval(timer)
  }, [currentYear, t, live])

  const isLeap = (currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0
  const totalDays = isLeap ? 366 : 365
  const elapsedDays = (progress / 100) * totalDays
  const fmt = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" })
  let offset = 0
  const months = Array.from({ length: 12 }, (_, m) => {
    const len = new Date(Date.UTC(currentYear, m + 1, 0)).getUTCDate()
    const fill = Math.max(0, Math.min(100, ((elapsedDays - offset) / len) * 100))
    offset += len
    return { name: fmt.format(new Date(Date.UTC(currentYear, m, 1))), fill, active: fill > 0 }
  })
  const [pctInt, pctDec] = progress.toFixed(2).split(".")

  return (
    <div>
      <div
        className="tnum mt-3 flex items-baseline whitespace-nowrap font-mono font-light leading-none tracking-[-0.055em] text-[clamp(76px,17vw,240px)] -ml-[0.045em]"
        aria-label={`${progress.toFixed(2)}%`}
      >
        <span>{pctInt}</span>
        <span className="text-brand">.{pctDec}</span>
        <span className="ml-[.08em] text-[.34em] text-subtle">%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label={t("progressTitle")}
        className="relative mt-[clamp(20px,3vw,36px)]"
      >
        <div className="grid grid-cols-12 gap-1">
          {months.map((m, i) => (
            <div key={i} title={m.name} className="relative h-[18px] overflow-hidden rounded bg-line">
              <div className="absolute inset-y-0 left-0 bg-ink" style={{ width: `${m.fill}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-12 gap-1">
          {months.map((m, i) => (
            <div key={i} className={`overflow-hidden font-mono text-[10.5px] tracking-[.04em] ${m.active ? "text-ink" : "text-subtle"}`}>
              <span className="hidden sm:inline">{m.name}</span>
              <span className="sm:hidden">{m.name.slice(0, 1)}</span>
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="absolute -top-1.5 h-[30px] w-0.5 -ml-px rounded-[1px] bg-brand" style={{ left: `${progress}%` }} />
      </div>
      <div className="mt-5 flex items-center gap-2 text-subtle">
        <Clock className="size-4 shrink-0" aria-hidden="true" />
        <span>{timeLeft}</span>
      </div>
    </div>
  )
}
