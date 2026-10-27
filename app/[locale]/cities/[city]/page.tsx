"use client"

import { useEffect, useState, use } from "react"
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Copy, Check, Maximize2 } from 'lucide-react'
import { locales } from '@/i18n/request'
import { countdownSlugFor } from '@/lib/countdown'
import { getLocalePath } from '@/lib/locale-utils'
import { AdSlot } from "@/components/ad-slot"
import { Eyebrow, PageIntro, Section, SectionHeading, Faq, cardClass, monoLabel, h2Class } from "@/components/ds"
import { cn } from "@/lib/utils"
import { citiesData } from './metadata'
import { FullscreenTime } from '@/components/fullscreen-time'

interface SunTimesState {
  sunrise: string | null;
  sunset: string | null;
  dayLength: string | null;
  riseMin: number | null;
  setMin: number | null;
  isLoading: boolean;
  error: string | null;
}

interface SimplifiedHoliday {
  name: string;
  day: string;
  month: string;
  rel: string;
  slug: string | null;
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
  'Cuba': 'CU',
  'Panama': 'PA',
  'Jamaica': 'JM',
  'Guatemala': 'GT',
  'Ireland': 'IE',
  'Portugal': 'PT',
  'Greece': 'GR',
  'Poland': 'PL',
  'Hungary': 'HU',
  'Denmark': 'DK',
  'Norway': 'NO',
  'Finland': 'FI',
  'Ukraine': 'UA',
  'Romania': 'RO',
  'Bulgaria': 'BG',
  'Serbia': 'RS',
  'Croatia': 'HR',
  'Iceland': 'IS',
  'Lithuania': 'LT',
  'Latvia': 'LV',
  'Estonia': 'EE',
  'Indonesia': 'ID',
  'Philippines': 'PH',
  'Vietnam': 'VN',
  'Pakistan': 'PK',
  'Bangladesh': 'BD',
  'Sri Lanka': 'LK',
  'Nepal': 'NP',
  'Uzbekistan': 'UZ',
  'Kazakhstan': 'KZ',
  'Macau': 'MO',
  'Mongolia': 'MN',
  'Myanmar': 'MM',
  'Cambodia': 'KH',
  'Azerbaijan': 'AZ',
  'Georgia': 'GE',
  'Armenia': 'AM',
  'Iran': 'IR',
  'Iraq': 'IQ',
  'Lebanon': 'LB',
  'Jordan': 'JO',
  'Papua New Guinea': 'PG',
  'Venezuela': 'VE',
  'Ecuador': 'EC',
  'Bolivia': 'BO',
  'Uruguay': 'UY',
  'Paraguay': 'PY',
  'Ethiopia': 'ET',
  'Ghana': 'GH',
  'Algeria': 'DZ',
  'Tunisia': 'TN',
  'Tanzania': 'TZ',
  'DR Congo': 'CD',
  'Angola': 'AO',
  'Senegal': 'SN',
  'Uganda': 'UG',
  'Zimbabwe': 'ZW',
  'Ivory Coast': 'CI',
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
  const tHome = useTranslations('home')
  const cityInfo = citiesData[city as keyof typeof citiesData];
  if (!cityInfo) {
    notFound();
  }
  
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
    riseMin: null,
    setMin: null,
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

  // Format time as HH:MM:SS
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    timeZone: cityInfo.timezone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

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

