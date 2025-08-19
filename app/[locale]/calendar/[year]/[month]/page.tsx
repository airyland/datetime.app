"use client"

import { use, useState } from "react"
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { JetBrains_Mono } from "next/font/google"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { generateMonthCalendar, getWeekdayNames, getDaysInMonth } from '@/lib/calendar'

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

interface MonthPageProps {
  params: { year: string; month: string; locale: string };
}

export default function MonthPage({ params }: MonthPageProps) {
  const resolvedParams = use(params)
  const year = parseInt(resolvedParams.year);
  const month = parseInt(resolvedParams.month);
  const locale = resolvedParams.locale;
  const t = useTranslations('calendar');
  const tCommon = useTranslations('common');
  
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
  
  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity" title={tCommon('links.titleHome')}>
          Datetime.app
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="flex items-center gap-2">
            <span className="text-sm hidden md:inline">{t('toggleTheme')}:</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 flex-grow">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link 
              href={`/${locale === 'en' ? '' : locale + '/'}calendar/${prevYear}/${String(prevMonth).padStart(2, '0')}`}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title={t('previousMonth')}
            >
              <ChevronLeft className="w-6 h-6" />
            </Link>
            
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {calendar.name} {year}
              </h1>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <Link 
                  href={`/${locale === 'en' ? '' : locale + '/'}calendar/${year}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title={`Back to ${year} calendar`}
                >
                  {t('backToYear', { year })}
                </Link>
                {isCurrentMonth && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
                    {t('currentMonth')}
                  </span>
                )}
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                  {t('daysInMonth', { days: daysInMonth })}
                </span>
              </div>
            </div>
            
            <Link 
              href={`/${locale === 'en' ? '' : locale + '/'}calendar/${nextYear}/${String(nextMonth).padStart(2, '0')}`}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title={t('nextMonth')}
            >
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* View Full Year Button */}
        <div className="mb-6 text-center">
          <Link 
            href={`/${locale === 'en' ? '' : locale + '/'}calendar/${year}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-md"
            title={`View full ${year} calendar`}
          >
            <CalendarIcon className="w-5 h-5" />
            {t('viewYear', { year })}
          </Link>
        </div>

        {/* Large Monthly Calendar */}
        <Card className="mb-8 max-w-4xl mx-auto shadow-none border">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-center">
              {calendar.name} {year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekdayNames.full.map((day, index) => (
                <div key={index} className="text-center font-semibold py-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 rounded">
                  <div className="hidden md:block">{day}</div>
                  <div className="md:hidden">{weekdayNames.short[index]}</div>
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="space-y-2">
              {Array.from({ length: 6 }, (_, weekIndex) => {
                const weekStart = weekIndex * 7;
                const weekDays = calendar.days.slice(weekStart, weekStart + 7);
                if (weekDays.length === 0) return null;
                
                return (
                  <div key={weekIndex} className="grid grid-cols-7 gap-2">
                    {weekDays.map((day, dayIndex) => (
                      <button
                        key={dayIndex}
                        onClick={() => handleDateClick(day.fullDate)}
                        className={`
                          h-12 md:h-16 text-center rounded-lg transition-all duration-200 font-medium relative
                          ${day.isToday 
                            ? 'bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-600 shadow-md scale-105' 
                            : day.isOtherMonth 
                            ? 'text-gray-300 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800' 
                            : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                          }
                          ${selectedDate?.getTime() === day.fullDate.getTime() && !day.isToday
                            ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900'
                            : ''
                          }
                        `}
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <span className={`text-lg ${day.isToday ? 'text-white' : ''}`}>
                            {day.date}
                          </span>
                          {!day.isOtherMonth && (
                            <span className={`text-xs mt-1 hidden md:block ${day.isToday ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                              {t('weekNumber', { number: day.weekNumber })}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected date info */}
        {selectedDate && (
          <Card className="mb-8 max-w-md mx-auto">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5" />
                {t('selectedDate')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">{t('date')}:</span> {selectedDate.toLocaleDateString(locale, { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div>
                  <span className="font-medium">{t('weekNumber')}:</span> {
                    calendar.days.find(d => d.fullDate.getDate() === selectedDate.getDate() && !d.isOtherMonth)?.weekNumber || 0
                  }
                </div>
                <div>
                  <span className="font-medium">{t('dayOfYear')}:</span> {
                    Math.floor((selectedDate.getTime() - new Date(selectedDate.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Month Navigation */}
        <Card className="mb-8 max-w-2xl mx-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              {t('monthNavigation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {Array.from({ length: 12 }, (_, i) => {
                const navMonth = i + 1;
                const monthNames = calendar.name.split(' ')[0]; // Get current month name format
                const navDate = new Date(year, i, 1);
                const navMonthName = navDate.toLocaleDateString(locale, { month: 'long' });
                
                return (
                  <Link
                    key={navMonth}
                    href={`/${locale === 'en' ? '' : locale + '/'}calendar/${year}/${String(navMonth).padStart(2, '0')}`}
                    className={`
                      px-3 py-3 rounded text-sm transition-colors text-center
                      ${navMonth === month
                        ? 'bg-blue-500 text-white'
                        : navMonth === currentMonth && year === currentYear
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }
                    `}
                    title={`View ${navMonthName} ${year} calendar`}
                  >
                    <div className="font-medium">{navMonthName}</div>
                    <div className="text-xs opacity-75">{year}</div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Month-specific FAQ Section */}
        <div className="max-w-3xl mx-auto mb-8">
          <Card className="shadow-none border">
            <CardHeader>
              <CardTitle>{calendar.name} {year} - {t('faq.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 text-sm">
                {/* Month overview */}
                <div>
                  <h3 className="font-semibold mb-2">{t('faq.monthOverview.question')}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('faq.monthOverview.answer', { 
                      month: calendar.name, 
                      year, 
                      days: daysInMonth,
                      startDay: monthStart.toLocaleDateString(locale, { weekday: 'long' }),
                      endDay: monthEnd.toLocaleDateString(locale, { weekday: 'long' })
                    })}
                  </p>
                </div>

                {/* Week count */}
                <div>
                  <h3 className="font-semibold mb-2">{t('faq.weekCount.question')}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('faq.weekCount.answer', { 
                      month: calendar.name,
                      weeks: Math.ceil((daysInMonth + monthStart.getDay()) / 7)
                    })}
                  </p>
                </div>

                {/* Current month status */}
                {isCurrentMonth && (
                  <div>
                    <h3 className="font-semibold mb-2">{t('faq.currentMonth.question')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('faq.currentMonth.answer', { 
                        month: calendar.name,
                        year,
                        today: new Date().getDate()
                      })}
                    </p>
                  </div>
                )}

                {/* Special characteristics */}
                <div>
                  <h3 className="font-semibold mb-2">{t('faq.monthCharacteristics.question')}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {month === 2 ? 
                      t('faq.monthCharacteristics.february', { 
                        month: calendar.name,
                        year,
                        days: daysInMonth,
                        leapYear: daysInMonth === 29 ? t('leapYear') : t('regularYear')
                      }) :
                      [4, 6, 9, 11].includes(month) ?
                      t('faq.monthCharacteristics.thirtyDays', { month: calendar.name }) :
                      t('faq.monthCharacteristics.thirtyOneDays', { month: calendar.name })
                    }
                  </p>
                </div>

                {/* Navigation help */}
                <div>
                  <h3 className="font-semibold mb-2">{t('faq.navigation.question')}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('faq.navigation.answer', { 
                      prevMonth: new Date(prevYear, prevMonth - 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' }),
                      nextMonth: new Date(nextYear, nextMonth - 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' })
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}