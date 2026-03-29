"use client"

import { useState, useEffect, useCallback } from "react"
import { JetBrains_Mono } from "next/font/google"
import { Clock, Copy, Check, ArrowRightLeft, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations, useLocale } from "next-intl"

// Load JetBrains Mono for timestamp numbers
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

function useClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), resetDelay)
    })
  }, [resetDelay])

  return { copied, copy }
}

function CopyButton({
  text,
  label,
  copiedLabel,
}: {
  text: string
  label: string
  copiedLabel: string
}) {
  const { copied, copy } = useClipboard()

  return (
    <button
      onClick={() => copy(text)}
      aria-label={copied ? copiedLabel : label}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-secondary hover:bg-secondary/80 transition-colors"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  )
}

type TFunction = ReturnType<typeof useTranslations<"unixTimestamp">>

function getRelativeTime(ts: number, t: TFunction): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = now - ts
  const abs = Math.abs(diff)
  const future = diff < 0

  if (abs < 60) {
    return future ? t("relativeSecondsIn", { count: abs }) : t("relativeSeconds", { count: abs })
  }
  if (abs < 3600) {
    const m = Math.floor(abs / 60)
    if (future) {
      return m === 1 ? t("relativeMinutesIn", { count: m }) : t("relativeMinutesPluralIn", { count: m })
    }
    return m === 1 ? t("relativeMinutes", { count: m }) : t("relativeMinutesPlural", { count: m })
  }
  if (abs < 86400) {
    const h = Math.floor(abs / 3600)
    if (future) {
      return h === 1 ? t("relativeHoursIn", { count: h }) : t("relativeHoursPluralIn", { count: h })
    }
    return h === 1 ? t("relativeHours", { count: h }) : t("relativeHoursPlural", { count: h })
  }
  if (abs < 86400 * 30) {
    const d = Math.floor(abs / 86400)
    if (future) {
      return d === 1 ? t("relativeDaysIn", { count: d }) : t("relativeDaysPluralIn", { count: d })
    }
    return d === 1 ? t("relativeDays", { count: d }) : t("relativeDaysPlural", { count: d })
  }
  if (abs < 86400 * 365) {
    const mo = Math.floor(abs / (86400 * 30))
    if (future) {
      return mo === 1 ? t("relativeMonthsIn", { count: mo }) : t("relativeMonthsPluralIn", { count: mo })
    }
    return mo === 1 ? t("relativeMonths", { count: mo }) : t("relativeMonthsPlural", { count: mo })
  }
  const y = Math.floor(abs / (86400 * 365))
  if (future) {
    return y === 1 ? t("relativeYearsIn", { count: y }) : t("relativeYearsPluralIn", { count: y })
  }
  return y === 1 ? t("relativeYears", { count: y }) : t("relativeYearsPlural", { count: y })
}

function formatDate(date: Date, format: "local" | "utc" | "iso", locale: string): string {
  if (format === "iso") return date.toISOString()
  if (format === "utc") return date.toUTCString()
  return date.toLocaleString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  })
}

