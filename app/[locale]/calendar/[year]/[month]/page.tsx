"use client"

import { use, useState } from "react"
import { notFound } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ArrowLink, Faq, PageIntro, Pill, Section, cardClass, monoLabel } from '@/components/ds'
import { CalNavLink, SelectedDateCard } from '@/components/calendar-parts'
import { cn } from '@/lib/utils'
import { generateMonthCalendar, getWeekdayNames, getDaysInMonth } from '@/lib/calendar'
import { getLocalePath } from '@/lib/locale-utils'

interface MonthPageProps {
  params: { year: string; month: string; locale: string };
}

export default function MonthPage({ params }: MonthPageProps) {
  const resolvedParams = use(params)
  const year = parseInt(resolvedParams.year);
  const month = parseInt(resolvedParams.month);
  const locale = resolvedParams.locale;
  const t = useTranslations('calendar');
  
  // Validate year and month
  if (isNaN(year) || year < 1970 || year > 2100 || isNaN(month) || month < 1 || month > 12) {
    notFound();
  }
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const calendar = generateMonthCalendar(year, month - 1, locale);
  const weekdayNames = getWeekdayNames(locale);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const isCurrentMonth = year === currentYear && month === currentMonth;
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };
  
  // Navigation helpers
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);
  const daysInMonth = getDaysInMonth(year, month - 1);
  
  const monthHref = (y: number, m: number) => getLocalePath(`/calendar/${y}/${String(m).padStart(2, '0')}`, locale)
  const faqItems = [
    {
      q: t('faq.monthOverview.question'),
      a: t('faq.monthOverview.answer', {
        month: calendar.name,
        year,
        days: daysInMonth,
        startDay: monthStart.toLocaleDateString(locale, { weekday: 'long' }),
        endDay: monthEnd.toLocaleDateString(locale, { weekday: 'long' }),
      }),
    },
    {
      q: t('faq.weekCount.question'),
      a: t('faq.weekCount.answer', { month: calendar.name, weeks: Math.ceil((daysInMonth + monthStart.getDay()) / 7) }),
    },
    ...(isCurrentMonth
      ? [{ q: t('faq.currentMonth.question'), a: t('faq.currentMonth.answer', { month: calendar.name, year, today: new Date().getDate() }) }]
      : []),
    {
      q: t('faq.monthCharacteristics.question'),
      a:
        month === 2
          ? t('faq.monthCharacteristics.february', { month: calendar.name, year, days: daysInMonth, leapYear: daysInMonth === 29 ? t('leapYear') : t('regularYear') })
          : [4, 6, 9, 11].includes(month)
            ? t('faq.monthCharacteristics.thirtyDays', { month: calendar.name })
            : t('faq.monthCharacteristics.thirtyOneDays', { month: calendar.name }),
    },
    {
      q: t('faq.navigation.question'),
      a: t('faq.navigation.answer', {
        prevMonth: new Date(prevYear, prevMonth - 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' }),
        nextMonth: new Date(nextYear, nextMonth - 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' }),
      }),
    },
  ]

  return (
    <>
      <PageIntro
        crumbs={[
          { label: "Home", href: getLocalePath("/", locale) },
          { label: "Calendar" },
          { label: year, href: getLocalePath(`/calendar/${year}`, locale) },
          { label: calendar.name },
        ]}
        title={`${calendar.name} ${year}`}
        description={
          <ArrowLink href={getLocalePath(`/calendar/${year}`, locale)} title={`Back to ${year} calendar`}>
            {t('backToYear', { year })}
          </ArrowLink>
        }
        right={
          <div className={`flex flex-wrap items-center gap-2 ${monoLabel}`}>
            {isCurrentMonth && <span className="rounded-full border border-brand px-3 py-1.5 text-brand">{t('currentMonth')}</span>}
            <span className="rounded-full border border-line px-3 py-1.5 text-ink">{t('daysInMonth', { days: daysInMonth })}</span>
          </div>
        }
      />

      {/* Large Monthly Calendar */}
      <Section top="clamp(8px,2vw,24px)">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <ArrowLink href={getLocalePath(`/calendar/${year}`, locale)} title={`View full ${year} calendar`} className="text-ink">
            {t('viewYear', { year })}
          </ArrowLink>
          <div className="flex items-center gap-2.5">
            <CalNavLink href={monthHref(prevYear, prevMonth)} title={t('previousMonth')} dir="prev" />
            <div className="tnum min-w-[112px] text-center font-mono text-[22px] font-light tracking-[-0.03em]">
              {String(month).padStart(2, '0')}/{year}
            </div>
            <CalNavLink href={monthHref(nextYear, nextMonth)} title={t('nextMonth')} dir="next" />
          </div>
        </div>

        <div className={cn(cardClass, "p-[clamp(12px,3vw,32px)]")}>
          <h2 className="m-0 mb-4 text-xl font-semibold tracking-[-0.02em]">{calendar.name} {year}</h2>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {weekdayNames.full.map((day, index) => (
              <div key={index} className={cn("py-2.5 text-center", monoLabel)}>
                <span className="hidden md:inline">{day}</span>
                <span className="md:hidden">{weekdayNames.short[index]}</span>
              </div>
            ))}
            {calendar.days.map((day, i) => {
              const selected = selectedDate?.getTime() === day.fullDate.getTime()
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDateClick(day.fullDate)}
                  className={cn(
                    "relative flex h-12 min-w-0 flex-col items-center justify-center rounded-xl border transition-colors md:h-16",
                    day.isToday
                      ? "border-brand bg-brand text-btn-ink"
                      : day.isOtherMonth
                        ? "border-transparent text-subtle opacity-40 hover:bg-paper"
                        : "border-line text-ink hover:border-ink",
                    selected && !day.isToday && "ring-2 ring-ink ring-offset-2 ring-offset-surface",
                  )}
                >
                  <span className="tnum font-mono text-lg">{day.date}</span>
                  {!day.isOtherMonth && (
                    <span className={cn("mt-0.5 hidden font-mono text-[10.5px] md:block", day.isToday ? "text-btn-ink" : "text-subtle")}>
                      {t('weekNumber', { number: day.weekNumber })}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected date info */}
        {selectedDate && (
          <SelectedDateCard
            title={t('selectedDate')}
            rows={[
              { label: t('date'), value: selectedDate.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
              {
                label: 'Week Number',
                value: calendar.days.find((d) => d.fullDate.getDate() === selectedDate.getDate() && !d.isOtherMonth)?.weekNumber || 0,
              },
              { label: t('dayOfYear'), value: Math.floor((selectedDate.getTime() - new Date(selectedDate.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1 },
            ]}
          />
        )}
      </Section>

      {/* Month Navigation */}
      <Section top="clamp(40px,5vw,64px)">
        <div className="flex flex-wrap items-start justify-between gap-x-12 gap-y-6">
          <h2 className="m-0 text-[15px] font-normal text-subtle">{t('monthNavigation')}</h2>
          <div className="flex min-w-0 flex-[1_1_480px] flex-wrap justify-start gap-2 md:justify-end">
            {Array.from({ length: 12 }, (_, i) => {
              const navMonth = i + 1
              const navMonthName = new Date(year, i, 1).toLocaleDateString(locale, { month: 'long' })
              return (
                <Pill key={navMonth} href={monthHref(year, navMonth)} active={navMonth === month} title={`View ${navMonthName} ${year} calendar`}>
                  {navMonthName}
                </Pill>
              )
            })}
          </div>
        </div>
      </Section>

      {/* Month-specific FAQ Section */}
      <Faq title={`${calendar.name} ${year} - ${t('faq.title')}`} items={faqItems} />
    </>
  );
}
