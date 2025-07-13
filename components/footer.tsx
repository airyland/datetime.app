"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Globe } from "lucide-react"
import { SocialLinks } from "./social-links"
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

export function Footer() {
  const t = useTranslations('common')
  const params = useParams()
  const locale = params.locale as string
  const [currentTime, setCurrentTime] = useState(new Date())

  // Helper function to build localized URLs
  const getLocalizedPath = (path: string) => {
    return locale === 'en' ? path : `/${locale}${path}`
  }

  // Update UTC time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Format UTC time as HH:MM:SS
  const utcTime = currentTime.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  // Format UTC date
  const utcDate = currentTime.toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const currentYear = new Date().getFullYear()

  return (
    <footer className="container mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400 mt-16">
      <SocialLinks />
      <p className="mb-2">{currentYear} datetime.app - Precise World Time</p>
      <p className="space-x-4 mb-3">
        <Link href={getLocalizedPath("/about")} className="hover:text-gray-900 dark:hover:text-gray-200" title={t('links.titleAbout')}>About</Link>
        <Link href={getLocalizedPath("/calendar/2025")} className="hover:text-gray-900 dark:hover:text-gray-200" title={t('links.titleCalendar', { year: 2025 })}>Calendar 2025</Link>
        <Link href={getLocalizedPath("/glossary")} className="hover:text-gray-900 dark:hover:text-gray-200" title={t('links.titleGlossary')}>Glossary</Link>
        <Link href={getLocalizedPath("/year-progress-bar")} className="hover:text-gray-900 dark:hover:text-gray-200" title={t('links.titleYearProgress')}>Year Progress</Link>
        <Link href={getLocalizedPath("/age-calculator")} className="hover:text-gray-900 dark:hover:text-gray-200" title={t('links.titleAgeCalculator')}>Age Calculator</Link>
        <Link href="/holidays" className="hover:text-gray-900 dark:hover:text-gray-200" title={t('links.titleHolidays')}>Holidays</Link>
        <Link href={getLocalizedPath("/iana-timezones")} className="hover:text-gray-900 dark:hover:text-gray-200" title={t('links.titleTimezones')}>Timezones</Link>
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500">
        <Link href={getLocalizedPath("/utc")} className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 font-mono" title={t('links.titleUtc')}>
          <Globe className="h-2.5 w-2.5" />
          <span>UTC: {utcTime} {utcDate}</span>
        </Link>
      </p>
    </footer>
  )
}
