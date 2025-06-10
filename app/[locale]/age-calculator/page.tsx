import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Clock, Calendar } from "lucide-react"
import HeaderClient from "../year-progress-bar/header-client"
import AgeCalculatorClient from "./age-calculator-client"
import { getTranslations } from 'next-intl/server'
import FAQSection from './faq-section'

export default async function AgeCalculator({ params }: { params: { locale: string } }) {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'ageCalculator' })
  // FAQ items about age calculation
  const ageCalculatorFaqs = [
    {
      question: t('faqs.howCalculated.question'),
      answer: t('faqs.howCalculated.answer')
    },
    {
      question: t('faqs.differFromOthers.question'),
      answer: t('faqs.differFromOthers.answer')
    },
    {
      question: t('faqs.customDates.question'),
      answer: t('faqs.customDates.answer')
    },
    {
      question: t('faqs.enterBirthDate.question'),
      answer: t('faqs.enterBirthDate.answer')
    },
    {
      question: t('faqs.howAccurate.question'),
      answer: t('faqs.howAccurate.answer')
    },
    {
      question: t('faqs.decimalAge.question'),
      answer: t('faqs.decimalAge.answer')
    },
    {
      question: t('faqs.whyNeedExact.question'),
      answer: t('faqs.whyNeedExact.answer')
    },
    {
      question: t('faqs.noNextBirthday.question'),
      answer: t('faqs.noNextBirthday.answer')
    }
  ]

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <HeaderClient />

      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
              {t('pageTitle')}
            </h1>
            <p className="text-xl text-center text-muted-foreground mb-8">
              {t('subtitle')}
            </p>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Calculator className="h-5 w-5" />
                  <span>{t('calculateYourAge')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AgeCalculatorClient />
              </CardContent>
            </Card>

            {/* Information Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-center">{t('aboutAgeCalculation')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{t('calendarPrecision')}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t('info.calendarPrecisionDesc')}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{t('realTimeUpdates')}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t('info.realTimeUpdatesDesc')}</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* FAQ Section */}
            <FAQSection title={t('faqTitle')} faqs={ageCalculatorFaqs} />
          </div>
        </div>
      </div>
    </main>
  )
}
