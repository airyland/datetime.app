import { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { Clock, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { calculateYearProgress, calculateTimeLeft } from "@/lib/year-progress"
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
    title: `${t('pageTitle', { year: currentYear })} - ${progress.toFixed(2)}% Complete | Datetime.app`,
    description: `${t('subtitle', { year: currentYear, progress: progress.toFixed(2) })} with ${timeLeft}. ${t('description')}`,
    keywords: ["year progress", "year progress bar", `${currentYear} progress`, `${progress.toFixed(0)}% complete`, "time left in year", "days left in year", "year completion", "year tracker", "time tracking"],
    openGraph: {
      title: `${t('pageTitle', { year: currentYear })} - ${progress.toFixed(2)}% Complete | Datetime.app`,
      description: `${t('subtitle', { year: currentYear, progress: progress.toFixed(2) })} with ${timeLeft}. ${t('description')}`,
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

  console.log(yearProgressFaqs)

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
                  initialTimeLeft={initialTimeLeft}
                  currentYear={currentYear}
                />
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
