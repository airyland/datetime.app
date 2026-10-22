import { Calendar, Clock } from "lucide-react"
import { Faq, PageIntro, Section, SectionHeading, cardClass } from "@/components/ds"
import { getLocalePath } from "@/lib/locale-utils"
import AgeCalculatorClient from "./age-calculator-client"
import { BreadcrumbJsonLd } from '@/components/breadcrumb-jsonld'
import { getTranslations } from 'next-intl/server'

export default async function AgeCalculator({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
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

  const infoCards = [
    { icon: Calendar, title: t('calendarPrecision'), desc: t('info.calendarPrecisionDesc') },
    { icon: Clock, title: t('realTimeUpdates'), desc: t('info.realTimeUpdatesDesc') },
  ]

  return (
    <>
      <PageIntro
        crumbs={[{ label: "Home", href: getLocalePath("/", locale) }, { label: t('pageTitle') }]}
        eyebrow={t('pageTitle')}
        eyebrowAs="p"
        title={t('pageTitle')}
        description={t('subtitle')}
      />

      <Section top="clamp(8px,2vw,24px)">
        <div className={`${cardClass} p-[clamp(22px,3.4vw,44px)]`}>
          <AgeCalculatorClient />
        </div>
      </Section>

      {/* Information Section */}
      <Section top="clamp(24px,3vw,40px)">
        <SectionHeading title={t('aboutAgeCalculation')} />
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))" }}>
          {infoCards.map(({ icon: Icon, title, desc }) => (
            <div key={title} className={`${cardClass} px-7 py-[26px]`}>
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line2 text-brand">
                  <Icon className="size-4" strokeWidth={1.75} />
                </span>
                <h3 className="m-0 text-lg font-semibold tracking-[-0.015em]">{title}</h3>
              </div>
              <p className="m-0 mt-3.5 text-[15px] leading-[1.7] text-subtle">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ Section */}
      <Faq title={t('faqTitle')} items={ageCalculatorFaqs.map((f) => ({ q: f.question, a: f.answer }))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: ageCalculatorFaqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
          }),
        }}
      />
      <BreadcrumbJsonLd items={[{ name: "Home", url: "https://datetime.app" }, { name: "Age Calculator", url: "https://datetime.app/age-calculator" }]} />
    </>
  )
}