export default function UnixTimestampClient() {
  const t = useTranslations("unixTimestamp")
  const locale = useLocale()

  const REFERENCE_TIMESTAMPS = [
    { label: t("refEpoch"), ts: 0 },
    { label: t("refY2K"), ts: 946684800 },
    { label: t("refY2K38"), ts: 2147483647 },
    { label: t("refStartOf2025"), ts: 1735689600 },
    { label: t("refStartOf2026"), ts: 1767225600 },
  ]

  const [currentTs, setCurrentTs] = useState<number>(() => Math.floor(Date.now() / 1000))

  // Timestamp-to-date state
  const [tsInput, setTsInput] = useState<string>("")
  const [tsResult, setTsResult] = useState<Date | null>(null)
  const [tsError, setTsError] = useState<string>("")

  // Date-to-timestamp state
  // Default: local datetime string for <input type="datetime-local">
  const [dateInput, setDateInput] = useState<string>(() => {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, "0")
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
  })
  const [dateResult, setDateResult] = useState<number | null>(null)

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setCurrentTs(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(id)
  }, [])

  // Derive date-to-timestamp result whenever dateInput changes
  useEffect(() => {
    if (!dateInput) {
      setDateResult(null)
      return
    }
    const d = new Date(dateInput)
    if (isNaN(d.getTime())) {
      setDateResult(null)
    } else {
      setDateResult(Math.floor(d.getTime() / 1000))
    }
  }, [dateInput])

  function handleTsInput(value: string) {
    setTsInput(value)
    setTsError("")
    if (!value.trim()) {
      setTsResult(null)
      return
    }
    const num = Number(value.trim())
    if (!Number.isFinite(num)) {
      setTsError(t("invalidInteger"))
      setTsResult(null)
      return
    }
    // Heuristic: if value looks like milliseconds (> year 3000 in seconds), auto-divide
    const ts = num > 9999999999 ? Math.floor(num / 1000) : Math.floor(num)
    const d = new Date(ts * 1000)
    if (d.getFullYear() < 1970 || d.getFullYear() > 9999) {
      setTsError(t("outOfRange"))
      setTsResult(null)
      return
    }
    setTsResult(d)
  }

  function loadReference(ts: number) {
    setTsInput(String(ts))
    handleTsInput(String(ts))
  }

  const resultRows = tsResult
    ? [
        { label: t("localTime"), value: formatDate(tsResult, "local", locale) },
        { label: t("utcTime"), value: formatDate(tsResult, "utc", locale) },
        { label: t("iso8601"), value: formatDate(tsResult, "iso", locale) },
        { label: t("relative"), value: getRelativeTime(Math.floor(tsResult.getTime() / 1000), t) },
      ]
    : []

  return (
    <div className="space-y-6">

      {/* ── Current Unix Timestamp ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" aria-hidden="true" />
            {t("currentTimestamp")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p
              className={`text-4xl md:text-5xl font-bold tabular-nums tracking-tight ${jetbrainsMono.className}`}
              aria-live="polite"
              aria-label={`${t("currentTimestamp")}: ${currentTs}`}
            >
              {currentTs.toLocaleString(locale, { useGrouping: false })}
            </p>
            <CopyButton
              text={String(currentTs)}
              label={t("copyTimestamp")}
              copiedLabel={t("copied")}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("secondsElapsed")}
          </p>
        </CardContent>
      </Card>

      {/* ── Timestamp to Date ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ArrowRightLeft className="h-5 w-5" aria-hidden="true" />
            {t("timestampToDate")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="ts-input" className="block text-sm font-medium mb-1">
              {t("timestampInputLabel")}
            </label>
            <input
              id="ts-input"
              type="text"
              inputMode="numeric"
              placeholder={t("timestampPlaceholder")}
              value={tsInput}
              onChange={(e) => handleTsInput(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
              aria-describedby={tsError ? "ts-input-error" : undefined}
            />
            {tsError && (
              <p id="ts-input-error" className="mt-1 text-sm text-red-500" role="alert">
                {tsError}
              </p>
            )}
          </div>

          {tsResult && (
            <div className="space-y-2 border rounded-lg p-4 bg-secondary/30">
              {resultRows.map(({ label, value }) => (
                <div key={label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-sm font-medium text-muted-foreground w-24 shrink-0">{label}</span>
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className={`text-sm break-all ${label === t("iso8601") ? jetbrainsMono.className : ""}`}>
                      {value}
                    </span>
                    <CopyButton
                      text={value}
                      label={`${t("copy")} ${label}`}
                      copiedLabel={t("copied")}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Date to Timestamp ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" aria-hidden="true" />
            {t("dateToTimestamp")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="date-input" className="block text-sm font-medium mb-1">
              {t("selectDateTime")}
            </label>
            <input
              id="date-input"
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {dateResult !== null && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 border rounded-lg p-4 bg-secondary/30">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{t("unixTimestampLabel")}</p>
                <p className={`text-3xl font-bold tabular-nums ${jetbrainsMono.className}`}>
                  {dateResult}
                </p>
              </div>
              <CopyButton
                text={String(dateResult)}
                label={t("copyTimestamp")}
                copiedLabel={t("copied")}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Common Reference Timestamps ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" aria-hidden="true" />
            {t("referenceTimestamps")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {t("referenceHint")}
          </p>
          <div className="divide-y divide-border rounded-lg border overflow-hidden">
            {REFERENCE_TIMESTAMPS.map(({ label, ts }) => (
              <div
                key={ts}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 hover:bg-secondary/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm font-medium">{label}</span>
                  <span className={`text-sm text-muted-foreground tabular-nums ${jetbrainsMono.className}`}>
                    {ts}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadReference(ts)}
                    className="text-xs px-2.5 py-1 rounded bg-secondary hover:bg-secondary/80 transition-colors"
                    aria-label={`${t("convert")} ${label}`}
                  >
                    {t("convert")}
                  </button>
                  <CopyButton
                    text={String(ts)}
                    label={t("copy")}
                    copiedLabel={t("copied")}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
