import { notFound } from 'next/navigation'
import { ArrowLink, CardList, Faq, PageIntro, Pill, RowLink, Section, SectionHeading, Stat, StatGrid, cardClass, monoLabel } from "@/components/ds"
import { getLocalePath } from "@/lib/locale-utils"
import { calculateYearProgress, calculateTimeLeft, calculateTimeLeftData, formatTimeLeft, getYearStatus } from "@/lib/year-progress"
import YearProgressClient from "../year-progress-client"
import { getTranslations } from 'next-intl/server'

interface YearProgressBarProps {
  params: Promise<{ year: string; locale: string }>
}

export default async function YearProgressBarWithYear({ params }: YearProgressBarProps) {
  const resolvedParams = await params
  const yearParam = parseInt(resolvedParams.year)
  const { locale } = resolvedParams
  const t = await getTranslations({ locale, namespace: 'yearProgress' })

  // Validate year parameter (limit to ±15 years from current year)
  const currentYear = new Date().getFullYear()
  const minYear = currentYear - 15
  const maxYear = currentYear + 15

  if (isNaN(yearParam) || yearParam < minYear || yearParam > maxYear) {
    notFound()
  }

  // Calculate initial values on the server
  const now = new Date()
  const initialProgress = calculateYearProgress(now, yearParam)
  const initialTimeLeft = calculateTimeLeft(now, yearParam)
  const { isCurrentYear, isCompleted, isFuture } = getYearStatus(now, yearParam)
  
  
  // Calculate initial time left data for translation
  const timeLeftData = calculateTimeLeftData(now, yearParam)
  const initialTimeLeftTranslated = formatTimeLeft(timeLeftData, (key: string, params?: any) => {
    const count = params?.count || 0
    switch (key) {
      case 'yearCompleted': return t('yearCompleted')
      case 'yearNotStarted': return t('yearNotStarted')
      case 'timeLeftMonths': return t('timeLeftMonths', { count })
      case 'timeLeftDays': return t('timeLeftDays', { count })
      case 'timeLeftHours': return t('timeLeftHours', { count })
      case 'timeLeftMinutes': return t('timeLeftMinutes', { count })
      case 'timeLeftSeconds': return t('timeLeftSeconds', { count })
      case 'left': return t('left')
      default: return key
    }
  })

  // Calculate year statistics
  const isLeapYear = (yearParam % 4 === 0 && yearParam % 100 !== 0) || (yearParam % 400 === 0)
  const daysInYear = isLeapYear ? 366 : 365
  const weeksInYear = Math.ceil(daysInYear / 7)
  const monthsInYear = 12
  
  // Calculate comparison with current year
  const currentYearProgress = calculateYearProgress(now, currentYear)
  const progressDifference = initialProgress - currentYearProgress

  // FAQs about year progress
  const yearProgressFaqs = [
    {
      question: t('faqs.howCalculated.question'),
      answer: t('faqs.howCalculated.answer')
    },
    {
      question: t('faqs.isAccurate.question'),
      answer: t('faqs.isAccurate.answer')
    },
    {
      question: t('faqs.differentYear.question'),
      answer: t('faqs.differentYear.answer')
    },
    {
      question: t('faqs.whyTrack.question'),
      answer: t('faqs.whyTrack.answer')
    }
  ]

  const yearHref = (y: number) => getLocalePath(`/year-progress-bar/${y}`, locale)

  return (
    <>
      <PageIntro
        crumbs={[
          { label: "Home", href: getLocalePath("/", locale) },
          { label: t('title'), href: getLocalePath("/year-progress-bar", locale) },
          { label: yearParam },
        ]}
        eyebrow={t('title')}
        title={t('pageTitle', { year: yearParam })}
        description={
          isCurrentYear ? (
            <span dangerouslySetInnerHTML={{ __html: t('subtitle', { year: yearParam, progress: `<strong class="font-medium text-ink">${initialProgress.toFixed(2)}</strong>` }) }} />
          ) : isCompleted ? (
            t('yearCompleted') || "This year has been completed"
          ) : (
            t('yearNotStarted') || "This year hasn't started yet"
          )
        }
        right={
          <ArrowLink href={getLocalePath("/year-progress-bar", locale)} title={t('backToCurrent') || 'Back to Current Year'}>
            {t('backToCurrent') || 'Back to Current Year'}
          </ArrowLink>
        }
      />

      <Section top="clamp(8px,2vw,24px)">
        <div className={`${cardClass} p-[clamp(22px,3.4vw,44px)]`}>
          <div className={`flex flex-wrap items-center justify-between gap-x-6 gap-y-2.5 ${monoLabel}`}>
            <h2 className="m-0 font-[inherit] text-[length:inherit] font-normal tracking-[inherit]">{t('progressTitle')} {yearParam}</h2>
            <span className="text-ink">{isLeapYear ? t('leapYearType') : t('regularYearType')} &middot; {daysInYear}</span>
          </div>
          {/* Live updates only for the current year; static otherwise */}
          <YearProgressClient
            initialProgress={initialProgress}
            initialTimeLeft={initialTimeLeftTranslated}
            currentYear={yearParam}
            live={isCurrentYear}
          />
        </div>

        {/* Year Comparison with Current Year */}
        {!isCurrentYear && (
          <div className={`${cardClass} mt-5 p-[clamp(22px,3vw,32px)]`}>
            <h2 className={`m-0 font-normal ${monoLabel}`}>{t('comparisonTitle') || 'Comparison with Current Year'}</h2>
            <div className="mt-5 grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))" }}>
              {[{ y: currentYear, v: currentYearProgress, bar: "bg-ink" }, { y: yearParam, v: initialProgress, bar: "bg-brand" }].map((r) => (
                <div key={r.y}>
                  <div className="flex items-baseline justify-between gap-3 text-sm text-subtle">
                    <span>{r.y} {t('progressTitle')}</span>
                    <span className="tnum font-mono text-ink">{r.v.toFixed(2)}%</span>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-[3px] bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(r.v)} aria-label={`${r.y} ${t('progressTitle')}`}>
                    <div className={`h-full ${r.bar}`} style={{ width: `${r.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="m-0 mt-5 border-t border-line pt-4 text-sm text-subtle">
              {progressDifference > 0 ? (
                t('yearAhead', { year: yearParam, diff: progressDifference.toFixed(2) }) || `${yearParam} is ${progressDifference.toFixed(2)}% ahead of ${currentYear}`
              ) : (
                t('yearBehind', { year: yearParam, diff: Math.abs(progressDifference).toFixed(2) }) || `${yearParam} is ${Math.abs(progressDifference).toFixed(2)}% behind ${currentYear}`
              )}
            </p>
          </div>
        )}

        {/* Year Statistics */}
        <div className="mt-5">
          <h2 className={`m-0 mb-3 ${monoLabel}`}>{t('yearStatistics') || 'Year Statistics'}</h2>
          <StatGrid min={220}>
            <Stat label={t('days') || 'Days'} value={daysInYear} />
            <Stat label={t('weeks') || 'Weeks'} value={weeksInYear} />
            <Stat label={t('months') || 'Months'} value={monthsInYear} />
          </StatGrid>
          {isLeapYear && (
            <p className="m-0 mt-4 text-sm text-subtle">{t('leapYear', { year: yearParam }) || `${yearParam} is a leap year`}</p>
          )}
        </div>
      </Section>

      {/* Related Tools */}
      <Section>
        <SectionHeading title={t('relatedTools') || 'Related Tools'} />
        <CardList>
          <RowLink href={getLocalePath(`/calendar/${yearParam}`, locale)} title={t('viewFullCalendar') || 'View the full calendar for this year'} label={`${t('calendar') || 'Calendar'} ${yearParam}`} description={t('viewFullCalendar') || 'View the full calendar for this year'} />
          <RowLink href={getLocalePath("/age-calculator", locale)} title={t('calculateAge') || 'Calculate age based on birth year'} label={t('ageCalculator') || 'Age Calculator'} description={t('calculateAge') || 'Calculate age based on birth year'} />
        </CardList>
      </Section>

      <Section top="clamp(40px,5vw,64px)">
        <div className="flex flex-wrap items-center justify-between gap-x-12 gap-y-6">
          <div className="text-[15px] text-subtle">{t('viewOtherYears')}</div>
          <div className="flex flex-wrap gap-2">
            {[yearParam - 2, yearParam - 1, yearParam, yearParam + 1, yearParam + 2].filter((year) => year >= minYear && year <= maxYear).map((year) => (
              <Pill key={year} href={yearHref(year)} active={year === yearParam} title={`View year progress for ${year}`}>{year}</Pill>
            ))}
          </div>
        </div>
      </Section>

      <Faq title={t('faqTitle')} items={yearProgressFaqs.map((f) => ({ q: f.question, a: f.answer }))} />
    </>
  )
}
