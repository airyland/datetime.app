"use client"

import { useEffect, useState, use } from "react"
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  Clock, 
  Globe, 
  MapPin, 
  Users, 
  Copy, 
  Check, 
  ArrowLeft,
  Calendar,
  Sun,
  Moon,
  Info
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { JetBrains_Mono } from "next/font/google"
import { 
  getTimezoneById, 
  getCurrentTimeForTimezone,
  getUtcOffsetMinutes,
  ianaTimezones,
  searchTimezones
} from '@/lib/iana-timezones'

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

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

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center border-b">
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

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            href={`/${locale}/iana-timezones`}
            className="inline-flex items-center gap-2 text-primary hover:underline"
            title={t('backToTimezones')}
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToTimezones')}
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">
                {timezone.name}
              </h1>
              <Badge variant="outline" className="text-lg px-3 py-1 shrink-0">
                {timezone.abbreviation}
              </Badge>
            </div>
            {showTimezoneId && (
              <div className="text-lg md:text-xl text-muted-foreground font-mono">
                {timezone.id}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-4 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{timezone.city}, {timezone.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>{timezone.utcOffset}</span>
            </div>
            {timezone.population && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{(timezone.population / 1000000).toFixed(1)}M people</span>
              </div>
            )}
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('description', { 
              timezone: showTimezoneId ? `${timezone.name} (${timezone.id})` : timezone.name, 
              city: timezone.city 
            })}
          </p>
        </div>

        {/* Main Time Display */}
        <Card className="mb-8 max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {t('currentTime')}
              </div>
              
              <div className={`text-6xl md:text-8xl font-bold ${jetbrainsMono.className}`}>
                {currentTime.time}
              </div>
              
              <div className="text-lg text-muted-foreground">
                {currentTime.formattedDateTime}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timezone Information */}
        <div className="max-w-4xl mx-auto mb-8 space-y-8">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  {t('basicInfo.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">{t('basicInfo.iana')}</div>
                  <div className="font-mono text-sm">{timezone.id}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{t('basicInfo.region')}</div>
                  <div>{t(`regions.${timezone.region.toLowerCase()}`)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{t('basicInfo.country')}</div>
                  <div>{timezone.country} ({timezone.countryCode})</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{t('basicInfo.city')}</div>
                  <div>{timezone.city}</div>
                </div>
                {timezone.coordinates && (
                  <div>
                    <div className="text-sm text-muted-foreground">{t('basicInfo.coordinates')}</div>
                    <div className="font-mono text-sm">
                      {timezone.coordinates.lat}°N, {timezone.coordinates.lng}°E
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {t('timeInfo.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">{t('timeInfo.utcOffset')}</div>
                  <div className="font-mono">{timezone.utcOffset}</div>
                </div>
                {timezone.dstOffset && (
                  <div>
                    <div className="text-sm text-muted-foreground">{t('timeInfo.dstOffset')}</div>
                    <div className="font-mono">{timezone.dstOffset}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-muted-foreground">{t('timeInfo.abbreviation')}</div>
                  <div>{timezone.abbreviation}</div>
                </div>
                {timezone.dstAbbreviation && (
                  <div>
                    <div className="text-sm text-muted-foreground">{t('timeInfo.dstAbbreviation')}</div>
                    <div>{timezone.dstAbbreviation}</div>
                  </div>
                )}
                {timezone.population && (
                  <div>
                    <div className="text-sm text-muted-foreground">{t('timeInfo.population')}</div>
                    <div>{timezone.population.toLocaleString()}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Time Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>{t('comparison.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {timeComparisons.map((comparison, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div className="font-medium">{comparison.name}</div>
                    <div className="text-sm text-muted-foreground">{comparison.diff}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time Formats */}
          <Card>
            <CardHeader>
              <CardTitle>{t('formats.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {[
                  { label: t('formats.iso8601'), value: new Date().toISOString(), type: 'iso' },
                  { label: t('formats.unix'), value: Math.floor(Date.now() / 1000).toString(), type: 'unix' },
                  { label: t('formats.rfc2822'), value: new Date().toUTCString(), type: 'rfc' },
                  { label: t('formats.local'), value: currentTime.formattedDateTime, type: 'local' }
                ].map((format) => (
                  <div key={format.type} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{format.label}</div>
                      <div className={`text-sm text-muted-foreground font-mono ${jetbrainsMono.className}`}>
                        {format.value}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(format.value, format.type)}
                    >
                      {copiedStates[format.type] ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related Timezones */}
          <Card>
            <CardHeader>
              <CardTitle>{t('related.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {relatedTimezones.map((relatedTz) => {
                  const relatedTime = getCurrentTimeForTimezone(relatedTz.id);
                  return (
                    <Link
                      key={relatedTz.id}
                      href={`/iana-timezones/${encodeURIComponent(relatedTz.id)}`}
                      className="flex justify-between items-center p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div>
                        <div className="font-medium">{relatedTz.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {relatedTz.city}, {relatedTz.country}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-mono ${jetbrainsMono.className}`}>
                          {relatedTime.time}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {relatedTz.utcOffset}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="max-w-4xl mx-auto mb-8">
          <CardHeader>
            <CardTitle>{t('faq.title', { timezone: timezoneDisplayName })}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('seo.about.title', { timezone: timezoneDisplayName })}</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>{t('seo.about.content', { 
                timezone: timezoneDisplayName,
                city: timezone.city,
                country: timezone.country,
                offset: timezone.utcOffset
              })}</p>
            </CardContent>
          </Card>
        </div>
      </div>

    </main>
  );
}