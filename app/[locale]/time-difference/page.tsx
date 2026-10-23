import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeftRight } from 'lucide-react'
import { PageIntro, Section, cardClass } from '@/components/ds'
import { getLocalePath } from '@/lib/locale-utils'
import { citiesData } from '../cities/[city]/metadata'
import { getTranslations } from 'next-intl/server'
import { pageAlternates } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'timeDifference' })
  return {
    alternates: pageAlternates('time-difference', locale),
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
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
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
    <>
      <PageIntro
        crumbs={[{ label: 'Home', href: getLocalePath('/', locale) }, { label: t('pageTitle') }]}
        eyebrow={t('pageTitle')}
        eyebrowAs="p"
        title={t('pageTitle')}
        description={t('subtitle')}
      />
      <Section top="clamp(24px,3vw,40px)" className="pb-[clamp(56px,8vw,96px)]">
        <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,340px),1fr))' }}>
          {POPULAR_PAIRS.map(([cityAKey, cityBKey]) => {
            const cityA = citiesData[cityAKey as keyof typeof citiesData]
            const cityB = citiesData[cityBKey as keyof typeof citiesData]
            if (!cityA || !cityB) return null

            const diff = Math.abs(getTimezoneOffset(cityA.timezone) - getTimezoneOffset(cityB.timezone))
            const slug = `${cityAKey}-vs-${cityBKey}`

            return (
              <Link
                key={slug}
                href={getLocalePath(`/time-difference/${slug}`, locale)}
                className={`${cardClass} block p-[22px] transition-colors hover:border-ink`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-lg font-semibold tracking-[-0.015em]">{cityA.name}</span>
                  <ArrowLeftRight aria-hidden="true" className="size-4 shrink-0 text-subtle" />
                  <span className="min-w-0 truncate text-right text-lg font-semibold tracking-[-0.015em]">{cityB.name}</span>
                </div>
                <p className="m-0 mt-3 font-mono text-[13px] text-brand">{formatHourDiff(diff)}</p>
              </Link>
            )
          })}
        </div>
      </Section>
    </>
  )
}
