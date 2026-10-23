'use client'

import { use, useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageIntro, Section, SectionHeading, cardClass, monoLabel } from '@/components/ds'
import { getLocalePath } from '@/lib/locale-utils'
import { citiesData } from '@/app/[locale]/cities/[city]/metadata'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'


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

  const fmt12 = (h: number) => {
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 === 0 ? 12 : h % 12
    return `${h12}:00 ${ampm}`
  }
  const listHref = getLocalePath('/time-difference', locale)
  const sides = [
    { city: cityA, offset: offsetA, currentHour: currentHourA },
    { city: cityB, offset: offsetB, currentHour: currentHourB },
  ]

  return (
    <>
      <PageIntro
        crumbs={[
          { label: 'Home', href: getLocalePath('/', locale) },
          { label: t('timeDifferenceBreadcrumb'), href: listHref },
          { label: `${cityA.name} vs ${cityB.name}` },
        ]}
        eyebrow={t('timeDifferenceLabel')}
        eyebrowAs="p"
        title={`${cityA.name} vs ${cityB.name}`}
        description={hourDiff === t('sameTimezone') ? hourDiff : `${hourDiff} ${t('apart')}`}
      />

      {/* Live clocks */}
      <Section top="clamp(24px,3vw,40px)">
        <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))' }}>
          {sides.map(({ city, offset }) => (
            <div key={city.timezone} className={`${cardClass} p-[clamp(20px,3vw,32px)]`}>
              <h2 className="m-0 text-lg font-semibold tracking-[-0.015em]">{city.name}</h2>
              <p className={`m-0 mt-1 ${monoLabel} normal-case tracking-normal`}>
                {city.timezone} &middot; {formatOffsetLabel(offset)}
              </p>
              <p className="tnum m-0 mt-5 font-mono text-[clamp(28px,4.4vw,44px)] font-light leading-none tracking-[-0.04em]">
                {formatTime(now, city.timezone, currentLocale)}
              </p>
              <p className="m-0 mt-3 text-[15px] text-subtle">{formatDate(now, city.timezone, currentLocale)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Difference summary */}
      <Section top="14px">
        <div className={`${cardClass} p-[clamp(20px,3vw,32px)]`}>
          <h2 className={`m-0 mb-5 ${monoLabel}`}>{t('summaryTitle')}</h2>
          <div className="flex flex-wrap items-center justify-around gap-x-8 gap-y-5 text-center">
            <div>
              <p className="m-0 text-sm text-subtle">{cityA.name}</p>
              <p className="m-0 mt-1 font-mono text-2xl font-light">{formatOffsetLabel(offsetA)}</p>
            </div>
            <div>
              <p className="m-0 font-mono text-[clamp(28px,4vw,40px)] font-light tracking-[-0.03em] text-brand">{hourDiff}</p>
              <p className="m-0 mt-1 text-[13px] text-subtle">
                {rawDiff > 0
                  ? t('isAhead', { city: cityA.name })
                  : rawDiff < 0
                  ? t('isAhead', { city: cityB.name })
                  : t('sameOffset')}
              </p>
            </div>
            <div>
              <p className="m-0 text-sm text-subtle">{cityB.name}</p>
              <p className="m-0 mt-1 font-mono text-2xl font-light">{formatOffsetLabel(offsetB)}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Best meeting times */}
      <Section top="clamp(40px,5vw,64px)">
        <SectionHeading title={t('bestMeetingTimes')} description={t('businessHoursDesc')} />
        <div className={`${cardClass} p-[clamp(16px,3vw,28px)]`}>
          {overlapCount === 0 ? (
            <p className="m-0 text-[15px] text-subtle">{t('noOverlap', { cityA: cityA.name, cityB: cityB.name })}</p>
          ) : (
            <>
              <p className="m-0 mb-4 text-[15px] font-medium">
                {overlapCount === 1
                  ? t('overlappingHours', { count: overlapCount })
                  : t('overlappingHoursPlural', { count: overlapCount })}
              </p>
              <div className="grid gap-2">
                {overlapHours.map((slot, utcH) => {
                  if (!slot.overlap) return null
                  const hA = (((utcH + offsetA) % 24) + 24) % 24
                  const hB = (((utcH + offsetB) % 24) + 24) % 24
                  return (
                    <div
                      key={utcH}
                      className="grid grid-cols-1 gap-x-4 gap-y-1 rounded-xl border border-line bg-paper px-4 py-3 text-sm sm:grid-cols-[110px_1fr_1fr] sm:items-center"
                    >
                      <span className="font-mono text-subtle">{fmt12(utcH)} UTC</span>
                      <span>
                        <span className="font-mono font-medium">{fmt12(hA)}</span>{' '}
                        <span className="text-[13px] text-subtle">{t('inCity', { city: cityA.name })}</span>
                      </span>
                      <span>
                        <span className="font-mono font-medium">{fmt12(hB)}</span>{' '}
                        <span className="text-[13px] text-subtle">{t('inCity', { city: cityB.name })}</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </Section>

      {/* Timeline */}
      <Section top="clamp(40px,5vw,64px)" className="pb-[clamp(56px,8vw,96px)]">
        <SectionHeading title={t('timelineTitle')} description={t('timelineDesc')} />
        <div className={`${cardClass} p-[clamp(16px,3vw,28px)]`}>
          <div className="grid gap-6">
            {sides.map(({ city, offset, currentHour }) => (
              <div key={city.timezone}>
                <p className="m-0 mb-2 text-sm font-medium">{city.name}</p>
                <div className="flex gap-px">
                  {Array.from({ length: 24 }, (_, utcH) => {
                    const localH = (((utcH + offset) % 24) + 24) % 24
                    const isWork = isWorkHour(localH)
                    const isCurrent = localH === currentHour
                    return (
                      <div
                        key={utcH}
                        title={`${String(localH).padStart(2, '0')}:00`}
                        className={`relative h-7 flex-1 rounded-[3px] ${isWork ? 'bg-brand' : 'bg-line'}`}
                      >
                        {isCurrent && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="size-1.5 rounded-full bg-paper" />
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className={`mt-1.5 flex justify-between ${monoLabel} normal-case tracking-normal`}>
                  <span>12 AM</span>
                  <span>6 AM</span>
                  <span>12 PM</span>
                  <span>6 PM</span>
                  <span>11 PM</span>
                </div>
              </div>
            ))}
          </div>
          <p className="m-0 mt-5 text-[13px] text-subtle">{t('localTimeNote')}</p>
        </div>
        <div className="mt-6">
          <Link href={listHref} className="text-sm text-subtle transition-colors hover:text-ink">
            &larr; {t('viewAllComparisons')}
          </Link>
        </div>
      </Section>
    </>
  )
}
