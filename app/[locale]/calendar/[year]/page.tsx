"use client"

import { use, useState } from "react"
import { notFound } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { Faq, PageIntro, Pill, Section, Stat, StatGrid, cardClass, monoLabel } from '@/components/ds'
import { CalNavLink, CalPillLink, MonthMini, SelectedDateCard } from '@/components/calendar-parts'
import { generateYearCalendar, getWeekdayNames } from '@/lib/calendar'
import { getLocalePath } from '@/lib/locale-utils'

interface CalendarPageProps {
  params: { year: string; locale: string };
}

export default function CalendarPage({ params }: CalendarPageProps) {
  const resolvedParams = use(params)
  const year = parseInt(resolvedParams.year);
  const locale = resolvedParams.locale;
  const t = useTranslations('calendar');
  
  // Validate year (limit to ±15 years from current year)
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 15;
  const maxYear = currentYear + 15;
  
  if (isNaN(year) || year < minYear || year > maxYear) {
    notFound();
  }
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const calendar = generateYearCalendar(year, locale);
  const weekdayNames = getWeekdayNames(locale);
  const isCurrentYear = year === currentYear;
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };
  
  const faqs = [
    {
      question: t('faq.whatIsCalendar.question'),
      answer: t('faq.whatIsCalendar.answer')
    },
    {
      question: t('faq.weekNumbers.question'),
      answer: t('faq.weekNumbers.answer')
    },
    {
      question: t('faq.leapYear.question'),
      answer: t('faq.leapYear.answer')
    }
  ];
  
  const yearHref = (y: number) => getLocalePath(`/calendar/${y}`, locale)
  const yearType = calendar.isLeapYear ? t('leapYear') : t('regularYear')
  const passedPct = calendar.daysPassed ? ((calendar.daysPassed / calendar.totalDays) * 100).toFixed(1) : null

  return (
    <>
      <PageIntro
        crumbs={[{ label: "Home", href: getLocalePath("/", locale) }, { label: "Calendar" }, { label: year }]}
        title={t('title', { year })}
        description={
          <>
            {t('subtitle')}
            <br />
            {t('description', { year })}
          </>
        }
        right={
          <div className={`flex flex-wrap items-center gap-2 ${monoLabel}`}>
            {isCurrentYear && <span className="rounded-full border border-brand px-3 py-1.5 text-brand">{t('currentYear')}</span>}
            <span className="rounded-full border border-line px-3 py-1.5 text-ink">{yearType}</span>
          </div>
        }
      />

      {/* Year statistics */}
      <Section top="clamp(8px,2vw,24px)">
        <StatGrid min={190}>
          <Stat label={t('info.totalDays', { year })} value={calendar.totalDays} sub={yearType} />
          {isCurrentYear && calendar.daysPassed && (
            <>
              <Stat label={t('info.daysPassed')} value={calendar.daysPassed} sub={passedPct ? `${passedPct}%` : undefined} />
              <Stat label={t('info.daysRemaining')} value={calendar.daysRemaining} />
              <Stat label={t('info.weeksPassed')} value={calendar.weeksPassed} />
              <Stat label={t('info.weeksRemaining')} value={calendar.weeksRemaining} />
            </>
          )}
        </StatGrid>
      </Section>

      {/* Calendar Grid */}
      <Section top="clamp(40px,5vw,64px)">
        <div className="mb-6 flex flex-wrap items-center justify-end gap-2.5">
          <CalNavLink href={yearHref(year - 1)} title={t('previousYear')} dir="prev" />
          <div className="tnum min-w-[112px] text-center font-mono text-[22px] font-light tracking-[-0.03em]">{year}</div>
          <CalNavLink href={yearHref(year + 1)} title={t('nextYear')} dir="next" />
          {!isCurrentYear && <CalPillLink href={yearHref(currentYear)} title={`View ${currentYear} calendar`}>{t('today')}</CalPillLink>}
        </div>
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,300px),1fr))" }}>
          {calendar.months.map((month, monthIndex) => (
            <MonthMini
              key={monthIndex}
              month={month}
              year={year}
              weekdayShort={weekdayNames.short}
              monthHref={getLocalePath(`/calendar/${year}/${String(monthIndex + 1).padStart(2, '0')}`, locale)}
              monthTitle={`View ${month.name} ${year} calendar`}
              daysLabel={t('daysInMonth', { days: month.totalDays })}
              isCurrent={isCurrentYear && monthIndex === new Date().getMonth()}
              selectedDate={selectedDate}
              onSelect={handleDateClick}
            />
          ))}
        </div>

        {/* Selected date info */}
        {selectedDate && (
          <SelectedDateCard
            title={t('selectedDate')}
            rows={[
              { label: t('date'), value: selectedDate.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
              {
                label: 'Week Number',
                value: t('weekNumber', { number: calendar.months[selectedDate.getMonth()].days.find((d) => d.fullDate.getDate() === selectedDate.getDate() && !d.isOtherMonth)?.weekNumber || 0 }),
              },
              { label: t('dayOfYear'), value: Math.floor((selectedDate.getTime() - new Date(selectedDate.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1 },
            ]}
          />
        )}
      </Section>

      {/* SEO Content Section */}
      <Section>
        <div className={`${cardClass} flex flex-wrap gap-x-16 gap-y-8 p-[clamp(24px,3.4vw,44px)]`}>
          <div className="min-w-0 flex-[1_1_320px]">
            <h2 className="m-0 text-[clamp(24px,2.6vw,32px)] font-semibold leading-[1.15] tracking-[-0.025em]">{t('seo.yearOverview.title', { year })}</h2>
            <p className="m-0 mt-5 text-[15.5px] leading-[1.75] text-subtle">
              {t('seo.yearOverview.content', {
                year,
                totalDays: calendar.totalDays,
                yearType: calendar.isLeapYear ? t('leapYear').toLowerCase() : t('regularYear').toLowerCase(),
                leapYearInfo: calendar.isLeapYear ? ` with an extra day (February 29)` : '',
              })}
            </p>
          </div>
          <div className="min-w-0 flex-[1_1_320px]">
            <h2 className="m-0 mb-3.5 text-lg font-semibold tracking-[-0.015em]">{t('seo.features.title', { year })}</h2>
            <ul className="m-0 flex list-none flex-col gap-[11px] p-0">
              {t.raw('seo.features.list').map((feature: string, index: number) => (
                <li key={index} className="flex gap-3 text-[15px] leading-normal">
                  <Check className="mt-1 size-4 shrink-0 text-ok" strokeWidth={2} aria-hidden="true" />
                  <span>{feature.replace('{year}', year.toString())}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Year Navigation */}
      <Section top="clamp(40px,5vw,64px)">
        <div className="flex flex-wrap items-center justify-between gap-x-12 gap-y-6">
          <h2 className="m-0 text-[15px] font-normal text-subtle">{t('yearNavigation')}</h2>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 11 }, (_, i) => year - 5 + i)
              .filter((navYear) => navYear >= minYear && navYear <= maxYear)
              .map((navYear) => (
                <Pill key={navYear} href={yearHref(navYear)} active={navYear === year} title={`View ${navYear} calendar`}>{navYear}</Pill>
              ))}
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Faq title={t('faq.title', { year })} items={faqs.map((f) => ({ q: f.question, a: f.answer }))} />
    </>
  );
}
