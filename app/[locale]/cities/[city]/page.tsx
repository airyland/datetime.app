"use client"

import { useEffect, useState, use } from "react"
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Globe, Clock, AlertCircle, Copy, Check, Maximize2, Github, Sun, Briefcase, ArrowLeftRight, Calendar as CalendarIcon } from 'lucide-react'
import { locales } from '@/i18n/request'
import { getLocalePath } from '@/lib/locale-utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { JetBrains_Mono } from "next/font/google"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { citiesData } from './metadata'
import { FullscreenTime } from '@/components/fullscreen-time'

// Load JetBrains Mono for numbers
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

interface SunTimesState {
  sunrise: string | null;
  sunset: string | null;
  dayLength: string | null;
  isLoading: boolean;
  error: string | null;
}

interface SimplifiedHoliday {
  name: string;
  dateLabel: string;
}

const countryCodeMap: Record<string, string> = {
  'United States': 'US',
  'Canada': 'CA',
  'Mexico': 'MX',
  'United Kingdom': 'GB',
  'France': 'FR',
  'Germany': 'DE',
  'Italy': 'IT',
  'Spain': 'ES',
  'Netherlands': 'NL',
  'Russia': 'RU',
  'Austria': 'AT',
  'Czech Republic': 'CZ',
  'Belgium': 'BE',
  'Switzerland': 'CH',
  'Sweden': 'SE',
  'Japan': 'JP',
  'China': 'CN',
  'Hong Kong': 'HK',
  'Singapore': 'SG',
  'South Korea': 'KR',
  'Thailand': 'TH',
  'India': 'IN',
  'United Arab Emirates': 'AE',
  'Taiwan': 'TW',
  'Malaysia': 'MY',
  'Australia': 'AU',
  'New Zealand': 'NZ',
  'Brazil': 'BR',
  'Argentina': 'AR',
  'Peru': 'PE',
  'Colombia': 'CO',
  'Chile': 'CL',
  'Egypt': 'EG',
  'South Africa': 'ZA',
  'Nigeria': 'NG',
  'Kenya': 'KE',
  'Morocco': 'MA',
  'Turkey': 'TR',
  'Israel': 'IL',
  'Saudi Arabia': 'SA',
  'Qatar': 'QA',
  'Kuwait': 'KW',
}

const parseCoordinates = (coordinates: string) => {
  const parts = coordinates.split(",")
  if (parts.length !== 2) {
    return null
  }

  const parsePart = (part: string) => {
    const trimmed = part.trim()
    const value = parseFloat(trimmed)
    if (Number.isNaN(value)) return null
    const lastChar = trimmed.charAt(trimmed.length - 1).toUpperCase()
    const sign = lastChar === "S" || lastChar === "W" ? -1 : 1
    return value * sign
  }

  const lat = parsePart(parts[0])
  const lon = parsePart(parts[1])

  if (lat == null || lon == null) {
    return null
  }

  return { lat, lon }
}

interface CityPageProps {
  params: { city: string; locale: string };
}

