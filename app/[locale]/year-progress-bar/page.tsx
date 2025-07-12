import { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { Clock, Calendar, TrendingUp, Target, BarChart3, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { calculateYearProgress, calculateTimeLeft, calculateTimeLeftData, formatTimeLeft } from "@/lib/year-progress"
import YearProgressClient from "./year-progress-client"
import HeaderClient from "./header-client"
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

// Load JetBrains Mono for numbers
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

// Generate metadata with current progress
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const now = new Date()
  const currentYear = now.getFullYear()
  const progress = calculateYearProgress(now)
  const timeLeft = calculateTimeLeft(now)
  const { locale } = params
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

export default async function YearProgressBar({ params }: { params: { locale: string } }) {
  const { locale } = params
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


  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <HeaderClient />

      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
              {t('pageTitle', { year: currentYear })}
            </h1>
            <p className="text-xl text-center text-muted-foreground mb-8">
              <span dangerouslySetInnerHTML={{ __html: t('subtitle', { year: currentYear, progress: `<strong>${initialProgress.toFixed(2)}</strong>` }) }} />
            </p>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{t('progressTitle')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Client component for real-time updates */}
                <YearProgressClient
                  initialProgress={initialProgress}
                  initialTimeLeft={initialTimeLeftTranslated}
                  currentYear={currentYear}
                />
              </CardContent>
            </Card>

            {/* Current Year Statistics */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {t('yearStatistics') || `${currentYear} Year Statistics`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className={`text-2xl font-bold ${jetbrainsMono.className}`}>{daysInCurrentYear}</p>
                    <p className="text-sm text-muted-foreground">{t('totalDays') || 'Total Days'}</p>
                    <p className="text-xs text-muted-foreground">{t('inYear', { year: currentYear }) || `in ${currentYear}`}</p>
                  </div>
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className={`text-2xl font-bold ${jetbrainsMono.className}`}>{daysElapsed}</p>
                    <p className="text-sm text-muted-foreground">{t('daysElapsed') || 'Days Elapsed'}</p>
                    <p className="text-xs text-muted-foreground">{t('inYear', { year: currentYear }) || `in ${currentYear}`}</p>
                  </div>
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className={`text-2xl font-bold ${jetbrainsMono.className}`}>{daysRemaining}</p>
                    <p className="text-sm text-muted-foreground">{t('daysRemaining') || 'Days Remaining'}</p>
                    <p className="text-xs text-muted-foreground">{t('inYear', { year: currentYear }) || `in ${currentYear}`}</p>
                  </div>
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className={`text-2xl font-bold ${jetbrainsMono.className}`}>{weeksInCurrentYear}</p>
                    <p className="text-sm text-muted-foreground">{t('totalWeeks') || 'Total Weeks'}</p>
                    <p className="text-xs text-muted-foreground">{t('inYear', { year: currentYear }) || `in ${currentYear}`}</p>
                  </div>
                </div>
                {isLeapYear && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    {t('leapYear', { year: currentYear }) || `${currentYear} is a leap year with an extra day`}
                  </p>
                )}
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {t('trackProgress', { year: currentYear }) || `Track your ${currentYear} progress and make the most of the remaining time in ${currentYear}.`}
                </p>
              </CardContent>
            </Card>

            {/* Current Year Goals Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t('currentYearGoals') || `${currentYear} Goal Tracking`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {t('goalTrackingDescription', { 
                    year: currentYear, 
                    progress: initialProgress.toFixed(1), 
                    daysRemaining: daysRemaining 
                  }) || `Use this ${currentYear} year progress tracker to monitor your annual goals. With ${initialProgress.toFixed(1)}% of ${currentYear} complete, you have ${daysRemaining} days remaining to achieve your ${currentYear} objectives.`}
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>{t('q1', { year: currentYear }) || `Q1 ${currentYear} (Jan-Mar)`}</span>
                    <span className={initialProgress >= 25 ? 'text-green-600' : 'text-muted-foreground'}>
                      {initialProgress >= 25 ? (t('complete') || '✓ Complete') : `${Math.max(0, Math.min(100, (initialProgress / 25) * 100)).toFixed(0)}%`}
                    </span>
                  </div>
                  <Progress value={Math.min(100, (initialProgress / 25) * 100)} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>{t('q2', { year: currentYear }) || `Q2 ${currentYear} (Apr-Jun)`}</span>
                    <span className={initialProgress >= 50 ? 'text-green-600' : 'text-muted-foreground'}>
                      {initialProgress >= 50 ? (t('complete') || '✓ Complete') : initialProgress >= 25 ? `${Math.max(0, Math.min(100, ((initialProgress - 25) / 25) * 100)).toFixed(0)}%` : (t('notStarted') || 'Not started')}
                    </span>
                  </div>
                  <Progress value={Math.max(0, Math.min(100, ((initialProgress - 25) / 25) * 100))} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>{t('q3', { year: currentYear }) || `Q3 ${currentYear} (Jul-Sep)`}</span>
                    <span className={initialProgress >= 75 ? 'text-green-600' : 'text-muted-foreground'}>
                      {initialProgress >= 75 ? (t('complete') || '✓ Complete') : initialProgress >= 50 ? `${Math.max(0, Math.min(100, ((initialProgress - 50) / 25) * 100)).toFixed(0)}%` : (t('notStarted') || 'Not started')}
                    </span>
                  </div>
                  <Progress value={Math.max(0, Math.min(100, ((initialProgress - 50) / 25) * 100))} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>{t('q4', { year: currentYear }) || `Q4 ${currentYear} (Oct-Dec)`}</span>
                    <span className={initialProgress >= 100 ? 'text-green-600' : 'text-muted-foreground'}>
                      {initialProgress >= 100 ? (t('complete') || '✓ Complete') : initialProgress >= 75 ? `${Math.max(0, Math.min(100, ((initialProgress - 75) / 25) * 100)).toFixed(0)}%` : (t('notStarted') || 'Not started')}
                    </span>
                  </div>
                  <Progress value={Math.max(0, Math.min(100, ((initialProgress - 75) / 25) * 100))} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Current Year Insights */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t('yearInsights') || `${currentYear} Year Insights`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <h3 className="font-semibold mb-2">{t('timeRemaining') || `Time Remaining in ${currentYear}`}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('timeRemainingDescription', {
                        timeLeft: initialTimeLeft,
                        year: currentYear,
                        percentage: (100 - initialProgress).toFixed(1),
                        daysRemaining: daysRemaining
                      }) || `You have ${initialTimeLeft} left in ${currentYear}. This represents ${(100 - initialProgress).toFixed(1)}% of the current year. Make the most of the remaining ${daysRemaining} days in ${currentYear} to achieve your annual goals.`}
                    </p>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg">
                    <h3 className="font-semibold mb-2">{t('progressSummary') || `${currentYear} Progress Summary`}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('progressSummaryDescription', {
                        year: currentYear,
                        progress: initialProgress.toFixed(2),
                        daysElapsed: daysElapsed,
                        yearType: isLeapYear ? (t('leapYearType') || 'leap year') : (t('regularYearType') || 'regular year'),
                        totalDays: daysInCurrentYear
                      }) || `${currentYear} is ${initialProgress.toFixed(2)}% complete. You've experienced ${daysElapsed} days of ${currentYear} so far. The current year ${currentYear} ${isLeapYear ? 'is a leap year' : 'is a regular year'} with ${daysInCurrentYear} total days.`}
                    </p>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg">
                    <h3 className="font-semibold mb-2">{t('motivation') || `${currentYear} Motivation`}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('motivationDescription', { year: currentYear }) || `Every day in ${currentYear} is an opportunity to progress toward your goals. Track your ${currentYear} achievements and stay motivated throughout the current year. Use this ${currentYear} progress visualization to maintain focus on what matters most.`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mb-8">
              <p className="mb-4">{t('viewOtherYears')}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map((year) => (
                  <Link
                    key={year}
                    href={`/${locale === 'en' ? '' : locale + '/'}year-progress-bar/${year}`}
                    className={`px-4 py-2 rounded-md ${year === currentYear ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}
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
