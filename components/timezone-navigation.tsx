"use client"

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { timezones } from '@/app/[locale]/timezones/config'
import { DEFAULT_LOCALE, LOCALE_PREFIXES } from '@/lib/locales'

interface TimezoneNavigationProps {
  currentTimezone?: string
}

export function TimezoneNavigation({ currentTimezone }: TimezoneNavigationProps) {
  const t = useTranslations('timezones')
  const pathname = usePathname()
  
  // Get current locale from pathname more reliably
  const getCurrentLocale = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    if (pathSegments.length > 0 && LOCALE_PREFIXES.includes(pathSegments[0] as typeof LOCALE_PREFIXES[number])) {
      return pathSegments[0]
    }
    return DEFAULT_LOCALE
  }
  
  const locale = getCurrentLocale()
  
  // Add UTC as special case
  const utcTimezone = {
    slug: 'utc',
    name: 'Coordinated Universal Time',
    abbreviation: 'UTC',
    ianaTz: 'UTC',
    utcOffset: 'UTC+0',
    description: 'World time standard'
  }
  
  const allTimezones = [utcTimezone, ...timezones]
  
  return (
    <section className="mx-auto mt-[clamp(56px,8vw,96px)] w-full max-w-[1200px]">
      <h2 className="m-0 mb-6 text-[clamp(24px,2.6vw,32px)] font-semibold leading-[1.15] tracking-[-0.025em]">{t('worldTimezones')}</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,164px),1fr))] gap-2.5">
        {allTimezones.map((timezone) => {
          const isActive = currentTimezone === timezone.slug

          // Special handling for UTC
          let href
          if (timezone.slug === 'utc') {
            href = locale === DEFAULT_LOCALE ? '/utc' : `/${locale}/utc`
          } else {
            href = locale === DEFAULT_LOCALE
              ? `/timezones/${timezone.slug}`
              : `/${locale}/timezones/${timezone.slug}`
          }

          return (
            <Link
              key={timezone.slug}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-w-0 flex-col gap-1 rounded-xl border px-3.5 py-3 transition-colors ${
                isActive
                  ? 'border-ink bg-ink text-paper'
                  : 'border-line bg-surface text-ink hover:border-ink'
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-xs font-medium tracking-[.04em]">{timezone.abbreviation}</span>
                <span className={`font-mono text-[10.5px] tracking-[.06em] ${isActive ? 'opacity-70' : 'text-subtle'}`}>
                  {timezone.utcOffset}
                </span>
              </div>
              <div className={`truncate text-[13px] ${isActive ? 'opacity-80' : 'text-subtle'}`}>
                {t(`names.${timezone.slug}`)}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