export default function CityPage({ params }: CityPageProps) {
  const resolvedParams = use(params)
  const city = resolvedParams.city;
  const locale = resolvedParams.locale;
  const t = useTranslations('cities')
  const tCommon = useTranslations('common')
  const tHome = useTranslations('home')
  const cityInfo = citiesData[city as keyof typeof citiesData];
  
  // Get localized city and country names
  const getLocalizedCityName = (cityKey: string) => {
    try {
      return t(`cityNames.${cityKey}`);
    } catch {
      return cityInfo.name;
    }
  };

  const getLocalizedCountryName = (countryName: string) => {
    try {
      return t(`countryNames.${countryName}`);
    } catch {
      return countryName;
    }
  };
  
  const localizedCityName = getLocalizedCityName(city);
  const localizedCountryName = getLocalizedCountryName(cityInfo.country);
  const [currentTime, setCurrentTime] = useState(new Date())
  const [accuracy, setAccuracy] = useState({ offset: 0, latency: 0 })
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({})
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [sunTimes, setSunTimes] = useState<SunTimesState>({
    sunrise: null,
    sunset: null,
    dayLength: null,
    isLoading: false,
    error: null,
  })
  const [userTimezone, setUserTimezone] = useState<string | null>(null)
  const [upcomingHolidays, setUpcomingHolidays] = useState<SimplifiedHoliday[]>([])
  const [holidaysLoading, setHolidaysLoading] = useState(false)
  const [holidaysError, setHolidaysError] = useState<string | null>(null)
  const holidayCountryCode = countryCodeMap[cityInfo.country]
  
  if (!cityInfo) {
    notFound();
  }

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        setUserTimezone(tz)
      } catch {
        setUserTimezone(null)
      }
    }
  }, [])

  const getHolidayLanguage = (loc: string) => {
    const map: Record<string, string> = {
      'en': 'en',
      'de': 'de',
      'es': 'es',
      'fr': 'fr',
      'it': 'it',
      'nl': 'nl',
      'zh-hans': 'zh',
      'zh-hant': 'zh',
      'ja': 'ja',
      'ko': 'ko',
      'pt': 'pt',
      'ru': 'ru',
      'ar': 'ar',
    }
    return map[loc] || 'en'
  }

  // Format date in local language
  const getLocaleCode = (locale: string) => {
    const localeMap: { [key: string]: string } = {
      'zh-hans': 'zh-CN',
      'zh-hant': 'zh-TW',
      'en': 'en-US',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'ar': 'ar-SA',
      'de': 'de-DE',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'hi': 'hi-IN',
      'it': 'it-IT',
      'pt': 'pt-BR',
      'ru': 'ru-RU'
    }
    return localeMap[locale] || 'en-US'
  }

  const localeCode = getLocaleCode(locale)

  // Format time as HH:MM:SS
  const formattedTime = currentTime.toLocaleTimeString(localeCode, {
    timeZone: cityInfo.timezone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  const formattedDate = currentTime.toLocaleDateString(localeCode, {
    timeZone: cityInfo.timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Sun times (sunrise, sunset, day length)
  useEffect(() => {
    const coords = parseCoordinates(cityInfo.coordinates)
    if (!coords) {
      setSunTimes((prev) => ({
        ...prev,
        error: "Unable to determine coordinates for this city.",
      }))
      return
    }

    const controller = new AbortController()

    const fetchSunTimes = async () => {
      setSunTimes({
        sunrise: null,
        sunset: null,
        dayLength: null,
        isLoading: true,
        error: null,
      })

      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=sunrise,sunset&timezone=${encodeURIComponent(
          cityInfo.timezone,
        )}&forecast_days=1`
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) {
          throw new Error("Failed to fetch sun times")
        }
        const data = await response.json()
        if (!data.daily || !data.daily.sunrise || !data.daily.sunset) {
          throw new Error("Missing sun times data")
        }

        const sunriseDate = new Date(data.daily.sunrise[0])
        const sunsetDate = new Date(data.daily.sunset[0])

        const sunrise = sunriseDate.toLocaleTimeString(getLocaleCode(locale), {
          hour: "2-digit",
          minute: "2-digit",
        })
        const sunset = sunsetDate.toLocaleTimeString(getLocaleCode(locale), {
          hour: "2-digit",
          minute: "2-digit",
        })

        const dayLengthMs = sunsetDate.getTime() - sunriseDate.getTime()
        const dayHours = Math.floor(dayLengthMs / (1000 * 60 * 60))
        const dayMinutes = Math.round(
          (dayLengthMs % (1000 * 60 * 60)) / (1000 * 60),
        )
        const dayLength = `${dayHours}h ${dayMinutes}m`

        setSunTimes({
          sunrise,
          sunset,
          dayLength,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        if (controller.signal.aborted) return
        setSunTimes((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to load sun times.",
        }))
      }
    }

    fetchSunTimes()

    return () => controller.abort()
  }, [cityInfo.coordinates, cityInfo.timezone, locale])

  // Upcoming holidays (simple summary)
  useEffect(() => {
    if (!holidayCountryCode) {
      return
    }

    const controller = new AbortController()

    const fetchHolidays = async () => {
      setHolidaysLoading(true)
      setHolidaysError(null)

      try {
        const year = new Date().getFullYear()
        const language = getHolidayLanguage(locale)
        const response = await fetch(
          `/api/holidays?country=${holidayCountryCode}&year=${year}&language=${language}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error("Failed to fetch holidays")
        }

        const data = await response.json()
        const holidays = Array.isArray(data.holidays) ? data.holidays : []
        const nowDate = new Date()

        const upcoming = holidays
          .map((holiday: any) => {
            const start = new Date(holiday.start)
            return {
              name: holiday.name as string,
              start,
            }
          })
          .filter((holiday) => holiday.start >= nowDate)
          .sort((a, b) => a.start.getTime() - b.start.getTime())
          .slice(0, 3)
          .map(({ name, start }) => ({
            name,
            dateLabel: start.toLocaleDateString(getLocaleCode(locale), {
              month: "short",
              day: "numeric",
              weekday: "short",
            }),
          }))

        setUpcomingHolidays(upcoming)
      } catch (error) {
        if (controller.signal.aborted) return
        setHolidaysError("Failed to load holiday data.")
      } finally {
        setHolidaysLoading(false)
      }
    }

    fetchHolidays()

    return () => controller.abort()
  }, [holidayCountryCode, locale])

  // Unix timestamp
  const timestamp = Math.floor(currentTime.getTime() / 1000)

  // UTC time
  const utcTime = currentTime.toUTCString()

  // ISO format
  const isoTime = currentTime.toISOString()

  // Calculate GMT offset
  const now = new Date();
  const utcDate = new Date(now.toLocaleString(localeCode, { timeZone: 'UTC' }));
  const targetDate = new Date(now.toLocaleString(localeCode, { timeZone: cityInfo.timezone }));
  const offsetInHours = (targetDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
  
  let offsetString;
  const hours = Math.floor(Math.abs(offsetInHours));
  const minutes = Math.floor((Math.abs(offsetInHours) * 60) % 60);
  const sign = offsetInHours >= 0 ? '+' : '-';

  if (minutes === 0) {
    offsetString = `GMT${sign}${hours}`;
  } else {
    offsetString = `GMT${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  // City-specific FAQs
  const currentTimeString = currentTime.toLocaleTimeString(localeCode, { 
    hour: 'numeric', 
    minute: '2-digit', 
    timeZoneName: 'short' 
  });
  const offsetHours = currentTime.getTimezoneOffset() / -60;
  const currentTimeWithZone = currentTime.toLocaleTimeString(localeCode, { 
    timeZoneName: 'long' 
  });

  let cityFaqs = [
    {
      question: t('faqQuestions.currentTime', { cityName: localizedCityName }),
      answer: t('faqAnswers.currentTime', { 
        cityName: localizedCityName, 
        country: localizedCountryName, 
        currentTime: currentTimeString,
        timezone: cityInfo.timezone 
      })
    },
    {
      question: t('faqQuestions.utcDifference', { cityName: localizedCityName }),
      answer: t('faqAnswers.utcDifference', { 
        cityName: localizedCityName, 
        timezone: cityInfo.timezone,
        offset: offsetHours 
      })
    },
    {
      question: t('faqQuestions.daylightSaving', { cityName: localizedCityName }),
      answer: t('faqAnswers.daylightSaving', { 
        country: localizedCountryName,
        currentTime: currentTimeWithZone 
      })
    },
  ]

  // Business hours (approximate)
  const cityLocalNow = new Date(
    currentTime.toLocaleString(localeCode, { timeZone: cityInfo.timezone }),
  )
  const businessStartHour = 9
  const businessEndHour = 18
  const cityHour = cityLocalNow.getHours()
  const isWithinBusinessHours =
    cityHour >= businessStartHour && cityHour < businessEndHour
  const businessHoursLabel = `${String(businessStartHour).padStart(
    2,
    "0",
  )}:00–${String(businessEndHour).padStart(2, "0")}:00`

  // Time comparison with local and major cities
  const comparisonTimezones: { key: string; timezone: string; label: string }[] =
    []

  if (userTimezone) {
    comparisonTimezones.push({
      key: "local",
      timezone: userTimezone,
      label: tHome('localTime'),
    })
  }

  const referenceTimezones: { key: string; timezone: string; label: string }[] =
    [
      {
        key: "new-york",
        timezone: "America/New_York",
        label: getLocalizedCityName("new-york"),
      },
      {
        key: "london",
        timezone: "Europe/London",
        label: getLocalizedCityName("london"),
      },
      {
        key: "tokyo",
        timezone: "Asia/Tokyo",
        label: getLocalizedCityName("tokyo"),
      },
    ]

  referenceTimezones.forEach((ref) => {
    if (
      ref.timezone !== cityInfo.timezone &&
      !comparisonTimezones.some((item) => item.timezone === ref.timezone)
    ) {
      comparisonTimezones.push(ref)
    }
  })

  const timeComparisons = comparisonTimezones.map((item) => {
    const compareDate = new Date(
      currentTime.toLocaleString(localeCode, { timeZone: item.timezone }),
    )
    const diffMinutes = Math.round(
      (compareDate.getTime() - cityLocalNow.getTime()) / 60000,
    )
    const diffHours = Math.trunc(diffMinutes / 60)
    const remainingMinutes = Math.abs(diffMinutes % 60)

    let diffLabel = "0h"
    if (diffMinutes !== 0) {
      const sign = diffMinutes > 0 ? "+" : "-"
      if (remainingMinutes === 0) {
        diffLabel = `${sign}${Math.abs(diffHours)}h`
      } else {
        diffLabel = `${sign}${Math.abs(diffHours)}h ${remainingMinutes}m`
      }
    }

    const timeLabel = compareDate.toLocaleTimeString(getLocaleCode(locale), {
      hour: "2-digit",
      minute: "2-digit",
    })

    return {
      ...item,
      timeLabel,
      diffLabel,
    }
  })

  const comparisonSummary =
    timeComparisons.length > 0
      ? timeComparisons
          .map(
            (item) =>
              `${item.label}: ${item.timeLabel} (${item.diffLabel})`,
          )
          .join(" • ")
      : ""

  if (comparisonSummary) {
    cityFaqs.push({
      question: t('faqQuestions.timeComparison', { cityName: localizedCityName }),
      answer: t('faqAnswers.timeComparison', {
        cityName: localizedCityName,
        comparison: comparisonSummary,
      }),
    })
  }

  // Copy to clipboard function with feedback
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates(prev => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }))
      }, 2000)
    }).catch(console.error)
  }
  
  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href={getLocalePath('/', locale)} className="text-2xl font-bold hover:opacity-80 transition-opacity" title={tCommon('links.titleHome')}>
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
              {t('pageTitle', { cityName: localizedCityName, countryName: localizedCountryName })}
            </h1>
            <h2 className="text-xl md:text-2xl font-medium mb-2 text-muted-foreground">
              {t('timezoneLabel', { timezone: cityInfo.timezone })}
            </h2>
            <div className="relative group">
              <div 
                className={`text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none min-h-[4rem] md:min-h-[5.5rem] lg:min-h-[6.5rem] ${jetbrainsMono.className} cursor-pointer`}
                onClick={() => setIsFullscreen(true)}
                aria-live="polite"
                suppressHydrationWarning
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
            <div className="text-xl md:text-2xl font-medium mt-2">{formattedDate}</div>

            {/* Time accuracy indicator */}
            <div className="flex items-center justify-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              <AlertCircle className="h-4 w-4 mr-1" />
              {accuracy.offset > 1000 ? (
                <span>
                  {t('clockOffset', { seconds: Math.round(accuracy.offset / 1000) })}
                </span>
              ) : (
                <span>{t('clockSynchronized', { offset: Math.round(accuracy.offset) })}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-3xl mx-auto">
            <Card className="shadow-none rounded-none border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{t('timezoneInfo')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={jetbrainsMono.className}>{cityInfo.timezone} ({offsetString})</p>
              </CardContent>
            </Card>

            <Card className="shadow-none rounded-none border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{t('unixTimestamp')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="inline-flex items-center gap-2">
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
              </CardContent>
            </Card>

            <Card className="shadow-none rounded-none border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{t('utcTime')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="inline-flex items-center gap-2">
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
              </CardContent>
            </Card>

            <Card className="shadow-none rounded-none border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{t('isoFormat')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="inline-flex items-center gap-2">
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
              </CardContent>
            </Card>

            <Card className="shadow-none rounded-none border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  {tHome('sections.sunriseSunset')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sunTimes.isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading sun times…</p>
                ) : sunTimes.error ? (
                  <p className="text-sm text-red-500">{sunTimes.error}</p>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        {tHome('labels.sunrise')}
                      </span>
                      <span className={jetbrainsMono.className}>
                        {sunTimes.sunrise ?? '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        {tHome('labels.sunset')}
                      </span>
                      <span className={jetbrainsMono.className}>
                        {sunTimes.sunset ?? '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        {t('sun.dayLength')}
                      </span>
                      <span className={jetbrainsMono.className}>
                        {sunTimes.dayLength ?? '—'}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-none rounded-none border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {t('workingHours.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('workingHours.approximate')}
                    </p>
                    <p className={jetbrainsMono.className}>
                      {businessHoursLabel} ({cityInfo.timezone})
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isWithinBusinessHours
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {isWithinBusinessHours
                      ? t('workingHours.inBusiness')
                      : t('workingHours.outOfBusiness')}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none rounded-none border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4" />
                  {t('timeComparisonSection.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {timeComparisons.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t('timeComparisonSection.unavailable')}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {timeComparisons.map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.timeLabel}
                          </div>
                        </div>
                        <div className="text-sm font-mono text-gray-700 dark:text-gray-200">
                          {item.diffLabel}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-none rounded-none border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {t('upcomingHolidays.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!holidayCountryCode ? (
                  <p className="text-sm text-muted-foreground">
                    {t('upcomingHolidays.noDataForCountry', {
                      country: localizedCountryName,
                    })}
                  </p>
                ) : holidaysLoading ? (
                  <p className="text-sm text-muted-foreground">
                    {t('upcomingHolidays.loading')}
                  </p>
                ) : holidaysError ? (
                  <p className="text-sm text-red-500">{holidaysError}</p>
                ) : upcomingHolidays.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t('upcomingHolidays.none')}
                  </p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {upcomingHolidays.map((holiday, index) => (
                      <li
                        key={`${holiday.name}-${holiday.dateLabel}-${index}`}
                        className="flex items-center justify-between"
                      >
                        <span>{holiday.name}</span>
                        <span className="text-muted-foreground">
                          {holiday.dateLabel}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-none rounded-none border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  {t('developerSnippet.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">
                    {t('developerSnippet.description')}
                  </p>
                  <button
                    onClick={() => {
                      const snippetLines = [
                        "const date = new Date();",
                        `const options = { timeZone: "${cityInfo.timezone}", hour: "2-digit", minute: "2-digit" };`,
                        "const formatter = new Intl.DateTimeFormat('en-US', options);",
                        "console.log(formatter.format(date));",
                      ]
                      const snippet = snippetLines.join('\n')
                      copyToClipboard(snippet, 'dev-snippet')
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors group"
                    title={t('copyToClipboard')}
                  >
                    {copiedStates['dev-snippet'] ? (
                      <Check className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-100 transition-colors" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-100 transition-colors" />
                    )}
                  </button>
                </div>
                <pre className="bg-muted text-xs p-3 rounded-md overflow-x-auto text-left">
                  <code>
{`const date = new Date();
const options = { timeZone: "${cityInfo.timezone}", hour: "2-digit", minute: "2-digit" };
const formatter = new Intl.DateTimeFormat('en-US', options);
console.log(formatter.format(date));`}
                  </code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Google AdSense Advertisement */}
        <div className="mt-8 max-w-3xl mx-auto">
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-format="autorelaxed"
               data-ad-client="ca-pub-8443907573529681"
               data-ad-slot="8712987437"></ins>
          <script
            dangerouslySetInnerHTML={{
              __html: '(adsbygoogle = window.adsbygoogle || []).push({});'
            }}
          />
        </div>

        {/* City Information and FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <Card className="shadow-none rounded-none border mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t('cityInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">{t('country')}</p>
                <p>{localizedCountryName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('timezone')}</p>
                <p>{cityInfo.timezone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('coordinates')}</p>
                <p>{cityInfo.coordinates}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('population')}</p>
                <p>{cityInfo.population}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none rounded-none border">
            <CardHeader>
              <CardTitle>{t('faq')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" defaultValue={cityFaqs.map((_, index) => `item-${index}`)} collapsible>
                {cityFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Language Links Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {t('pageTitle', { cityName: localizedCityName, countryName: localizedCountryName })} in Other Languages
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {locales.map((loc) => {
                const url = loc === 'en' 
                  ? `/cities/${city}` 
                  : `/${loc}/cities/${city}`;
                
                // Language name mapping
                const languageNames: Record<string, string> = {
                  'en': 'English',
                  'zh-hans': '简体中文',
                  'zh-hant': '繁體中文',
                  'ar': 'العربية',
                  'de': 'Deutsch',
                  'es': 'Español',
                  'fr': 'Français',
                  'hi': 'हिन्दी',
                  'it': 'Italiano',
                  'ja': '日本語',
                  'ko': '한국어',
                  'pt': 'Português',
                  'ru': 'Русский'
                };

                // Static city name translations
                const cityNameTranslations: Record<string, Record<string, string>> = {
                  'london': {
                    'zh-hans': '伦敦',
                    'zh-hant': '倫敦'
                  },
                  'tokyo': {
                    'zh-hans': '东京',
                    'zh-hant': '東京'
                  },
                  'new-york': {
                    'zh-hans': '纽约',
                    'zh-hant': '紐約'
                  },
                  'shanghai': {
                    'zh-hans': '上海',
                    'zh-hant': '上海'
                  },
                  'beijing': {
                    'zh-hans': '北京',
                    'zh-hant': '北京'
                  },
                  'seoul': {
                    'zh-hans': '首尔',
                    'zh-hant': '首爾'
                  },
                  'kolkata': {
                    'zh-hans': '加尔各答',
                    'zh-hant': '加爾各答'
                  },
                  'dubai': {
                    'zh-hans': '迪拜',
                    'zh-hant': '杜拜'
                  },
                  'cairo': {
                    'zh-hans': '开罗',
                    'zh-hant': '開羅'
                  },
                  'moscow': {
                    'zh-hans': '莫斯科',
                    'zh-hant': '莫斯科'
                  },
                  'istanbul': {
                    'zh-hans': '伊斯坦布尔',
                    'zh-hant': '伊斯坦堡'
                  },
                  'paris': {
                    'zh-hans': '巴黎',
                    'zh-hant': '巴黎'
                  },
                  'sydney': {
                    'zh-hans': '悉尼',
                    'zh-hant': '雪梨'
                  }
                };

                // Get city name for each language
                const getCityNameForLanguage = (targetLocale: string): string => {
                  const cityTranslation = cityNameTranslations[city];
                  if (cityTranslation && cityTranslation[targetLocale]) {
                    return cityTranslation[targetLocale];
                  }
                  return cityInfo.name;
                };

                // Translation mapping for "Current Time in {city}" 
                const translations: Record<string, string> = {
                  'en': `Current Time in ${getCityNameForLanguage('en')}`,
                  'zh-hans': `${getCityNameForLanguage('zh-hans')}当前时间`,
                  'zh-hant': `${getCityNameForLanguage('zh-hant')}當前時間`,
                  'ar': `الوقت الحالي في ${getCityNameForLanguage('ar')}`,
                  'de': `Aktuelle Zeit in ${getCityNameForLanguage('de')}`,
                  'es': `Hora Actual en ${getCityNameForLanguage('es')}`,
                  'fr': `Heure Actuelle à ${getCityNameForLanguage('fr')}`,
                  'hi': `${getCityNameForLanguage('hi')} में वर्तमान समय`,
                  'it': `Ora attuale a ${getCityNameForLanguage('it')}`,
                  'ja': `${getCityNameForLanguage('ja')}の現在時刻`,
                  'ko': `${getCityNameForLanguage('ko')}의 현재 시간`,
                  'pt': `Hora atual em ${getCityNameForLanguage('pt')}`,
                  'ru': `Текущее время в ${getCityNameForLanguage('ru')}`
                };

                return (
                  <Link
                    key={loc}
                    href={url}
                    className={`inline-block px-3 py-1 text-sm rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      locale === loc 
                        ? 'bg-gray-200 dark:bg-gray-700 font-medium' 
                        : 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200'
                    }`}
                    title={translations[loc]}
                    hrefLang={loc}
                  >
                    {translations[loc]}
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                      ({languageNames[loc]})
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </footer>

      {isFullscreen && (
        <FullscreenTime 
          time={formattedTime}
          isFullscreen={isFullscreen}
          onClose={() => setIsFullscreen(false)}
        />
      )}
    </main>
  );
}