  const formattedDate = currentTime.toLocaleDateString(getLocaleCode(locale), {
    timeZone: cityInfo.timezone,
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
        riseMin: null,
        setMin: null,
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
          riseMin: sunriseDate.getHours() * 60 + sunriseDate.getMinutes(),
          setMin: sunsetDate.getHours() * 60 + sunsetDate.getMinutes(),
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
            // `date` is the holiday's local calendar day; `start` is a UTC instant that shifts it by timezone
            const [y, m, d] = String(holiday.date ?? holiday.start).slice(0, 10).split("-").map(Number)
            const start = new Date(y, m - 1, d)
            return {
              name: holiday.name as string,
              start,
            }
          })
          .filter((holiday) => holiday.start >= nowDate)
          .sort((a, b) => a.start.getTime() - b.start.getTime())
          .slice(0, 4)
          .map(({ name, start }) => {
            const code = getLocaleCode(locale)
            const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime()
            const today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()).getTime()
            return {
              name,
              day: String(start.getDate()),
              month: start.toLocaleDateString(code, { month: "short" }),
              rel: new Intl.RelativeTimeFormat(code, { numeric: "auto" }).format(Math.round((startDay - today) / 864e5), "day"),
              slug: countdownSlugFor(name, start)
                ? `/countdown/${countdownSlugFor(name, start)}`
                : `/countdown/h?c=${holidayCountryCode}&n=${encodeURIComponent(name)}&d=${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`,
            }
          })

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
  const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  const targetDate = new Date(now.toLocaleString('en-US', { timeZone: cityInfo.timezone }));
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
  const currentTimeString = currentTime.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    timeZoneName: 'short' 
  });
  const offsetHours = currentTime.getTimezoneOffset() / -60;
  const currentTimeWithZone = currentTime.toLocaleTimeString('en-US', { 
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
    currentTime.toLocaleString("en-US", { timeZone: cityInfo.timezone }),
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
      currentTime.toLocaleString("en-US", { timeZone: item.timezone }),
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
      night: compareDate.getHours() < 6 || compareDate.getHours() >= 22,
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
  
  const splitIdx = formattedTime.lastIndexOf(':')
  const hm = formattedTime.slice(0, splitIdx)
  const ss = formattedTime.slice(splitIdx)
  const cardTitle = "m-0 text-lg font-semibold tracking-[-0.02em]"
  const copyBtn = "inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-subtle transition-colors hover:border-ink hover:text-ink"
  const snippet = [
    "const date = new Date();",
    `const options = { timeZone: "${cityInfo.timezone}", hour: "2-digit", minute: "2-digit" };`,
    "const formatter = new Intl.DateTimeFormat('en-US', options);",
    "console.log(formatter.format(date));",
  ].join('\n')

  const readouts = [
    { key: 'timestamp', label: t('unixTimestamp'), value: timestamp.toString() },
    { key: 'utc', label: t('utcTime'), value: utcTime },
    { key: 'iso', label: t('isoFormat'), value: isoTime },
  ]

  const copyIcon = (k: string) =>
    copiedStates[k] ? <Check className="size-4 text-ok" /> : <Copy className="size-4" />

  return (
    <main>
      <PageIntro
        wide
        crumbs={[{ label: "Home", href: getLocalePath('/', locale) }, { label: localizedCityName }]}
        eyebrow={`${localizedCountryName} · ${cityInfo.timezone}`}
        title={t('pageTitle', { cityName: localizedCityName, countryName: localizedCountryName })}
        description={t('timezoneLabel', { timezone: cityInfo.timezone })}
      />

      {/* Live clock */}
      <Section top="clamp(8px,2vw,24px)">
        <div className={cn(cardClass, "overflow-hidden")}>
          <div className="p-[clamp(24px,3.4vw,44px)]">
            <div className={cn(monoLabel, "flex flex-wrap items-center gap-x-3 gap-y-1")}>
              <span className="tnum text-ink">{offsetString}</span>
              <span aria-hidden="true" className="opacity-45">/</span>
              <span>{cityInfo.timezone}</span>
              <span className="inline-flex items-center gap-2 normal-case tracking-normal">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-ok" />
                {accuracy.offset > 1000 ? (
                  <span>{t('clockOffset', { seconds: Math.round(accuracy.offset / 1000) })}</span>
                ) : (
                  <span>{t('clockSynchronized', { offset: Math.round(accuracy.offset) })}</span>
                )}
              </span>
              <span className="flex-1" />
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className={copyBtn}
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
            <div className="mt-[22px] flex h-[30px] items-end justify-between" aria-hidden="true">
              {Array.from({ length: 60 }, (_, i) => {
                const sec = currentTime.getSeconds()
                return (
                  <span
                    key={i}
                    className={cn("block w-0.5 rounded-[1px]", i === sec ? "bg-brand" : i < sec ? "bg-ink" : "bg-tick")}
                    style={{ height: i === sec ? 30 : i % 15 === 0 ? 22 : i % 5 === 0 ? 16 : 10 }}
                  />
                )
              })}
            </div>
            <div className="mt-[30px]" suppressHydrationWarning>
              <Eyebrow>{currentTime.toLocaleDateString(getLocaleCode(locale), { timeZone: cityInfo.timezone, weekday: "long" })}</Eyebrow>
              <div className="mt-2 text-[clamp(28px,4vw,48px)] font-medium leading-[1.05] tracking-[-0.035em]">{formattedDate}</div>
            </div>
          </div>
          <div className="px-[clamp(24px,3.4vw,44px)] pb-[clamp(24px,3.4vw,44px)]">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))" }}>
            {readouts.map((r) => (
              <div key={r.key} className="flex min-w-0 items-center justify-between gap-3 bg-surface px-[22px] py-[18px]">
                <div className="min-w-0">
                  <div className={monoLabel}>{r.label}</div>
                  <p className="tnum m-0 mt-1.5 break-words font-mono text-[15px]" suppressHydrationWarning>{r.value}</p>
                </div>
                <button type="button" onClick={() => copyToClipboard(r.value, r.key)} className={copyBtn} title={t('copyToClipboard')} aria-label={t('copyToClipboard')}>
                  {copyIcon(r.key)}
                </button>
              </div>
            ))}
          </div>
          </div>
        </div>
      </Section>

      {/* Sun + working hours */}
      <Section top="14px">
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))" }}>
          <div className={cn(cardClass, "min-w-0 rounded-[18px] px-[26px] pb-[26px] pt-6")}>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className={cardTitle}>{tHome('sections.sunriseSunset')}</h3>
              <span className={monoLabel}>{new Intl.RelativeTimeFormat(getLocaleCode(locale), { numeric: "auto" }).format(0, "day")}</span>
            </div>
            {sunTimes.isLoading ? (
              <p className="m-0 mt-5 text-sm text-subtle">Loading sun times…</p>
            ) : sunTimes.error ? (
              <p className="m-0 mt-5 text-sm text-subtle">{sunTimes.error}</p>
            ) : (
              <>
                {sunTimes.riseMin != null && sunTimes.setMin != null && (
                  <>
                    <div className="relative mt-6 h-2.5 rounded-full bg-night" aria-hidden="true">
                      <div
                        className="absolute top-0 h-full rounded-full bg-day"
                        style={{ left: `${(sunTimes.riseMin / 1440) * 100}%`, width: `${Math.max(0, (sunTimes.setMin - sunTimes.riseMin) / 14.4)}%` }}
                      />
                      <div
                        className="absolute -top-1 h-[18px] w-0.5 rounded-sm bg-brand"
                        style={{ left: `${((cityHour * 60 + cityLocalNow.getMinutes()) / 1440) * 100}%` }}
                      />
                    </div>
                    <div className="tnum mt-2 flex justify-between font-mono text-[10.5px] text-subtle" aria-hidden="true">
                      <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
                    </div>
                  </>
                )}
                <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-line">
                  {[
                    [tHome('labels.sunrise'), sunTimes.sunrise],
                    [tHome('labels.sunset'), sunTimes.sunset],
                    [t('sun.dayLength'), sunTimes.dayLength],
                  ].map(([label, value]) => (
                    <div key={label} className="min-w-0 border-l border-line px-4 py-4 first:border-l-0">
                      <div className={monoLabel}>{label}</div>
                      <div className="tnum mt-2 font-mono text-[clamp(22px,2.6vw,32px)] font-light tracking-[-0.03em]">{value ?? '—'}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className={cn(cardClass, "min-w-0 p-[22px]")}>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className={cardTitle}>{t('workingHours.title')}</h3>
              <span className={cn("rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[.08em]", isWithinBusinessHours ? "border-ok text-ok" : "border-line2 text-subtle")}>
                {isWithinBusinessHours ? t('workingHours.inBusiness') : t('workingHours.outOfBusiness')}
              </span>
            </div>
            <div className="relative mt-6" aria-hidden="true">
              <div className="flex h-7 gap-0.5">
                {Array.from({ length: 24 }, (_, h) => (
                  <div key={h} className={cn("flex-1 rounded-[3px]", h >= businessStartHour && h < businessEndHour ? "bg-ink" : "bg-line")} />
                ))}
              </div>
              <div
                className="absolute -top-1 h-9 w-0.5 rounded-sm bg-brand"
                style={{ left: `${((cityHour * 60 + cityLocalNow.getMinutes()) / 1440) * 100}%` }}
              />
            </div>
            <div className="tnum mt-2 flex justify-between font-mono text-[10.5px] text-subtle" aria-hidden="true">
              <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
            </div>
            <p className="m-0 mt-5 text-sm text-subtle">{t('workingHours.approximate')}</p>
          </div>
        </div>
      </Section>

      {/* Time comparison */}
      <Section>
        <SectionHeading title={t('timeComparisonSection.title')} />
        {timeComparisons.length === 0 ? (
          <p className="m-0 text-sm text-subtle">{t('timeComparisonSection.unavailable')}</p>
        ) : (
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,200px),1fr))" }}>
            {timeComparisons.map((item) => {
              const inner = (
                <>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0 truncate text-sm font-medium">{item.label}</span>
                    <span className={cn("shrink-0 font-mono text-[11.5px]", item.night ? "text-[rgba(236,236,232,.55)]" : "text-subtle")}>{item.diffLabel}</span>
                  </div>
                  <div className="tnum font-mono text-[30px] font-light leading-none tracking-[-0.05em]" suppressHydrationWarning>{item.timeLabel}</div>
                </>
              )
              const cls = cn("flex min-w-0 flex-col gap-3 rounded-xl border px-4 py-3.5", item.night ? "border-night bg-night text-[#ECECE8]" : "border-line bg-surface text-ink")
              return item.key === "local" ? (
                <div key={item.key} className={cls}>{inner}</div>
              ) : (
                <Link key={item.key} href={getLocalePath(`/cities/${item.key}`, locale)} className={cn(cls, "transition-opacity hover:opacity-80")}>{inner}</Link>
              )
            })}
          </div>
        )}
      </Section>

      {/* Holidays + developer snippet */}
      <Section>
        <div className="grid items-stretch gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))" }}>
          <div className={cn(cardClass, "min-w-0 overflow-hidden rounded-[18px]")}>
            <div className="flex items-baseline justify-between gap-3 px-6 pb-3.5 pt-[22px]">
              <h3 className={cardTitle}>{t('upcomingHolidays.title')}</h3>
              {holidayCountryCode && (
                <Link href={getLocalePath(`/holidays/${holidayCountryCode.toLowerCase()}`, locale)} className="text-[13px] text-subtle transition-colors hover:text-ink" title={`${t('upcomingHolidays.title')} - ${localizedCountryName}`}>
                  {t('upcomingHolidays.all')} →
                </Link>
              )}
            </div>
            {!holidayCountryCode ? (
              <p className="m-0 border-t border-line px-[22px] py-4 text-sm text-subtle">
                {t('upcomingHolidays.noDataForCountry', { country: localizedCountryName })}
              </p>
            ) : holidaysLoading ? (
              <p className="m-0 border-t border-line px-[22px] py-4 text-sm text-subtle">{t('upcomingHolidays.loading')}</p>
            ) : holidaysError ? (
              <p className="m-0 border-t border-line px-[22px] py-4 text-sm text-subtle">{holidaysError}</p>
            ) : upcomingHolidays.length === 0 ? (
              <p className="m-0 border-t border-line px-[22px] py-4 text-sm text-subtle">{t('upcomingHolidays.none')}</p>
            ) : (
              <ul className="m-0 list-none p-0">
                {upcomingHolidays.map((holiday, index) => {
                  const body = (
                    <>
                      <div className="w-12 shrink-0 text-center">
                        <div className="tnum font-mono text-2xl font-light leading-none tracking-[-0.04em]">{holiday.day}</div>
                        <div className="mt-1 font-mono text-[10.5px] uppercase tracking-[.08em] text-subtle">{holiday.month}</div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[15px] font-medium">{holiday.name}</div>
                        <div className="mt-0.5 text-[13px] text-subtle first-letter:uppercase">{holiday.rel}</div>
                      </div>
                      {holiday.slug && <span aria-hidden="true" className="text-subtle">→</span>}
                    </>
                  )
                  const cls = "flex items-center gap-4 border-t border-line px-6 py-3.5"
                  return (
                    <li key={`${holiday.name}-${holiday.day}-${holiday.month}-${index}`}>
                      {holiday.slug ? (
                        <Link href={holiday.slug} className={cn(cls, "transition-colors hover:bg-paper")} title={`${holiday.name} countdown`}>{body}</Link>
                      ) : (
                        <div className={cls}>{body}</div>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className={cn(cardClass, "flex min-w-0 flex-col rounded-[18px] px-6 pb-6 pt-[22px]")}>
            <div className="flex items-center justify-between gap-3">
              <h3 className={cardTitle}>{t('developerSnippet.title')}</h3>
              <button type="button" onClick={() => copyToClipboard(snippet, 'dev-snippet')} className="inline-flex size-[34px] items-center justify-center rounded-lg text-subtle transition-colors hover:bg-paper hover:text-ink" title={t('copyToClipboard')} aria-label={t('copyToClipboard')}>
                {copyIcon("dev-snippet")}
              </button>
            </div>
            <p className="m-0 mb-4 mt-1.5 text-sm text-subtle">{t('developerSnippet.description')}</p>
            <pre className="m-0 flex-1 overflow-auto whitespace-pre rounded-xl bg-foot px-5 py-[18px] text-left font-mono text-[13px] leading-[1.7] text-foot-ink">
              <code>{snippet}</code>
            </pre>
          </div>
        </div>
      </Section>

      {/* City Information */}
      <Section>
        <SectionHeading title={t('cityInfo')} description={t('timezoneInfo')} />
        <div className={cn(cardClass, "rounded-[18px] px-[26px] pb-3 pt-2.5")}>
         <div className="cl">
          {[
            [t('country'), localizedCountryName],
            [t('timezone'), cityInfo.timezone],
            [t('coordinates'), cityInfo.coordinates],
            [t('population'), cityInfo.population],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-6 border-t border-line py-3.5">
              <span className="text-sm text-subtle">{label}</span>
              <span className="min-w-0 break-words text-right font-mono text-sm">{value}</span>
            </div>
          ))}
         </div>
        </div>
      </Section>

      {/* FAQ */}
      <Faq
        title={t('faq')}
        items={cityFaqs.map((f) => ({ q: f.question, a: <p className="m-0">{f.answer}</p> }))}
      />

      {/* Language Links */}
      <Section className="pb-[clamp(56px,8vw,96px)]">
        <h3 className={cn(monoLabel, "mb-4")}>
          {t('pageTitle', { cityName: localizedCityName, countryName: localizedCountryName })} in Other Languages
        </h3>
        <div className="flex flex-wrap gap-2">
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
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                      locale === loc ? "border-ink bg-ink text-paper" : "border-line bg-surface text-ink hover:border-ink",
                    )}
                    title={translations[loc]}
                    hrefLang={loc}
                  >
                    {translations[loc]}
                    <span className="text-xs opacity-60">({languageNames[loc]})</span>
                  </Link>
                );
              })}
        </div>
      </Section>

      {/* Google AdSense Advertisement */}
      <Section top="clamp(24px,3vw,40px)">
        <AdSlot />
      </Section>

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
