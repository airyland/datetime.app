import { Metadata } from 'next'
import Link from 'next/link'
import { Globe, ArrowLeftRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import HeaderClient from '../year-progress-bar/header-client'
import { citiesData } from '../cities/[city]/metadata'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'timeDifference' })
  return {
    title: 'Time Difference Calculator | Compare Time Zones | Datetime.app',
    description:
      'Compare time differences between major cities worldwide. Find out the hours between New York and London, Tokyo and Los Angeles, and more.',
    keywords: [
      'time difference',
      'time zone calculator',
      'compare time zones',
      'city time difference',
      'world clock',
    ],
    openGraph: {
      title: 'Time Difference Calculator | Compare Time Zones | Datetime.app',
      description:
        'Compare time differences between major cities worldwide.',
      type: 'website',
    },
  }
}

// Popular city pairs to feature on the index page
const POPULAR_PAIRS: [string, string][] = [
  ['new-york', 'london'],
  ['new-york', 'tokyo'],
  ['london', 'tokyo'],
  ['los-angeles', 'london'],
  ['sydney', 'london'],
  ['dubai', 'new-york'],
  ['singapore', 'london'],
  ['paris', 'new-york'],
  ['shanghai', 'san-francisco'],
  ['mumbai', 'new-york'],
]

const getTimezoneOffset = (timezone: string): number => {
  const now = new Date()
  const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }))
  const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
  return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60)
}

export default async function TimeDifferencePage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'timeDifference' })

  function formatHourDiff(diff: number): string {
    const abs = Math.abs(diff)
    if (abs === 0) return t('sameTime')
    if (Number.isInteger(abs)) {
      return abs === 1
        ? t('hourDifference', { count: abs })
        : t('hoursDifference', { count: abs })
    }
    // Handle 30-min and 45-min offsets (e.g. India +5:30)
    const hours = Math.floor(abs)
    const minutes = Math.round((abs - hours) * 60)
    if (minutes === 0) {
      return hours === 1
        ? t('hourDifference', { count: hours })
        : t('hoursDifference', { count: hours })
    }
    return t('hourMinDifference', { hours, minutes })
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <HeaderClient />

      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
              {t('pageTitle')}
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              {t('subtitle')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {POPULAR_PAIRS.map(([cityAKey, cityBKey]) => {
                const cityA = citiesData[cityAKey as keyof typeof citiesData]
                const cityB = citiesData[cityBKey as keyof typeof citiesData]
                if (!cityA || !cityB) return null

                const offsetA = getTimezoneOffset(cityA.timezone)
                const offsetB = getTimezoneOffset(cityB.timezone)
                const diff = Math.abs(offsetA - offsetB)
                const slug = `${cityAKey}-vs-${cityBKey}`

                return (
                  <Link
                    key={slug}
                    href={`/${locale}/time-difference/${slug}`}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="pt-5 pb-4 px-5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="font-medium truncate">
                              {cityA.name}
                            </span>
                          </div>
                          <ArrowLeftRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="font-medium truncate">
                              {cityB.name}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                          {formatHourDiff(diff)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
