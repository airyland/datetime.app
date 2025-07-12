"use client"

import { useEffect, useState, use } from "react"
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Globe, Clock, AlertCircle, Copy, Check, Maximize2, Github } from 'lucide-react'
import { locales } from '@/i18n/request'
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

interface CityPageProps {
  params: { city: string; locale: string };
}

export default function CityPage({ params }: CityPageProps) {
  const resolvedParams = use(params)
  const city = resolvedParams.city;
  const locale = resolvedParams.locale;
  const t = useTranslations('cities')
  const tCommon = useTranslations('common')
  const cityInfo = citiesData[city as keyof typeof citiesData];
  
  // Get localized city and country names
  const getLocalizedCityName = (cityKey: string) => {
    if (locale === 'zh-hans' || locale === 'zh-hant') {
      return t(`cityNames.${cityKey}`) || cityInfo.name;
    }
    return cityInfo.name;
  };
  
  const getLocalizedCountryName = (countryName: string) => {
    if (locale === 'zh-hans' || locale === 'zh-hant') {
      return t(`countryNames.${countryName}`) || countryName;
    }
    return countryName;
  };
  
  const localizedCityName = getLocalizedCityName(city);
  const localizedCountryName = getLocalizedCountryName(cityInfo.country);
  const [currentTime, setCurrentTime] = useState(new Date())
  const [accuracy, setAccuracy] = useState({ offset: 0, latency: 0 })
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({})
  const [isFullscreen, setIsFullscreen] = useState(false)
  
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

  // Format time as HH:MM:SS
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    timeZone: cityInfo.timezone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  // Format date
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    timeZone: cityInfo.timezone,
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

  const cityFaqs = [
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
        <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity" title={tCommon('links.titleHome')}>
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
              {t('pageTitle', { cityName: localizedCityName })}
            </h1>
            <h2 className="text-xl md:text-2xl font-medium mb-2 text-muted-foreground">
              {t('timezoneLabel', { timezone: cityInfo.timezone })}
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
          </div>
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
              {t('pageTitle', { cityName: localizedCityName })} in Other Languages
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
