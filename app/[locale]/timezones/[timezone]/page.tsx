"use client"

import { useEffect, useState, use } from "react"
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Copy, Check, Maximize2 } from "lucide-react"
import { PageIntro, Section, Faq, ArrowLink, cardClass, monoLabel } from "@/components/ds"
import { TimezoneNavigation } from "@/components/timezone-navigation"
import { FullscreenTime } from '@/components/fullscreen-time'
import { timezones, TimezoneConfig } from '../config'
import { getLocalePath } from '@/lib/locale-utils'
import { DEFAULT_LOCALE, LOCALE_PREFIXES } from '@/lib/locales'

interface TimezonePageProps {
  params: { timezone: string; locale: string };
}

export default function TimezonePage({ params }: TimezonePageProps) {
  const resolvedParams = use(params)
  const timezoneSlug = resolvedParams.timezone
  const locale = resolvedParams.locale
  
  const t = useTranslations('timezones')
  const tCommon = useTranslations('common')
  const pathname = usePathname()
  
  // Find timezone config
  const timezoneConfig = timezones.find(tz => tz.slug === timezoneSlug)
  
  if (!timezoneConfig) {
    notFound()
  }
  
  // Determine current locale from pathname as it's more reliable
  const getCurrentLocale = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    if (pathSegments.length > 0 && LOCALE_PREFIXES.includes(pathSegments[0] as typeof LOCALE_PREFIXES[number])) {
      return pathSegments[0]
    }
    return DEFAULT_LOCALE
  }
  
  // Use the more reliable method to get current locale
  const currentLocale = getCurrentLocale()
  
  const [currentTime, setCurrentTime] = useState(new Date())
  const [accuracy, setAccuracy] = useState({ offset: 0, latency: 0 })
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({})
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      // Calculate time accuracy
      const start = performance.now()
      fetch("https://worldtimeapi.org/api/ip")
        .then((response) => response.json())
        .then((data) => {
          const end = performance.now()
          const serverTime = new Date(data.datetime)
          const clientTime = new Date()
          const offset = Math.abs(serverTime.getTime() - clientTime.getTime())
          setAccuracy({
            offset: offset,
            latency: end - start,
          })
        })
        .catch(() => {
          // If API fails, don't update accuracy
        })
    }, 10000)

    return () => clearInterval(timer)
  }, [])

  // Format time in the target timezone
  const formattedTime = currentTime.toLocaleTimeString(currentLocale, {
    timeZone: timezoneConfig.ianaTz,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  // Format date in the target timezone
  const formattedDate = currentTime.toLocaleDateString(currentLocale, {
    timeZone: timezoneConfig.ianaTz,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Unix timestamp
  const timestamp = Math.floor(currentTime.getTime() / 1000)

  // UTC time
  const utcTime = currentTime.toUTCString()

  // ISO format
  const isoTime = currentTime.toISOString()

  // Copy to clipboard function with feedback
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates(prev => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }))
      }, 2000)
    }).catch(console.error)
  }

  // Get localized timezone name and description
  const timezoneName = t(`names.${timezoneConfig.slug}`)
  const timezoneDescription = t(`descriptions.${timezoneConfig.slug}`)
  
  // Current time string for FAQ
  const currentTimeString = currentTime.toLocaleTimeString(currentLocale, {
    timeZone: timezoneConfig.ianaTz,
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  })

  // Timezone-related FAQs
  const timezoneFaqs = [
    {
      question: t('faqs.whatIs.question', { 
        timezone: timezoneName
      }),
      answer: t('faqs.whatIs.answer', { 
        timezone: timezoneName,
        abbreviation: timezoneConfig.abbreviation,
        description: timezoneDescription,
        currentTime: currentTimeString
      })
    },
    {
      question: t('faqs.utcDifference.question', { 
        timezone: timezoneName
      }),
      answer: t('faqs.utcDifference.answer', { 
        timezone: timezoneName,
        offset: timezoneConfig.utcOffset
      })
    },
    {
      question: t('faqs.daylightSaving.question', { 
        timezone: timezoneName
      }),
      answer: t('faqs.daylightSaving.answer')
    }
  ]

  const [hm, ss] = [formattedTime.slice(0, formattedTime.lastIndexOf(':')), formattedTime.slice(formattedTime.lastIndexOf(':'))]

  const formats = [
    { key: 'timestamp', label: t('unixTimestamp'), value: timestamp.toString() },
    { key: 'utc', label: t('utcString'), value: utcTime },
    { key: 'iso', label: t('iso8601'), value: isoTime },
  ]

  return (
    <main>
      <PageIntro
        crumbs={[{ label: "Home", href: getLocalePath("/", locale) }, { label: timezoneName }]}
        eyebrow={timezoneConfig.abbreviation}
        title={t('title', { timezone: timezoneName })}
        description={t('subtitle', { description: timezoneDescription })}
      />

      <Section top="clamp(8px,2vw,24px)">
        <div className={`${cardClass} p-[clamp(24px,3.4vw,44px)]`}>
          <div className={`${monoLabel} flex flex-wrap items-center gap-x-3 gap-y-1`}>
            <span className="tnum text-ink">{timezoneConfig.utcOffset}</span>
            <span aria-hidden="true" className="opacity-45">/</span>
            <span>{timezoneConfig.abbreviation}</span>
            <span className="flex-1" />
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink"
              title={t('enterFullscreen')}
              aria-label={t('enterFullscreen')}
            >
              <Maximize2 className="size-4" />
            </button>
          </div>
          <div
            className="tnum mt-4 cursor-pointer whitespace-nowrap font-mono text-[clamp(56px,13vw,176px)] font-light leading-none tracking-[-0.055em]"
            onClick={() => setIsFullscreen(true)}
            title={t('enterFullscreen')}
            suppressHydrationWarning
          >
            {hm}<span className="text-brand">{ss}</span>
          </div>
          <div className="mt-6 text-[clamp(18px,2vw,24px)] font-medium tracking-[-0.02em]" suppressHydrationWarning>{formattedDate}</div>
        </div>
      </Section>

      <Section top="14px">
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))" }}>
          {formats.map((f) => (
            <div key={f.key} className={`${cardClass} flex min-w-0 items-center justify-between gap-3 px-[22px] py-[18px]`}>
              <div className="min-w-0">
                <div className={monoLabel}>{f.label}</div>
                <p className="tnum m-0 mt-1.5 break-words font-mono text-[15px]" suppressHydrationWarning>{f.value}</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(f.value, f.key)}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-subtle transition-colors hover:border-ink hover:text-ink"
                title={t('copyToClipboard')}
                aria-label={t('copyToClipboard')}
              >
                {copiedStates[f.key] ? <Check className="size-4 text-ok" /> : <Copy className="size-4" />}
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Timezone Navigation */}
      <Section top="0">
        <TimezoneNavigation currentTimezone={timezoneSlug} />
      </Section>

      <Faq
        title={t('faqTitle', { timezone: timezoneName })}
        items={timezoneFaqs.map((f) => ({ q: f.question, a: <p className="m-0">{f.answer}</p> }))}
      />

      <Section className="pb-[clamp(56px,8vw,96px)]">
        <ArrowLink href={getLocalePath('/glossary', locale)} title={tCommon('links.titleViewGlossary')}>{t('viewGlossary')}</ArrowLink>
      </Section>

      <FullscreenTime
        time={formattedTime}
        isFullscreen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      />
    </main>
  )
}
