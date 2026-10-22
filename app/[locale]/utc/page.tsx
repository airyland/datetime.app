"use client"

import { useEffect, useState } from "react"
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { getCurrentLocale, getLocalePath } from '@/lib/locale-utils'
import { Copy, Check, Maximize2 } from "lucide-react"
import { PageIntro, Section, Faq, ArrowLink, Pill, cardClass, monoLabel } from "@/components/ds"
import { cn } from "@/lib/utils"
import { TimezoneNavigation } from "@/components/timezone-navigation"
import { FullscreenTime } from '@/components/fullscreen-time'

export default function UTCPage() {
  const t = useTranslations('utc')
  const pathname = usePathname()
  
  // Use the more reliable method to get current locale
  const currentLocale = getCurrentLocale(pathname)

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

  // Format time as HH:MM:SS in UTC
  const formattedTime = currentTime.toLocaleTimeString(currentLocale, {
    timeZone: "UTC",
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  // Format date in UTC
  const formattedDate = currentTime.toLocaleDateString(currentLocale, {
    timeZone: "UTC",
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

  const hm = formattedTime.slice(0, 5)
  const ss = formattedTime.slice(5)
  const lp = (path: string) => getLocalePath(path, currentLocale)

  const readouts = [
    { key: 'timestamp', label: t('unixTimestamp'), value: String(timestamp) },
    { key: 'utc', label: t('utcString'), value: utcTime },
    { key: 'iso', label: t('iso8601'), value: isoTime },
  ]

  // UTC-related FAQs
  const utcFaqs = [
    {
      question: t('faqs.whatIsUtc.question'),
      answer: t('faqs.whatIsUtc.answer')
    },
    {
      question: t('faqs.whyImportant.question'),
      answer: t('faqs.whyImportant.answer')
    },
    {
      question: t('faqs.utcVsGmt.question'),
      answer: t('faqs.utcVsGmt.answer')
    },
    {
      question: t('faqs.convertToLocal.question'),
      answer: t('faqs.convertToLocal.answer')
    },
    {
      question: t('faqs.whyInComputing.question'),
      answer: t('faqs.whyInComputing.answer')
    }
  ]

  return (
    <main className="flex min-h-screen flex-col bg-paper text-ink">
      <PageIntro
        crumbs={[{ label: "Datetime.app", href: lp('/') }, { label: "UTC" }]}
        eyebrow="UTC / GMT+0"
        title={t('title')}
        description={
          <>
            {t('subtitle')}{" "}
            <Link href={lp('/glossary/utc')} className="whitespace-nowrap text-ink underline underline-offset-4 hover:text-brand" title={t('titleLearnMore')}>
              {t('learnMore')}
            </Link>
          </>
        }
      />

      <Section top="clamp(20px,3vw,36px)">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            <span className="rounded-full border border-line2 px-2.5 py-1 font-mono">{t('utcOffset')}</span>
            <span className="rounded-full border border-line2 px-2.5 py-1 font-mono text-subtle">no DST</span>
          </div>
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            aria-label={t('enterFullscreen')}
            title={t('enterFullscreen')}
            className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-transparent transition-colors hover:border-line2 hover:bg-surface"
          >
            <Maximize2 className="size-4" strokeWidth={1.75} />
          </button>
        </div>

        <div
          onClick={() => setIsFullscreen(true)}
          suppressHydrationWarning
          className="tnum -ml-[0.045em] mt-6 flex cursor-zoom-in items-baseline whitespace-nowrap font-mono text-[clamp(46px,13.6vw,190px)] font-light leading-none tracking-[-0.055em]"
        >
          <span suppressHydrationWarning>{hm}</span>
          <span className="text-brand" suppressHydrationWarning>{ss}</span>
        </div>

        <div className="mt-[30px] flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <p suppressHydrationWarning className="m-0 text-[clamp(24px,3.6vw,44px)] font-medium leading-[1.1] tracking-[-0.03em]">{formattedDate}</p>
          <div className="inline-flex items-center gap-2.5 text-[13px] text-subtle">
            <span className="relative inline-block size-2">
              <span className="animate-ping-soft absolute inset-0 rounded-full bg-ok" />
              <span className="absolute inset-0 rounded-full bg-ok" />
            </span>
            <span suppressHydrationWarning>{Math.round(accuracy.offset)} ms</span>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {readouts.map((r) => (
            <div key={r.key} className="flex min-w-0 items-center justify-between gap-3 bg-surface px-[18px] py-4">
              <div className="min-w-0">
                <div className="mb-1 text-[12.5px] text-subtle">{r.label}</div>
                <div className="tnum break-all font-mono text-sm leading-snug" suppressHydrationWarning>{r.value}</div>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(r.value, r.key)}
                aria-label={t('copyToClipboard')}
                title={t('copyToClipboard')}
                className="inline-flex size-[34px] flex-none items-center justify-center rounded-lg border border-transparent text-subtle transition-colors hover:border-line2 hover:bg-paper"
              >
                {copiedStates[r.key] ? <Check className="size-4 text-ok" strokeWidth={2} /> : <Copy className="size-4" strokeWidth={1.75} />}
              </button>
            </div>
          ))}
        </div>
      </Section>

      <TimezoneNavigation currentTimezone="utc" />

      <Faq title={t('faqTitle')} items={utcFaqs.map((f) => ({ q: f.question, a: f.answer }))} />

      <Section top="0px" className="pb-12">
        <ArrowLink href={lp('/glossary')} title={t('titleViewGlossary')}>{t('viewGlossary')}</ArrowLink>
      </Section>

      <FullscreenTime
        time={formattedTime}
        isFullscreen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      />
    </main>
  )
}
