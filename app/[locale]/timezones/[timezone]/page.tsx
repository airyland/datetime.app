"use client"

import { useEffect, useState, use } from "react"
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Clock, Globe, Copy, Check, Maximize2, ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { TimezoneNavigation } from "@/components/timezone-navigation"
import { JetBrains_Mono } from "next/font/google"
import { FullscreenTime } from '@/components/fullscreen-time'
import { timezones, TimezoneConfig } from '../config'

// Load JetBrains Mono for numbers
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

interface TimezonePageProps {
  params: { timezone: string; locale: string };
}

export default function TimezonePage({ params }: TimezonePageProps) {
  const resolvedParams = use(params)
  const timezoneSlug = resolvedParams.timezone
  const locale = resolvedParams.locale
  
  const t = useTranslations('timezones')
  const pathname = usePathname()
  
  // Find timezone config
  const timezoneConfig = timezones.find(tz => tz.slug === timezoneSlug)
  
  if (!timezoneConfig) {
    notFound()
  }
  
  // Determine current locale from pathname as it's more reliable
  const getCurrentLocale = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const locales = ['zh-hans', 'zh-hant', 'ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt', 'ru']
    if (pathSegments.length > 0 && locales.includes(pathSegments[0])) {
      return pathSegments[0]
    }
    return 'en'
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

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
          Datetime.app
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="flex items-center gap-2">
            <span className="text-sm hidden md:inline">{t('toggleTheme')}:</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 flex-grow">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {t('title', { timezone: timezoneName })}
            </h1>
            <h2 className="text-xl md:text-2xl font-medium mb-2 text-muted-foreground">
              {t('subtitle', { description: timezoneDescription })}
            </h2>
            <div className="relative group">
              <div
                className={`text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none ${jetbrainsMono.className} cursor-pointer`}
                onClick={() => setIsFullscreen(true)}
              >
                {formattedTime}
              </div>
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-all"
                title={t('enterFullscreen')}
              >
                <Maximize2 className="w-6 h-6" />
              </button>
            </div>
            <p className="text-xl mt-4">{formattedDate}</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span>{timezoneConfig.utcOffset}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-card text-card-foreground shadow-none rounded-none border">
              <div className="flex flex-col space-y-1.5 p-6 py-2 px-4">
                <div className="tracking-tight text-sm font-medium text-muted-foreground text-center">{t('unixTimestamp')}</div>
              </div>
              <div className="p-6 px-4 py-2">
                <div className="flex items-center gap-2 justify-center">
                  <p className={jetbrainsMono.className}>{timestamp}</p>
                  <button
                    onClick={() => copyToClipboard(timestamp.toString(), 'timestamp')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors group"
                    title={t('copyToClipboard')}
                  >
                    {copiedStates['timestamp'] ? (
                      <Check className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-100 transition-colors" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-100 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-card text-card-foreground shadow-none rounded-none border">
              <div className="flex flex-col space-y-1.5 p-6 py-2 px-4">
                <div className="tracking-tight text-sm font-medium text-muted-foreground text-center">{t('utcString')}</div>
              </div>
              <div className="p-6 px-4 py-2">
                <div className="flex items-center gap-2 justify-center">
                  <p className={jetbrainsMono.className}>{utcTime}</p>
                  <button
                    onClick={() => copyToClipboard(utcTime, 'utc')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors group"
                    title={t('copyToClipboard')}
                  >
                    {copiedStates['utc'] ? (
                      <Check className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-100 transition-colors" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-100 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-card text-card-foreground shadow-none rounded-none border">
              <div className="flex flex-col space-y-1.5 p-6 py-2 px-4">
                <div className="tracking-tight text-sm font-medium text-muted-foreground text-center">{t('iso8601')}</div>
              </div>
              <div className="p-6 px-4 py-2">
                <div className="flex items-center gap-2 justify-center">
                  <p className={jetbrainsMono.className}>{isoTime}</p>
                  <button
                    onClick={() => copyToClipboard(isoTime, 'iso')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors group"
                    title={t('copyToClipboard')}
                  >
                    {copiedStates['iso'] ? (
                      <Check className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-100 transition-colors" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-100 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Timezone Navigation */}
          <TimezoneNavigation currentTimezone={timezoneSlug} />

          {/* FAQ Section */}
          <div className="mt-16 max-w-3xl mx-auto text-left">
            <h2 className="text-2xl font-bold mb-6 text-center">{t('faqTitle', { timezone: timezoneName })}</h2>
            <Accordion 
              type="multiple" 
              className="w-full"
              defaultValue={timezoneFaqs.map((_, index) => `item-${index}`)}
            >
              {timezoneFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p>{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <p className="text-center my-4">
              <Link href="/glossary" className="text-muted-foreground text-sm hover:underline">
                {t('viewGlossary')} <ArrowRight className="inline w-4 h-4" />
              </Link>
            </p>
          </div>
        </div>
      </div>

      <FullscreenTime
        time={formattedTime}
        isFullscreen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      />
    </main>
  )
}