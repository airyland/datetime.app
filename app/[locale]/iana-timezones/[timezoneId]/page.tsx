"use client"

import { useEffect, useState, use } from "react"
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Copy, Check } from "lucide-react"
import { PageIntro, Section, SectionHeading, Faq, RowLink, CardList, cardClass, monoLabel, h2Class } from "@/components/ds"
import { getLocalePath } from '@/lib/locale-utils'
import { 
  getTimezoneById, 
  getCurrentTimeForTimezone,
  getUtcOffsetMinutes,
  ianaTimezones,
  searchTimezones
} from '@/lib/iana-timezones'

interface TimezoneDetailPageProps {
  params: { timezoneId: string; locale: string };
}

export default function TimezoneDetailPage({ params }: TimezoneDetailPageProps) {
  const resolvedParams = use(params)
  const timezoneId = decodeURIComponent(resolvedParams.timezoneId)
  const locale = resolvedParams.locale
  
  const t = useTranslations('timezoneDetail')
  const tCommon = useTranslations('common')
  
  const [currentTime, setCurrentTime] = useState(() => getCurrentTimeForTimezone(timezoneId))
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})

  // Get timezone data
  const timezone = getTimezoneById(timezoneId)
  
  if (!timezone) {
    notFound()
  }

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeForTimezone(timezoneId))
    }, 1000)

    return () => clearInterval(timer)
  }, [timezoneId])

  // Copy to clipboard function
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates(prev => ({ ...prev, [type]: true }))
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [type]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Get related timezones (same region or offset)
  const relatedTimezones = ianaTimezones
    .filter(tz => 
      tz.id !== timezone.id && 
      (tz.region === timezone.region || tz.utcOffset === timezone.utcOffset)
    )
    .slice(0, 6)

  // Get UTC offset in hours for display
  const offsetMinutes = getUtcOffsetMinutes(timezone.utcOffset)
  const offsetHours = offsetMinutes / 60
  const offsetDisplay = offsetHours >= 0 ? `+${offsetHours}` : `${offsetHours}`

  // Check if timezone name differs from ID (to show ID in brackets)
  const showTimezoneId = timezone.name.toLowerCase() !== timezone.id.toLowerCase() && 
                         !timezone.id.toLowerCase().includes(timezone.name.toLowerCase()) &&
                         !timezone.name.toLowerCase().includes(timezone.id.split('/').pop()?.toLowerCase() || '')

  // Calculate time difference with other major timezones
  const majorTimezones = [
    { name: 'UTC', offset: 0 },
    { name: 'New York', offset: -5 },
    { name: 'London', offset: 0 },
    { name: 'Paris', offset: 1 },
    { name: 'Tokyo', offset: 9 },
    { name: 'Sydney', offset: 10 }
  ]

  const timeComparisons = majorTimezones
    .filter(tz => tz.offset !== offsetHours)
    .map(tz => {
      const diff = offsetHours - tz.offset
      const diffText = diff > 0 ? `${diff}h ahead` : `${Math.abs(diff)}h behind`
      return { ...tz, diff: diffText }
    })

  const timezoneDisplayName = showTimezoneId ? `${timezone.name} (${timezone.id})` : timezone.name

  const faqs = [
    {
      question: t('faq.currentTime.question', { city: timezone.city }),
      answer: t('faq.currentTime.answer', { 
        city: timezone.city,
        country: timezone.country,
        currentTime: currentTime.formattedDateTime,
        timezone: timezoneDisplayName
      })
    },
    {
      question: t('faq.utcDifference.question', { city: timezone.city }),
      answer: t('faq.utcDifference.answer', {
        city: timezone.city,
        timezone: timezoneDisplayName,
        offset: offsetDisplay
      })
    },
    {
      question: t('faq.daylightSaving.question', { city: timezone.city }),
      answer: t('faq.daylightSaving.answer', {
        country: timezone.country,
        currentTime: currentTime.formattedDateTime
      })
    }
  ]

  const [hm, ss] = [currentTime.time.slice(0, currentTime.time.lastIndexOf(':')), currentTime.time.slice(currentTime.time.lastIndexOf(':'))]
  const localeHref = (path: string) => getLocalePath(path, locale)

  const infoRows = (rows: [string, React.ReactNode | null | undefined | false][]) =>
    rows
      .filter(([, v]) => v)
      .map(([label, value]) => (
        <div key={label} className="flex items-baseline justify-between gap-6 border-t border-line px-[22px] py-3.5">
          <span className="text-sm text-subtle">{label}</span>
          <span className="min-w-0 break-words text-right font-mono text-sm">{value}</span>
        </div>
      ))

  const formats = [
    { label: t('formats.iso8601'), value: new Date().toISOString(), type: 'iso' },
    { label: t('formats.unix'), value: Math.floor(Date.now() / 1000).toString(), type: 'unix' },
    { label: t('formats.rfc2822'), value: new Date().toUTCString(), type: 'rfc' },
    { label: t('formats.local'), value: currentTime.formattedDateTime, type: 'local' },
  ]

  return (
    <main>
      <PageIntro
        crumbs={[
          { label: "Home", href: localeHref("/") },
          { label: "Timezones", href: localeHref("/iana-timezones") },
          { label: timezone.id },
        ]}
        eyebrow={`${t(`regions.${timezone.region.toLowerCase()}`)} · ${timezone.country}`}
        title={
          <>
            {timezone.name}
            <span className="ml-3 inline-block translate-y-[-0.35em] rounded-full border border-line2 px-3 py-1 align-middle font-mono text-[0.28em] font-normal tracking-normal text-subtle">
              {timezone.abbreviation}
            </span>
          </>
        }
        description={
          <>
            {showTimezoneId && <span className="mb-2 block font-mono text-sm">{timezone.id}</span>}
            {t('description', { timezone: timezoneDisplayName, city: timezone.city })}
          </>
        }
        right={
          <Link href={localeHref("/iana-timezones")} title={t('backToTimezones')} className="text-sm text-subtle transition-colors hover:text-ink">
            ← {t('backToTimezones')}
          </Link>
        }
      />

      {/* Main Time Display */}
      <Section top="clamp(8px,2vw,24px)">
        <div className={`${cardClass} p-[clamp(24px,3.4vw,44px)]`}>
          <div className={`${monoLabel} flex flex-wrap items-center gap-x-3 gap-y-1`}>
            <span>{t('currentTime')}</span>
            <span aria-hidden="true" className="opacity-45">/</span>
            <span className="tnum text-ink">{timezone.utcOffset}</span>
            <span aria-hidden="true" className="opacity-45">/</span>
            <span>{timezone.abbreviation}</span>
            {timezone.dstOffset && <span>DST {timezone.dstOffset}</span>}
          </div>
          <div className="tnum mt-4 whitespace-nowrap font-mono text-[clamp(56px,13vw,176px)] font-light leading-none tracking-[-0.055em]" suppressHydrationWarning>
            {hm}<span className="text-brand">{ss}</span>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[clamp(16px,1.8vw,22px)] font-medium tracking-[-0.02em]" suppressHydrationWarning>
            <span>{currentTime.formattedDateTime}</span>
            <span className="text-[15px] font-normal text-subtle">{timezone.city}, {timezone.country}</span>
            {timezone.population && <span className="text-[15px] font-normal text-subtle">{(timezone.population / 1000000).toFixed(1)}M people</span>}
          </div>
        </div>
      </Section>

      {/* Timezone Information */}
      <Section top="14px">
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))" }}>
          <div className={`${cardClass} cl min-w-0 overflow-hidden`}>
            <h2 className="m-0 px-[22px] pb-3.5 pt-5 text-lg font-semibold tracking-[-0.02em]">{t('basicInfo.title')}</h2>
            {infoRows([
              [t('basicInfo.iana'), timezone.id],
              [t('basicInfo.region'), t(`regions.${timezone.region.toLowerCase()}`)],
              [t('basicInfo.country'), `${timezone.country} (${timezone.countryCode})`],
              [t('basicInfo.city'), timezone.city],
              [t('basicInfo.coordinates'), timezone.coordinates && `${timezone.coordinates.lat}°N, ${timezone.coordinates.lng}°E`],
            ])}
          </div>
          <div className={`${cardClass} cl min-w-0 overflow-hidden`}>
            <h2 className="m-0 px-[22px] pb-3.5 pt-5 text-lg font-semibold tracking-[-0.02em]">{t('timeInfo.title')}</h2>
            {infoRows([
              [t('timeInfo.utcOffset'), timezone.utcOffset],
              [t('timeInfo.dstOffset'), timezone.dstOffset],
              [t('timeInfo.abbreviation'), timezone.abbreviation],
              [t('timeInfo.dstAbbreviation'), timezone.dstAbbreviation],
              [t('timeInfo.population'), timezone.population && timezone.population.toLocaleString()],
            ])}
          </div>
        </div>
      </Section>

      {/* Time Formats */}
      <Section>
        <SectionHeading title={t('formats.title')} />
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))" }}>
          {formats.map((format) => (
            <div key={format.type} className={`${cardClass} flex min-w-0 items-center justify-between gap-3 px-[22px] py-[18px]`}>
              <div className="min-w-0">
                <div className={monoLabel}>{format.label}</div>
                <div className="tnum mt-1.5 break-words font-mono text-[15px]" suppressHydrationWarning>{format.value}</div>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(format.value, format.type)}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-subtle transition-colors hover:border-ink hover:text-ink"
                aria-label={`Copy ${format.label}`}
                title="Copy to clipboard"
              >
                {copiedStates[format.type] ? <Check className="size-4 text-ok" /> : <Copy className="size-4" />}
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Time Comparison */}
      <Section>
        <SectionHeading title={t('comparison.title')} />
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,220px),1fr))" }}>
          {timeComparisons.map((comparison, index) => (
            <div key={index} className={`${cardClass} flex items-baseline justify-between gap-3 px-5 py-4`}>
              <span className="text-base font-medium tracking-[-0.01em]">{comparison.name}</span>
              <span className="font-mono text-[13px] text-subtle">{comparison.diff}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Related Timezones */}
      <Section>
        <SectionHeading title={t('related.title')} />
        <CardList>
          {relatedTimezones.map((relatedTz) => {
            const relatedTime = getCurrentTimeForTimezone(relatedTz.id)
            return (
              <RowLink
                key={relatedTz.id}
                href={localeHref(`/iana-timezones/${encodeURIComponent(relatedTz.id)}`)}
                title={`${relatedTz.name} (${relatedTz.id})`}
                label={relatedTz.name}
                description={`${relatedTz.city}, ${relatedTz.country}`}
                meta={
                  <span className="text-right">
                    <span className="tnum block font-mono text-[15px]" suppressHydrationWarning>{relatedTime.time}</span>
                    <span className="block font-mono text-xs text-subtle">{relatedTz.utcOffset}</span>
                  </span>
                }
              />
            )
          })}
        </CardList>
      </Section>

      {/* FAQ Section */}
      <Faq
        title={t('faq.title', { timezone: timezoneDisplayName })}
        items={faqs.map((f) => ({ q: f.question, a: <p className="m-0">{f.answer}</p> }))}
      />

      {/* SEO Content */}
      <Section className="pb-[clamp(56px,8vw,96px)]">
        <div className={`${cardClass} flex flex-wrap gap-x-16 gap-y-5 p-[clamp(24px,3.4vw,44px)]`}>
          <div className="min-w-0 flex-[1_1_220px]">
            <h2 className={h2Class}>{t('seo.about.title', { timezone: timezoneDisplayName })}</h2>
          </div>
          <p className="m-0 min-w-0 max-w-[72ch] flex-[3_1_520px] text-[15.5px] leading-[1.75] text-subtle">
            {t('seo.about.content', {
              timezone: timezoneDisplayName,
              city: timezone.city,
              country: timezone.country,
              offset: timezone.utcOffset,
            })}
          </p>
        </div>
      </Section>
    </main>
  )
}
