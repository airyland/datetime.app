'use client'

import { use, useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Globe, ArrowLeftRight, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { JetBrains_Mono } from 'next/font/google'
import HeaderClient from '../../year-progress-bar/header-client'
import { citiesData } from '@/app/[locale]/cities/[city]/metadata'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'


const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], display: 'swap' })

// Work hour range considered "business hours"
const WORK_START = 9
const WORK_END = 18

const getTimezoneOffset = (timezone: string): number => {
  const now = new Date()
  const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }))
  const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
  return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60)
}

function formatTime(date: Date, timezone: string, locale: string): string {
  return date.toLocaleTimeString(locale, {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

function formatDate(date: Date, timezone: string, locale: string): string {
  return date.toLocaleDateString(locale, {
    timeZone: timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getCurrentHour(date: Date, timezone: string): number {
  return parseInt(
    date.toLocaleString('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    }),
    10
  )
}

function isWorkHour(hour: number): boolean {
  return hour >= WORK_START && hour < WORK_END
}

/** Returns the UTC hours where both timezones are in work hours */
function getOverlapHours(
  tzAOffset: number,
  tzBOffset: number
): { label: string; overlap: boolean }[] {
  const hours: { label: string; overlap: boolean }[] = []
  for (let utcH = 0; utcH < 24; utcH++) {
    const hA = ((utcH + tzAOffset) % 24 + 24) % 24
    const hB = ((utcH + tzBOffset) % 24 + 24) % 24
    hours.push({
      label: `${String(utcH).padStart(2, '0')}:00 UTC`,
      overlap: isWorkHour(hA) && isWorkHour(hB),
    })
  }
  return hours
}

function formatOffsetLabel(offset: number): string {
  const sign = offset >= 0 ? '+' : '-'
  const abs = Math.abs(offset)
  const h = Math.floor(abs)
  const m = Math.round((abs - h) * 60)
  return m === 0 ? `UTC${sign}${h}` : `UTC${sign}${h}:${String(m).padStart(2, '0')}`
}

// ---------------------------------------------------------------------------

interface TimeDiffPageProps {
  params: Promise<{ cities: string; locale: string }>
}

export default function TimeDifferencePage({ params }: TimeDiffPageProps) {
  const { cities, locale } = use(params)
  const t = useTranslations('timeDifference')
  const currentLocale = useLocale()

  // Parse "cityA-vs-cityB"
  const parts = cities.split('-vs-')
  const [cityAKey, cityBKey] = parts.length === 2 ? parts : ['', '']

  const cityA = citiesData[cityAKey as keyof typeof citiesData]
  const cityB = citiesData[cityBKey as keyof typeof citiesData]

  // Render notFound during the render pass (not in effect)
  if (!cityA || !cityB) {
    notFound()
  }

  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const offsetA = getTimezoneOffset(cityA.timezone)
  const offsetB = getTimezoneOffset(cityB.timezone)
  const rawDiff = offsetA - offsetB // positive = A is ahead

  function formatHourDiff(diff: number): string {
    const abs = Math.abs(diff)
    if (abs === 0) return t('sameTimezone')
    const hours = Math.floor(abs)
    const mins = Math.round((abs - hours) * 60)
    if (mins === 0) {
      return hours === 1 ? t('hour', { count: hours }) : t('hours', { count: hours })
    }
    return t('hourMin', { hours, minutes: mins })
  }

  const hourDiff = formatHourDiff(rawDiff)
  const overlapHours = getOverlapHours(offsetA, offsetB)
  const overlapCount = overlapHours.filter((h) => h.overlap).length

  const currentHourA = getCurrentHour(now, cityA.timezone)
  const currentHourB = getCurrentHour(now, cityB.timezone)

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <HeaderClient />

      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">

            {/* Breadcrumb */}
            <p className="text-sm text-muted-foreground mb-4">
              <Link
                href={`/${locale}/time-difference`}
                className="hover:underline"
              >
                {t('timeDifferenceBreadcrumb')}
              </Link>{' '}
              &rsaquo; {cityA.name} vs {cityB.name}
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
              {cityA.name} vs {cityB.name}
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              {t('timeDifferenceLabel')}{' '}
              <strong>
                {hourDiff === t('sameTimezone')
                  ? hourDiff
                  : `${hourDiff} ${t('apart')}`}
              </strong>
            </p>

            {/* Live clocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                { city: cityA, offset: offsetA },
                { city: cityB, offset: offsetB },
              ].map(({ city, offset }) => (
                <Card key={city.timezone}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      {city.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {city.timezone} &middot; {formatOffsetLabel(offset)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`text-3xl font-bold tabular-nums ${jetbrainsMono.className}`}
                    >
                      {formatTime(now, city.timezone, currentLocale)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(now, city.timezone, currentLocale)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Difference summary */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeftRight className="h-4 w-4" />
                  {t('summaryTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{cityA.name}</p>
                    <p className={`text-2xl font-bold ${jetbrainsMono.className}`}>
                      {formatOffsetLabel(offsetA)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-3xl font-bold text-primary ${jetbrainsMono.className}`}
                    >
                      {hourDiff}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {rawDiff > 0
                        ? t('isAhead', { city: cityA.name })
                        : rawDiff < 0
                        ? t('isAhead', { city: cityB.name })
                        : t('sameOffset')}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{cityB.name}</p>
                    <p className={`text-2xl font-bold ${jetbrainsMono.className}`}>
                      {formatOffsetLabel(offsetB)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best meeting times */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {t('bestMeetingTimes')}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t('businessHoursDesc')}
                </p>
              </CardHeader>
              <CardContent>
                {overlapCount === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">
                    {t('noOverlap', { cityA: cityA.name, cityB: cityB.name })}
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium mb-3">
                      {overlapCount === 1
                        ? t('overlappingHours', { count: overlapCount })
                        : t('overlappingHoursPlural', { count: overlapCount })}
                    </p>
                    {overlapHours.map((slot, utcH) => {
                      if (!slot.overlap) return null
                      const hA = ((utcH + offsetA) % 24 + 24) % 24
                      const hB = ((utcH + offsetB) % 24 + 24) % 24
                      const fmt = (h: number) => {
                        const ampm = h >= 12 ? 'PM' : 'AM'
                        const h12 = h % 12 === 0 ? 12 : h % 12
                        return `${h12}:00 ${ampm}`
                      }
                      return (
                        <div
                          key={utcH}
                          className="flex items-center justify-between text-sm bg-green-50 dark:bg-green-950/30 rounded px-3 py-1.5"
                        >
                          <span className="text-muted-foreground w-20">
                            {fmt(utcH)} UTC
                          </span>
                          <span className="font-medium">{fmt(hA)}</span>
                          <span className="text-muted-foreground text-xs">
                            {t('inCity', { city: cityA.name })}
                          </span>
                          <span className="font-medium">{fmt(hB)}</span>
                          <span className="text-muted-foreground text-xs">
                            {t('inCity', { city: cityB.name })}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline visualization */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {t('timelineTitle')}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t('timelineDesc')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { city: cityA, offset: offsetA, currentHour: currentHourA },
                    { city: cityB, offset: offsetB, currentHour: currentHourB },
                  ].map(({ city, offset, currentHour }) => (
                    <div key={city.timezone}>
                      <p className="text-sm font-medium mb-1">{city.name}</p>
                      <div className="flex gap-px">
                        {Array.from({ length: 24 }, (_, utcH) => {
                          const localH = ((utcH + offset) % 24 + 24) % 24
                          const isWork = isWorkHour(localH)
                          const isCurrent = localH === currentHour
                          return (
                            <div
                              key={utcH}
                              title={`${String(localH).padStart(2, '0')}:00`}
                              className={[
                                'flex-1 h-6 rounded-sm relative',
                                isWork
                                  ? 'bg-primary/70'
                                  : 'bg-secondary',
                              ].join(' ')}
                            >
                              {isCurrent && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black" />
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
                        <span>12 AM</span>
                        <span>6 AM</span>
                        <span>12 PM</span>
                        <span>6 PM</span>
                        <span>11 PM</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  {t('localTimeNote')}
                </p>
              </CardContent>
            </Card>

            {/* Back link */}
            <div className="text-center">
              <Link
                href={`/${locale}/time-difference`}
                className="text-sm text-muted-foreground hover:underline"
              >
                &larr; {t('viewAllComparisons')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
