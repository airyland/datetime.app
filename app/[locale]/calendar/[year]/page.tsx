"use client"

import { use, useState } from "react"
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { JetBrains_Mono } from "next/font/google"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { generateYearCalendar, getWeekdayNames } from '@/lib/calendar'

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

interface CalendarPageProps {
  params: { year: string; locale: string };
}

export default function CalendarPage({ params }: CalendarPageProps) {
  const resolvedParams = use(params)
  const year = parseInt(resolvedParams.year);
  const locale = resolvedParams.locale;
  const t = useTranslations('calendar');
  
  // Validate year
  if (isNaN(year) || year < 1970 || year > 2100) {
    notFound();
  }
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const calendar = generateYearCalendar(year, locale);
  const weekdayNames = getWeekdayNames(locale);
  const currentYear = new Date().getFullYear();
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
  
  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
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
              href={`/${locale === 'en' ? '' : locale + '/'}calendar/${year - 1}`}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title={t('previousYear')}
            >
              <ChevronLeft className="w-6 h-6" />
            </Link>
            
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {t('title', { year })}
              </h1>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{t('subtitle')}</span>
                {isCurrentYear && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
                    {t('currentYear')}
                  </span>
                )}
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                  {calendar.isLeapYear ? t('leapYear') : t('regularYear')}
                </span>
              </div>
            </div>
            
            <Link 
              href={`/${locale === 'en' ? '' : locale + '/'}calendar/${year + 1}`}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title={t('nextYear')}
            >
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
          
          {/* Year statistics */}
          {isCurrentYear && calendar.daysPassed && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-sm">
              <div className="text-center">
                <div className={`text-lg font-bold ${jetbrainsMono.className}`}>
                  {calendar.totalDays}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {t('info.totalDays', { year })}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${jetbrainsMono.className}`}>
                  {calendar.daysPassed}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {t('info.daysPassed')}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${jetbrainsMono.className}`}>
                  {calendar.daysRemaining}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {t('info.daysRemaining')}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${jetbrainsMono.className}`}>
                  {calendar.weeksPassed}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {t('info.weeksPassed')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {calendar.months.map((month, monthIndex) => (
            <Card key={monthIndex} className="shadow-none border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-center">
                  {month.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-gray-500 dark:text-gray-400">
                  {weekdayNames.short.map((day, index) => (
                    <div key={index} className="text-center font-medium">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar days */}
                <div className="space-y-1">
                  {Array.from({ length: 6 }, (_, weekIndex) => {
                    const weekStart = weekIndex * 7;
                    const weekDays = month.days.slice(weekStart, weekStart + 7);
                    if (weekDays.length === 0) return null;
                    
                    return (
                      <div key={weekIndex} className="grid grid-cols-7 gap-1">
                        {/* Days */}
                        {weekDays.map((day, dayIndex) => (
                          <button
                            key={dayIndex}
                            onClick={() => handleDateClick(day.fullDate)}
                            className={`
                              text-xs py-1 text-center rounded transition-colors
                              ${day.isToday 
                                ? 'bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-600' 
                                : day.isOtherMonth 
                                ? 'text-gray-300 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800' 
                                : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }
                              ${selectedDate?.getTime() === day.fullDate.getTime() && !day.isToday
                                ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900'
                                : ''
                              }
                            `}
                          >
                            {day.date}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected date info */}
        {selectedDate && (
          <Card className="mb-8 max-w-md mx-auto">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5" />
                Selected Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Date:</span> {selectedDate.toLocaleDateString(locale, { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div>
                  <span className="font-medium">Week Number:</span> {t('weekNumber', { 
                    number: calendar.months[selectedDate.getMonth()].days
                      .find(d => d.fullDate.getDate() === selectedDate.getDate() && !d.isOtherMonth)?.weekNumber || 0
                  })}
                </div>
                <div>
                  <span className="font-medium">Day of Year:</span> {
                    Math.floor((selectedDate.getTime() - new Date(selectedDate.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Year Navigation */}
        <Card className="mb-8 max-w-2xl mx-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              {t('yearNavigation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: 11 }, (_, i) => {
                const navYear = year - 5 + i;
                return (
                  <Link
                    key={navYear}
                    href={`/${locale === 'en' ? '' : locale + '/'}calendar/${navYear}`}
                    className={`
                      px-3 py-1 rounded text-sm transition-colors
                      ${navYear === year
                        ? 'bg-blue-500 text-white'
                        : navYear === currentYear
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }
                    `}
                  >
                    {navYear}
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-8">
          <Card className="shadow-none border">
            <CardHeader>
              <CardTitle>{t('faq.title', { year })}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" collapsible>
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}