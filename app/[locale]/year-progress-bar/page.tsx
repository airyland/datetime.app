import { Metadata } from "next"
import { calculateYearProgress, calculateTimeLeft, calculateTimeLeftData, formatTimeLeft } from "@/lib/year-progress"
import YearProgressClient from "./year-progress-client"
import { CardList, Faq, Pill, PageIntro, RowLink, Section, SectionHeading, Stat, StatGrid, cardClass, monoLabel, ArrowLink } from "@/components/ds"
import { getLocalePath } from "@/lib/locale-utils"
import { BreadcrumbJsonLd } from '@/components/breadcrumb-jsonld'
import { getTranslations } from 'next-intl/server'

// Generate metadata with current progress
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const now = new Date()
  const currentYear = now.getFullYear()
  const progress = calculateYearProgress(now)
  const timeLeft = calculateTimeLeft(now)
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'yearProgress' })

  return {
    title: `${t('pageTitle', { year: currentYear })} - ${progress.toFixed(2)}% ${t('completeTitle')} | Datetime.app`,
    description: `Track ${currentYear} year progress in real-time. ${t('subtitle', { year: currentYear, progress: progress.toFixed(2) })} with ${timeLeft}. Monitor ${currentYear} completion percentage, track time remaining in ${currentYear}, and plan your goals for the current year.`,
    keywords: ["year progress", "year progress bar", `${currentYear} progress`, `${currentYear} year progress`, `${currentYear} completion`, `${progress.toFixed(0)}% complete`, "time left in year", `time left in ${currentYear}`, "days left in year", `days left in ${currentYear}`, "year completion", `${currentYear} tracker`, "current year progress", "time tracking", `${currentYear} statistics`],
    openGraph: {
      title: `${t('pageTitle', { year: currentYear })} - ${progress.toFixed(2)}% ${t('completeTitle')} | Datetime.app`,
      description: `Track ${currentYear} year progress in real-time. ${t('subtitle', { year: currentYear, progress: progress.toFixed(2) })} with ${timeLeft}. Monitor ${currentYear} completion and plan your goals.`,
      type: "website",
    },
  }
}

