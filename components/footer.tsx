"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { SocialLinks } from "./social-links"
import { BrandMark } from "./header"
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const pad = (n: number) => String(n).padStart(2, '0')

const colLabel = "mb-3 font-mono text-[11.5px] uppercase tracking-[.08em] text-foot-muted"
const link = "text-foot-muted transition-colors hover:text-foot-ink"

export function Footer() {
  const t = useTranslations('common')
  const params = useParams()
  const locale = params.locale as string
  const [now, setNow] = useState<Date | null>(null)

  const getLocalizedPath = (path: string) => (locale === 'en' ? path : `/${locale}${path}`)

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const year = now ? now.getUTCFullYear() : new Date().getFullYear()
  const dayMs = 86400000
  const startOfYear = Date.UTC(year, 0, 1)
  const daysInYear = Math.round((Date.UTC(year + 1, 0, 1) - startOfYear) / dayMs)
  const doy = now ? Math.floor((Date.UTC(year, now.getUTCMonth(), now.getUTCDate()) - startOfYear) / dayMs) + 1 : 0

  const dots = useMemo(() => {
    const lead = new Date(startOfYear).getUTCDay()
    const cols = Math.ceil((lead + daysInYear) / 7)
    const out: { key: number; title: string; kind: 'none' | 'past' | 'today' | 'future'; }[] = []
    for (let i = 0; i < cols * 7; i++) {
      const n = i - lead + 1
      if (n < 1 || n > daysInYear) { out.push({ key: i, title: '', kind: 'none' }); continue }
      const dt = new Date(Date.UTC(year, 0, n))
      out.push({ key: i, title: `${MON[dt.getUTCMonth()]} ${dt.getUTCDate()}`, kind: !doy ? 'future' : n === doy ? 'today' : n < doy ? 'past' : 'future' })
    }
    return out
  }, [year, startOfYear, daysInYear, doy])

  const hm = now ? `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}` : '--:--'
  const ss = now ? pad(now.getUTCSeconds()) : '--'
  const utcDate = now ? `${MON[now.getUTCMonth()]} ${now.getUTCDate()}, ${now.getUTCFullYear()}` : ''
  const secLeft = now ? 86400 - (now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds()) : 0
  const toMidnight = now ? `${pad(Math.floor(secLeft / 3600))}:${pad(Math.floor((secLeft % 3600) / 60))}:${pad(secLeft % 60)}` : '--:--:--'

  return (
    <footer className="mt-[clamp(72px,10vw,128px)] bg-foot text-foot-ink">
      <div className="mx-auto max-w-[1200px] px-[clamp(16px,4vw,40px)] pb-8 pt-[clamp(40px,6vw,72px)]">
        {/* Brand + UTC clock */}
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-7">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[17px] font-semibold tracking-[-0.015em]">
              <BrandMark />
              <span>Datetime<span className="font-normal text-foot-muted">.app</span></span>
            </div>
            <p className="mb-5 mt-2.5 text-sm text-foot-muted">Precise World Time</p>
            <SocialLinks />
          </div>
          <Link href={getLocalizedPath("/utc")} title={t('links.titleUtc')} className="block text-right text-foot-ink">
            <div className="font-mono text-[11.5px] uppercase tracking-[.08em] text-foot-muted">UTC · {utcDate || ' '}</div>
            <div className="tnum mt-2 whitespace-nowrap font-mono text-[clamp(40px,6vw,76px)] font-light leading-none tracking-[-0.055em]">
              {hm}<span className="text-brand">:{ss}</span>
            </div>
          </Link>
        </div>

        {/* Year dot matrix */}
        <div className="mt-[clamp(36px,5vw,56px)]">
          <div className="mb-3.5 flex flex-wrap justify-between gap-x-6 gap-y-1.5 font-mono text-[11.5px] uppercase tracking-[.08em] text-foot-muted">
            <span>{year} · one dot, one day</span>
            <span>
              <span className="text-foot-ink">{now ? daysInYear - doy : '—'}</span> days left · next midnight in{' '}
              <span className="tnum text-foot-ink">{toMidnight}</span>
            </span>
          </div>
          <div aria-hidden="true" className="grid grid-flow-col grid-rows-[repeat(7,auto)] auto-cols-fr">
            {dots.map((d) => (
              <div key={d.key} title={d.title} className="flex aspect-square items-center justify-center">
                {d.kind !== 'none' && (
                  <span
                    className="block rounded-full"
                    style={{
                      width: d.kind === 'today' ? '62%' : '40%',
                      height: d.kind === 'today' ? '62%' : '40%',
                      background: d.kind === 'today' ? 'var(--accent)' : d.kind === 'past' ? 'var(--f-ink)' : 'transparent',
                      boxShadow: d.kind === 'future' ? 'inset 0 0 0 1px var(--f-line)' : 'none',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <nav aria-label="Footer" className="mt-[clamp(40px,6vw,64px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-x-8 gap-y-7 border-t border-foot-line pt-8 text-sm">
          <div>
            <div className={colLabel}>Explore</div>
            <ul className="flex flex-col gap-[9px]">
              <li><Link className={link} href={getLocalizedPath("/utc")} title={t('links.titleUtc')}>{t('nav.utc')}</Link></li>
              <li><Link className={link} href={getLocalizedPath(`/calendar/${year}`)} title={t('links.titleCalendar', { year })}>{t('nav.calendar')} {year}</Link></li>
              <li><Link className={link} href={getLocalizedPath("/holidays")} title={t('links.titleHolidays')}>{t('nav.holidays')}</Link></li>
              <li><Link className={link} href="/countdown" title="Holiday countdowns">Countdown</Link></li>
              <li><Link className={link} href={getLocalizedPath("/iana-timezones")} title={t('links.titleTimezones')}>{t('nav.timezones')}</Link></li>
            </ul>
          </div>
          <div>
            <div className={colLabel}>Tools</div>
            <ul className="flex flex-col gap-[9px]">
              <li><Link className={link} href={getLocalizedPath("/year-progress-bar")} title={t('links.titleYearProgress')}>{t('nav.yearProgress')}</Link></li>
              <li><Link className={link} href={getLocalizedPath("/age-calculator")} title={t('links.titleAgeCalculator')}>{t('nav.ageCalculator')}</Link></li>
              <li><Link className={link} href="/alarm" title="Online alarm clock">Alarm</Link></li>
              <li><Link className={link} href={getLocalizedPath("/glossary")} title={t('links.titleGlossary')}>{t('nav.glossary')}</Link></li>
            </ul>
          </div>
          <div>
            <div className={colLabel}>Project</div>
            <ul className="flex flex-col gap-[9px]">
              <li><Link className={link} href={getLocalizedPath("/about")} title={t('links.titleAbout')}>About</Link></li>
              <li><Link className={link} href={getLocalizedPath("/changelog")} title="View changelog and updates">Changelog</Link></li>
              <li><Link className={link} href={getLocalizedPath("/privacy")} title="Privacy policy">Privacy</Link></li>
              <li><Link className={link} href={getLocalizedPath("/terms")} title="Terms of service">Terms</Link></li>
              <li><Link className={link} href={getLocalizedPath("/embed")} title="Embed Datetime">Embed</Link></li>
              <li><a className={link} href="https://status.datetime.app" target="_blank" rel="noopener noreferrer" title="Service status">Status ↗</a></li>
              <li><a className={link} href="https://a.coffee/becool" target="_blank" rel="noopener noreferrer" title="More Products">More products ↗</a></li>
            </ul>
          </div>
        </nav>

        <div className="mt-10 text-[12.5px] text-foot-muted">© {year} datetime.app</div>
      </div>
    </footer>
  )
}
