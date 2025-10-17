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
    <div className="mt-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('worldTimezones')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
              className={`text-center py-3 px-4 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'bg-accent/50 hover:bg-accent text-primary font-medium'
              }`}
            >
              <div className="text-sm font-semibold">{timezone.abbreviation}</div>
              <div className="text-xs opacity-80 mt-1">
                {t(`names.${timezone.slug}`)}
              </div>
              <div className="text-xs opacity-70 mt-1 font-mono">
                {timezone.utcOffset}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}