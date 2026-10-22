"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { calculateAge, getNextBirthday } from "@/lib/age-calculator"
import { cn } from "@/lib/utils"
import { inputClass, monoLabel } from "@/components/ds"
import { format } from "date-fns"
import { useTranslations } from 'next-intl'

const labelClass = "mb-1.5 block text-[12.5px] font-medium text-subtle"
const tabsWrap = "inline-flex flex-wrap gap-0.5 rounded-full border border-line bg-surface p-1"
const toISODate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
const fromISODate = (v: string) => {
  const [y, m, d] = v.split("-").map(Number)
  return y && m && d ? new Date(y, m - 1, d) : undefined
}

function SegTab({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={on}
      onClick={onClick}
      className={cn("h-9 rounded-full px-4 text-sm font-medium transition-colors", on ? "bg-ink text-btn-ink" : "bg-transparent text-subtle hover:text-ink")}
    >
      {children}
    </button>
  )
}

interface AgeCalculatorClientProps {
  initialBirthDate?: Date
}

export default function AgeCalculatorClient({ initialBirthDate }: AgeCalculatorClientProps) {
  const t = useTranslations('ageCalculator')
  
  // Input method state
  const [inputMethod, setInputMethod] = useState<'calendar' | 'manual'>('calendar')

  // Birth date states
  const [birthDate, setBirthDate] = useState<Date | undefined>(initialBirthDate || undefined)
  const [birthYear, setBirthYear] = useState<string>("")
  const [birthMonth, setBirthMonth] = useState<string>("")
  const [birthDay, setBirthDay] = useState<string>("")

  // Target date states
  const [useCustomTargetDate, setUseCustomTargetDate] = useState(false)
  const [targetDate, setTargetDate] = useState<Date>(new Date())
  const [targetYear, setTargetYear] = useState<string>(new Date().getFullYear().toString())
  const [targetMonth, setTargetMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0'))
  const [targetDay, setTargetDay] = useState<string>(new Date().getDate().toString().padStart(2, '0'))

  // Result states
  const [age, setAge] = useState<ReturnType<typeof calculateAge> | null>(null)
  const [nextBirthday, setNextBirthday] = useState<ReturnType<typeof getNextBirthday> | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [error, setError] = useState<string | null>(null)
  const [resultTab, setResultTab] = useState<'standard' | 'detailed' | 'decimal'>('standard')
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Handle manual birth date input
  const handleManualBirthDateSubmit = () => {
    setError(null)

    try {
      // Validate inputs
      const year = parseInt(birthYear)
      const month = parseInt(birthMonth) - 1 // JavaScript months are 0-indexed
      const day = parseInt(birthDay)

      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error(t('errors.validNumbers'))
      }

      if (year < 1900 || year > new Date().getFullYear()) {
        throw new Error(t('errors.yearRange'))
      }

      if (month < 0 || month > 11) {
        throw new Error(t('errors.monthRange'))
      }

      if (day < 1 || day > 31) {
        throw new Error(t('errors.dayRange'))
      }

      const date = new Date(year, month, day)

      // Check if the date is valid (e.g., not February 30)
      if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
        throw new Error(t('errors.invalidDate'))
      }

      // Check if the date is in the future
      if (date > new Date()) {
        throw new Error(t('errors.futureDate'))
      }

      setBirthDate(date)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(t('errors.unknownError'))
      }
    }
  }

  // Handle manual target date input
  const handleManualTargetDateSubmit = () => {
    setError(null)

    try {
      // Validate inputs
      const year = parseInt(targetYear)
      const month = parseInt(targetMonth) - 1 // JavaScript months are 0-indexed
      const day = parseInt(targetDay)

      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error(t('errors.validNumbers'))
      }

      if (month < 0 || month > 11) {
        throw new Error(t('errors.monthRange'))
      }

      if (day < 1 || day > 31) {
        throw new Error(t('errors.dayRange'))
      }

      const date = new Date(year, month, day)

      // Check if the date is valid (e.g., not February 30)
      if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
        throw new Error(t('errors.invalidDate'))
      }

      setTargetDate(date)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(t('errors.unknownError'))
      }
    }
  }

  // Update age calculation when birth date or target date changes
  useEffect(() => {
    if (birthDate) {
      try {
        const calculatedAge = calculateAge(birthDate, useCustomTargetDate ? targetDate : currentTime)
        setAge(calculatedAge)

        const nextBday = getNextBirthday(birthDate)
        setNextBirthday(nextBday)
      } catch (error) {
        console.error("Error calculating age:", error)
        setAge(null)
        setNextBirthday(null)
      }
    } else {
      setAge(null)
      setNextBirthday(null)
    }
  }, [birthDate, currentTime, targetDate, useCustomTargetDate])

  // Update current time every second for real-time age (only when not using custom target date)
  useEffect(() => {
    if (!birthDate || useCustomTargetDate) return

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [birthDate, useCustomTargetDate])

  const todayISO = toISODate(new Date())
  const dec = age ? String(age.decimalAge).split(".") : ["", ""]
  const unit = "ml-[.1em] text-[.3em] text-subtle"
  const bigNum = "tnum mt-2.5 flex flex-wrap items-baseline gap-x-[22px] gap-y-1 whitespace-nowrap font-mono font-light leading-none tracking-[-0.055em] -ml-[0.04em]"

  return (
    <div className="flex flex-wrap gap-x-14 gap-y-8">
      <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-[22px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold tracking-[-0.02em]">{t('calculateYourAge')}</h2>
          <div role="tablist" aria-label={t('enterBirthDate')} className={tabsWrap}>
            <SegTab on={inputMethod === 'calendar'} onClick={() => setInputMethod('calendar')}>{t('inputMethods.calendar')}</SegTab>
            <SegTab on={inputMethod === 'manual'} onClick={() => setInputMethod('manual')}>{t('inputMethods.manual')}</SegTab>
          </div>
        </div>

        <div>
          <h3 className={cn("m-0 mb-3 font-normal", monoLabel)}>{t('enterBirthDate')}</h3>
          {inputMethod === 'calendar' ? (
            <div className="min-w-0">
              <label htmlFor="birth-date" className={labelClass}>{t('inputMethods.calendar')}</label>
              <input
                id="birth-date"
                type="date"
                max={todayISO}
                min="1900-01-01"
                value={birthDate ? toISODate(birthDate) : ""}
                onChange={(e) => setBirthDate(e.target.value ? fromISODate(e.target.value) : undefined)}
                className={cn(inputClass, "h-[46px] rounded-[10px] bg-paper font-mono text-sm")}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {([
                  ["birth-year", t('labels.year'), "YYYY", birthYear, setBirthYear, undefined, undefined, "flex-[1_1_90px]"],
                  ["birth-month", t('labels.month'), "MM", birthMonth, setBirthMonth, 1, 12, "flex-[1_1_70px]"],
                  ["birth-day", t('labels.day'), "DD", birthDay, setBirthDay, 1, 31, "flex-[1_1_70px]"],
                ] as const).map(([id, label, ph, val, set, min, max, flex]) => (
                  <div key={id} className={cn("min-w-0", flex)}>
                    <label htmlFor={id} className={labelClass}>{label}</label>
                    <input
                      id={id}
                      type="number"
                      inputMode="numeric"
                      placeholder={ph}
                      min={min}
                      max={max}
                      value={val}
                      onChange={(e) => set(e.target.value)}
                      className={cn(inputClass, "h-[46px] rounded-[10px] bg-paper font-mono text-sm")}
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleManualBirthDateSubmit}
                className="h-11 w-full rounded-full bg-ink px-5 text-sm font-medium text-btn-ink transition-opacity hover:opacity-90"
              >
                {t('labels.calculateAge')}
              </button>
              {birthDate && (
                <div className="text-sm text-subtle">{t('labels.selectedDate')}: {birthDate.toLocaleDateString()}</div>
              )}
            </div>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-[14.5px]">
          <input
            id="custom-date"
            type="checkbox"
            checked={useCustomTargetDate}
            onChange={(e) => setUseCustomTargetDate(e.target.checked)}
            className="size-[18px] accent-[var(--accent)]"
          />
          {t('labels.useCustomDate')}
        </label>

        {useCustomTargetDate && (
          <div>
            <h3 className={cn("m-0 mb-3 font-normal", monoLabel)}>{t('calculateAgeAsOf')}</h3>
            <label htmlFor="target-date" className={labelClass}>{t('labels.targetDate')}</label>
            <input
              id="target-date"
              type="date"
              value={toISODate(targetDate)}
              onChange={(e) => {
                const d = e.target.value ? fromISODate(e.target.value) : undefined
                if (d) {
                  setError(null)
                  setTargetDate(d)
                  setTargetYear(String(d.getFullYear()))
                  setTargetMonth(String(d.getMonth() + 1).padStart(2, "0"))
                  setTargetDay(String(d.getDate()).padStart(2, "0"))
                }
              }}
              className={cn(inputClass, "h-[46px] rounded-[10px] bg-paper font-mono text-sm")}
            />
          </div>
        )}

        {error && (
          <div role="alert" className="rounded-[10px] border border-brand px-3.5 py-3 text-sm text-brand">{error}</div>
        )}

        {!useCustomTargetDate && (
          <div className="flex flex-wrap items-center gap-2.5 text-[13px] text-subtle">
            <span className="relative inline-block size-[7px] rounded-full bg-brand" aria-hidden="true" />
            <span>{t('labels.updatesInRealTime')}</span>
            <span className="tnum font-mono" suppressHydrationWarning>&middot; {mounted ? format(currentTime, "yyyy-MM-dd HH:mm:ss") : ""}</span>
          </div>
        )}
      </div>

      <div aria-hidden="true" className="hidden w-px bg-line min-[1000px]:block" />

      <div className="flex min-w-0 flex-[1.15_1_420px] flex-col gap-[22px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold tracking-[-0.02em]">{t('ageResults')}</h2>
          <div role="tablist" aria-label={t('ageResults')} className={tabsWrap}>
            <SegTab on={resultTab === 'standard'} onClick={() => setResultTab('standard')}>{t('tabs.standard')}</SegTab>
            <SegTab on={resultTab === 'detailed'} onClick={() => setResultTab('detailed')}>{t('tabs.detailed')}</SegTab>
            <SegTab on={resultTab === 'decimal'} onClick={() => setResultTab('decimal')}>{t('tabs.decimal')}</SegTab>
          </div>
        </div>

        {birthDate && age ? (
          <>
            <div>
              <div className={monoLabel}>
                {useCustomTargetDate ? `As of ${targetDate.toLocaleDateString()}` : "Updates in real-time"}
              </div>

              {resultTab === 'standard' && (
                <>
                  <div className={cn(bigNum, "text-[clamp(52px,8vw,108px)]")}>
                    <span>{age.years}<span className={unit}>y</span></span>
                    <span>{age.months}<span className={unit}>m</span></span>
                    <span className="text-brand">{age.days}<span className={unit}>d</span></span>
                  </div>
                  <p className="m-0 mt-3 text-sm text-subtle">Age: {age.formatted.ymd}</p>
                </>
              )}

              {resultTab === 'decimal' && (
                <>
                  <div className={cn(bigNum, "text-[clamp(40px,6vw,84px)]")}>
                    <span>{dec[0]}</span>
                    {dec[1] !== undefined && <span className="text-brand">.{dec[1]}</span>}
                  </div>
                  <div className="mt-2.5 text-sm text-subtle">{t('labels.yearsInDecimalFormat')}</div>
                </>
              )}

              {resultTab === 'detailed' && (
                <div className="mt-3">
                  <div
                    className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line"
                    style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,150px),1fr))" }}
                  >
                    {[
                      [t('labels.years'), age.years],
                      [t('labels.months'), age.totalMonths],
                      [t('labels.days'), age.totalDays],
                      [t('labels.hours'), age.totalDays * 24 + age.hours],
                    ].map(([l, v]) => (
                      <div key={String(l)} className="min-w-0 bg-surface px-[18px] py-4">
                        <div className="text-[12.5px] text-subtle">{l}</div>
                        <div className="tnum mt-1.5 font-mono text-[22px] font-light tracking-[-0.03em]">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {!useCustomTargetDate && nextBirthday && (
              <div className="border-t border-line pt-5">
                <div className={monoLabel}>{t('labels.nextBirthday')}</div>
                <p className="m-0 mt-2 text-[17px] leading-normal tracking-[-0.01em]">
                  You will be <span className="font-semibold">{nextBirthday.nextAge}</span> in{" "}
                  <span className="font-semibold">{nextBirthday.daysUntil}</span> days
                  ({nextBirthday.date.toLocaleDateString()})
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center text-[15px] text-subtle">{t('enterBirthDate')}</div>
        )}
      </div>
    </div>
  )
}