export default async function YearProgressBar({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'yearProgress' })
  // Calculate initial values on the server
  const now = new Date()
  const currentYear = now.getFullYear()
  const initialProgress = calculateYearProgress(now)
  const initialTimeLeft = calculateTimeLeft(now)
  
  
  // Calculate initial time left data for translation
  const timeLeftData = calculateTimeLeftData(now)
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
  
  // Calculate additional year statistics
  const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0)
  const daysInCurrentYear = isLeapYear ? 366 : 365
  const weeksInCurrentYear = Math.ceil(daysInCurrentYear / 7)
  const daysElapsed = Math.floor((daysInCurrentYear * initialProgress) / 100)
  const daysRemaining = daysInCurrentYear - daysElapsed

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


  const pctSplit = initialProgress.toFixed(2)
  const quarters = [1, 2, 3, 4].map((n) => {
    const start = (n - 1) * 25
    const pct = Math.max(0, Math.min(100, ((initialProgress - start) / 25) * 100))
    const done = initialProgress >= start + 25
    const started = initialProgress >= start
    return {
      key: `q${n}`,
      pct,
      status: done ? (t('complete') || '✓ Complete') : started ? `${pct.toFixed(0)}%` : (t('notStarted') || 'Not started'),
      done,
      started,
    }
  })

  return (
    <>
      <PageIntro
        crumbs={[{ label: "Home", href: getLocalePath("/", locale) }, { label: t('title') }]}
        eyebrow={t('title')}
        title={t('pageTitle', { year: currentYear })}
        description={<span dangerouslySetInnerHTML={{ __html: t('subtitle', { year: currentYear, progress: `<strong class="font-medium text-ink">${pctSplit}</strong>` }) }} />}
      />

      <Section top="clamp(8px,2vw,24px)">
        <div className={`${cardClass} p-[clamp(22px,3.4vw,44px)]`}>
          <div className={`flex flex-wrap items-center justify-between gap-x-6 gap-y-2.5 ${monoLabel}`}>
            <h2 className="m-0 font-[inherit] text-[length:inherit] font-normal tracking-[inherit]">{t('progressTitle')} {currentYear}</h2>
            <span className="text-ink">{isLeapYear ? t('leapYearType') : t('regularYearType')} &middot; {daysInCurrentYear}</span>
          </div>
          {/* Client component for real-time updates */}
          <YearProgressClient initialProgress={initialProgress} initialTimeLeft={initialTimeLeftTranslated} currentYear={currentYear} />
          <div className="mt-7 flex flex-wrap items-center justify-end gap-x-8 gap-y-3">
            <ArrowLink href={getLocalePath(`/calendar/${currentYear}`, locale)} title={t('viewFullCalendar')}>{t('viewFullCalendar')}</ArrowLink>
          </div>
        </div>

        {/* Current Year Statistics */}
        <div className="mt-5">
          <h2 className={`m-0 mb-3 ${monoLabel}`}>{t('yearStatistics') || `${currentYear} Year Statistics`}</h2>
          <StatGrid min={220}>
            <Stat label={t('totalDays') || 'Total Days'} value={daysInCurrentYear} sub={t('inYear', { year: currentYear }) || `in ${currentYear}`} />
            <Stat label={t('daysElapsed') || 'Days Elapsed'} value={daysElapsed} sub={t('inYear', { year: currentYear }) || `in ${currentYear}`} />
            <Stat label={t('daysRemaining') || 'Days Remaining'} value={daysRemaining} sub={t('inYear', { year: currentYear }) || `in ${currentYear}`} />
            <Stat label={t('totalWeeks') || 'Total Weeks'} value={weeksInCurrentYear} sub={t('inYear', { year: currentYear }) || `in ${currentYear}`} />
          </StatGrid>
          {isLeapYear && (
            <p className="m-0 mt-4 text-sm text-subtle">{t('leapYear', { year: currentYear }) || `${currentYear} is a leap year with an extra day`}</p>
          )}
          <p className="m-0 mt-2 text-sm text-subtle">{t('trackProgress', { year: currentYear }) || `Track your ${currentYear} progress and make the most of the remaining time in ${currentYear}.`}</p>
        </div>
      </Section>

      {/* Current Year Goals Section */}
      <Section top="clamp(40px,5vw,64px)">
        <div className="flex flex-wrap gap-x-16 gap-y-5">
          <div className="min-w-0 flex-[1_1_220px]">
            <h2 className="m-0 max-w-[14ch] text-[clamp(24px,2.6vw,32px)] font-semibold leading-[1.15] tracking-[-0.025em]">{t('currentYearGoals') || `${currentYear} Goal Tracking`}</h2>
          </div>
          <p className="m-0 max-w-[68ch] min-w-0 flex-[3_1_520px] text-[17px] leading-[1.7] text-subtle">
            {t('goalTrackingDescription', { year: currentYear, progress: initialProgress.toFixed(1), daysRemaining: daysRemaining })}
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,250px),1fr))" }}>
          {quarters.map((q) => (
            <div key={q.key} className={`${cardClass} px-[22px] pb-6 pt-[22px]`}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="m-0 min-w-0 font-mono text-[13px] font-medium tracking-[.08em]">{t(q.key, { year: currentYear })}</h3>
                <span className={`shrink-0 font-mono text-[11.5px] uppercase tracking-[.06em] ${q.done ? "text-ok" : "text-subtle"}`}>{q.status}</span>
              </div>
              <div className="tnum mt-5 font-mono text-[44px] font-light leading-none tracking-[-0.05em]">
                {q.pct.toFixed(0)}<span className="text-[.5em] text-subtle">%</span>
              </div>
              <div className="mt-5 h-1.5 overflow-hidden rounded-[3px] bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(q.pct)} aria-label={t(q.key, { year: currentYear })}>
                <div className={`h-full ${q.done ? "bg-ok" : "bg-brand"}`} style={{ width: `${q.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Current Year Insights */}
      <Section>
        <SectionHeading title={t('yearInsights') || `${currentYear} Year Insights`} />
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))" }}>
          <div className={`${cardClass} px-[26px] pb-7 pt-[26px]`}>
            <h3 className={`m-0 font-normal ${monoLabel}`}>{t('timeRemaining') || `Time Remaining in ${currentYear}`}</h3>
            <p className="m-0 mt-3.5 text-[15.5px] leading-[1.7]">
              {t('timeRemainingDescription', { timeLeft: initialTimeLeft, year: currentYear, percentage: (100 - initialProgress).toFixed(1), daysRemaining: daysRemaining })}
            </p>
          </div>
          <div className={`${cardClass} px-[26px] pb-7 pt-[26px]`}>
            <h3 className={`m-0 font-normal ${monoLabel}`}>{t('progressSummary') || `${currentYear} Progress Summary`}</h3>
            <p className="m-0 mt-3.5 text-[15.5px] leading-[1.7]">
              {t('progressSummaryDescription', {
                year: currentYear,
                progress: initialProgress.toFixed(2),
                daysElapsed: daysElapsed,
                yearType: isLeapYear ? t('leapYearType') : t('regularYearType'),
                totalDays: daysInCurrentYear,
              })}
            </p>
          </div>
          <div className={`${cardClass} px-[26px] pb-7 pt-[26px]`}>
            <h3 className={`m-0 font-normal ${monoLabel}`}>{t('motivation') || `${currentYear} Motivation`}</h3>
            <p className="m-0 mt-3.5 text-[15.5px] leading-[1.7]">{t('motivationDescription', { year: currentYear })}</p>
          </div>
        </div>
      </Section>

      <Section top="clamp(40px,5vw,64px)">
        <div className="flex flex-wrap items-center justify-between gap-x-12 gap-y-6">
          <div className="text-[15px] text-subtle">{t('viewOtherYears')}</div>
          <div className="flex flex-wrap gap-2">
            {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map((year) => (
              <Pill key={year} href={getLocalePath(`/year-progress-bar/${year}`, locale)} active={year === currentYear} title={`View year progress for ${year}`}>{year}</Pill>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading title={t('relatedTools') || 'Related Tools'} />
        <CardList>
          <RowLink href={getLocalePath(`/calendar/${currentYear}`, locale)} title={t('viewFullCalendar')} label={`${t('calendar')} ${currentYear}`} description={t('viewFullCalendar')} />
          <RowLink href={getLocalePath('/age-calculator', locale)} title={t('calculateAge')} label={t('ageCalculator')} description={t('calculateAge')} />
        </CardList>
      </Section>

      <Faq title={t('faqTitle')} items={yearProgressFaqs.map((f) => ({ q: f.question, a: f.answer }))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: yearProgressFaqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
          }),
        }}
      />
      <BreadcrumbJsonLd items={[{ name: "Home", url: "https://datetime.app" }, { name: "Year Progress Bar", url: "https://datetime.app/year-progress-bar" }]} />
    </>
  )
}
