import { notFound } from 'next/navigation'
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { JetBrains_Mono } from "next/font/google"
import { Clock, Calendar, ArrowLeft, Info, BarChart3, Calculator } from "lucide-react"
import { calculateYearProgress, calculateTimeLeft, calculateTimeLeftData, formatTimeLeft, getYearStatus } from "@/lib/year-progress"
import YearProgressClient from "../year-progress-client"
import HeaderClient from "../header-client"
import { getTranslations } from 'next-intl/server'

// Load JetBrains Mono for numbers
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

interface YearProgressBarProps {
  params: { year: string; locale: string }
}

export default async function YearProgressBarWithYear({ params }: YearProgressBarProps) {
  const yearParam = parseInt(params.year)
  const { locale } = params
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

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <HeaderClient />

      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-4">
              <Link href={`/${locale === 'en' ? '' : locale + '/'}year-progress-bar`} className="inline-flex items-center text-primary hover:underline" title={t('backToCurrent') || 'Back to Current Year'}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                {t('backToCurrent') || 'Back to Current Year'}
              </Link>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
              {t('pageTitle', { year: yearParam })}
            </h1>
            <p className="text-xl text-center text-muted-foreground mb-8">
              {isCurrentYear ? (
                <span dangerouslySetInnerHTML={{ __html: t('subtitle', { year: yearParam, progress: `<strong>${initialProgress.toFixed(2)}</strong>` }) }} />
              ) : isCompleted ? (
                t('yearCompleted') || "This year has been completed"
              ) : (
                t('yearNotStarted') || "This year hasn't started yet"
              )}
            </p>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{t('progressTitle')} {yearParam}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isCurrentYear ? (
                  /* Client component for real-time updates (only for current year) */
                  <YearProgressClient
                    initialProgress={initialProgress}
                    initialTimeLeft={initialTimeLeftTranslated}
                    currentYear={yearParam}
                  />
                ) : (
                  /* Static display for non-current years */
                  <div className="space-y-6">
                    <div className="text-center">
                      <span className={`text-5xl md:text-6xl font-bold ${jetbrainsMono.className}`}>
                        {initialProgress.toFixed(2)}%
                      </span>
                    </div>
                    <Progress value={initialProgress} className="h-6" />
                    <div className="text-center text-muted-foreground">
                      <Clock className="inline-block mr-2 h-4 w-4" />
                      <span>{initialTimeLeftTranslated}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Year Comparison with Current Year */}
            {!isCurrentYear && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {t('comparisonTitle') || 'Comparison with Current Year'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">{currentYear} {t('progressTitle')}</p>
                      <Progress value={currentYearProgress} className="h-4 mb-1" />
                      <p className="text-sm text-right">{currentYearProgress.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">{yearParam} {t('progressTitle')}</p>
                      <Progress value={initialProgress} className="h-4 mb-1" />
                      <p className="text-sm text-right">{initialProgress.toFixed(2)}%</p>
                    </div>
                    <div className="text-center pt-2 border-t">
                      <p className="text-sm text-muted-foreground">
                        {progressDifference > 0 ? (
                          t('yearAhead', { year: yearParam, diff: progressDifference.toFixed(2) }) || `${yearParam} is ${progressDifference.toFixed(2)}% ahead of ${currentYear}`
                        ) : (
                          t('yearBehind', { year: yearParam, diff: Math.abs(progressDifference).toFixed(2) }) || `${yearParam} is ${Math.abs(progressDifference).toFixed(2)}% behind ${currentYear}`
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Year Statistics */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  {t('yearStatistics') || 'Year Statistics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold">{daysInYear}</p>
                    <p className="text-sm text-muted-foreground">{t('days') || 'Days'}</p>
                  </div>
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold">{weeksInYear}</p>
                    <p className="text-sm text-muted-foreground">{t('weeks') || 'Weeks'}</p>
                  </div>
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold">{monthsInYear}</p>
                    <p className="text-sm text-muted-foreground">{t('months') || 'Months'}</p>
                  </div>
                </div>
                {isLeapYear && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    {t('leapYear', { year: yearParam }) || `${yearParam} is a leap year`}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Related Tools */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  {t('relatedTools') || 'Related Tools'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href={`/${locale === 'en' ? '' : locale + '/'}calendar/${yearParam}`} className="p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors" title={t('viewFullCalendar') || 'View the full calendar for this year'}>
                    <h3 className="font-semibold mb-1">{t('calendar') || 'Calendar'} {yearParam}</h3>
                    <p className="text-sm text-muted-foreground">{t('viewFullCalendar') || 'View the full calendar for this year'}</p>
                  </Link>
                  <Link href={`/${locale === 'en' ? '' : locale + '/'}age-calculator`} className="p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors" title={t('calculateAge') || 'Calculate age based on birth year'}>
                    <h3 className="font-semibold mb-1">{t('ageCalculator') || 'Age Calculator'}</h3>
                    <p className="text-sm text-muted-foreground">{t('calculateAge') || 'Calculate age based on birth year'}</p>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mb-8">
              <p className="mb-4">{t('viewOtherYears')}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[yearParam - 2, yearParam - 1, yearParam, yearParam + 1, yearParam + 2].filter(year => year >= minYear && year <= maxYear).map((year) => (
                  <Link
                    key={year}
                    href={`/${locale === 'en' ? '' : locale + '/'}year-progress-bar/${year}`}
                    className={`px-4 py-2 rounded-md ${year === yearParam ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}
                    title={`View year progress for ${year}`}
                  >
                    {year}
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-8 max-w-3xl mx-auto text-left">
              <h2 className="text-2xl font-bold mb-6 text-center">{t('faqTitle')}</h2>
              <Accordion type="multiple" defaultValue={yearProgressFaqs.map((_, index) => `item-${index}`)} collapsible className="w-full">
                {yearProgressFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <p>{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
