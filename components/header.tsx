"use client"

import Link from "next/link"
import { useTranslations, useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowRight, Menu, X } from 'lucide-react'
import { getLocalePath } from '@/lib/locale-utils'
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"

/** The logo clock: hands follow the visitor's local time (shows 4:00 until mounted, matching the static markup). */
export function BrandMark({ className = "size-[22px]" }: { className?: string }) {
  const [angles, setAngles] = useState({ h: 120, m: 0 })
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const m = d.getMinutes() + d.getSeconds() / 60
      setAngles({ h: ((d.getHours() % 12) + m / 60) * 30, m: m * 6 })
    }
    tick()
    const t = setInterval(tick, 5000)
    return () => clearInterval(t)
  }, [])
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9.25" />
      <path d="M12 12V6.5" transform={`rotate(${angles.m} 12 12)`} style={{ transition: "transform .6s cubic-bezier(.4,2,.5,1)" }} />
      <path d="M12 12V7.8" stroke="var(--accent)" transform={`rotate(${angles.h} 12 12)`} style={{ transition: "transform .6s cubic-bezier(.4,2,.5,1)" }} />
    </svg>
  )
}

export default function Header() {
  const commonT = useTranslations('common')
  const locale = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  // English-only sections: no language choice
  const englishOnly = /^(\/[a-z-]+)?\/countdown(\/|$)/.test(pathname)
  const year = new Date().getFullYear()

  const links = [
    { href: "/utc", label: commonT('nav.utc'), title: commonT('links.titleUtc') },
    { href: `/calendar/${year}`, label: `${commonT('nav.calendar')} ${year}`, title: commonT('links.titleCalendar', { year }) },
    { href: "/holidays", label: commonT('nav.holidays'), title: commonT('links.titleHolidays') },
    { href: "/iana-timezones", label: commonT('nav.timezones'), title: commonT('links.titleTimezones') },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface shadow-[0_1px_0_rgba(16,17,20,.02),0_8px_24px_-16px_rgba(16,17,20,.12)]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-6 gap-y-3 px-[clamp(16px,4vw,40px)] py-3.5">
        <Link href={getLocalePath("/", locale)} title={commonT('links.titleHome')} className="inline-flex items-center gap-2.5 text-[17px] font-semibold tracking-[-0.015em] text-ink">
          <BrandMark />
          <span>Datetime<span className="font-normal text-subtle">.app</span></span>
        </Link>

        <nav aria-label="Main" className="ml-8 hidden flex-1 items-center gap-8 text-sm font-medium md:flex">
          {links.map((l) => (
            <Link key={l.href} href={getLocalePath(l.href, locale)} title={l.title} className="text-subtle transition-colors hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {!englishOnly && <LanguageSwitcher />}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label="Menu"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line transition-colors hover:border-line2 hover:bg-paper md:hidden"
          >
            {menuOpen ? <X className="size-[17px]" aria-hidden="true" /> : <Menu className="size-[17px]" aria-hidden="true" />}
          </button>
          <ThemeToggle />
        </div>

        {menuOpen && (
          <nav aria-label="Mobile" className="mt-0.5 flex basis-full flex-col border-t border-line pt-1.5 md:hidden">
            {links.map((l) => (
              <Link
                key={l.href}
                href={getLocalePath(l.href, locale)}
                title={l.title}
                onClick={() => setMenuOpen(false)}
                className="flex h-[46px] items-center justify-between border-b border-line text-[15px] font-medium text-ink last:border-b-0"
              >
                {l.label}
                <ArrowRight className="size-4 text-subtle" aria-hidden="true" />
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
