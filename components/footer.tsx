"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Globe } from "lucide-react"
import { SocialLinks } from "./social-links"
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('common')
  const [currentTime, setCurrentTime] = useState(new Date())

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
        <Link href="/about" className="hover:text-gray-900 dark:hover:text-gray-200" title={t('links.titleAbout')}>About</Link>
        <Link href="/calendar/2025" className="hover:text-gray-900 dark:hover:text-gray-200" title={t('links.titleCalendar', { year: 2025 })}>Calendar 2025</Link>
        <Link href="/glossary" className="hover:text-gray-900 dark:hover:text-gray-200" title={t('links.titleGlossary')}>Glossary</Link>
        <Link href="/year-progress-bar" className="hover:text-gray-900 dark:hover:text-gray-200" title={t('links.titleYearProgress')}>Year Progress</Link>
        <Link href="/age-calculator" className="hover:text-gray-900 dark:hover:text-gray-200" title={t('links.titleAgeCalculator')}>Age Calculator</Link>
        <Link href="/holidays" className="hover:text-gray-900 dark:hover:text-gray-200" title={t('links.titleHolidays')}>Holidays</Link>
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500">
        <Link href="/utc" className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 font-mono" title={t('links.titleUtc')}>
          <Globe className="h-2.5 w-2.5" />
          <span>UTC: {utcTime} {utcDate}</span>
        </Link>
      </p>
    </footer>
  )
}
