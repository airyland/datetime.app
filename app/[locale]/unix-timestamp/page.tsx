import { Metadata } from "next"
import { Clock, Hash, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import HeaderClient from "../year-progress-bar/header-client"
import UnixTimestampClient from "./unix-timestamp-client"
import FAQSection from "../age-calculator/faq-section"
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  return {
    title: "Unix Timestamp Converter | Datetime.app",
    description:
      "Convert Unix timestamps to human-readable dates and back. See local time, UTC, ISO 8601, and relative time for any epoch value. Free online Unix / epoch timestamp converter.",
    keywords: [
      "unix timestamp",
      "epoch converter",
      "timestamp to date",
      "date to timestamp",
      "epoch time",
      "unix time converter",
      "unix epoch",
      "timestamp converter",
      "epoch to date",
      "utc timestamp",
      "iso 8601 converter",
      "unix time online",
    ],
    alternates: {
      canonical: "https://datetime.app/unix-timestamp",
    },
    openGraph: {
      title: "Unix Timestamp Converter | Datetime.app",
      description:
        "Convert Unix timestamps to human-readable dates and back. See local time, UTC, ISO 8601, and relative time for any epoch value.",
      type: "website",
    },
  }
}

export default async function UnixTimestampPage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: "unixTimestamp" })

  const faqs = [
    {
      question: t("faqs.whatIs.question"),
      answer: t("faqs.whatIs.answer"),
    },
    {
      question: t("faqs.howToConvert.question"),
      answer: t("faqs.howToConvert.answer"),
    },
    {
      question: t("faqs.howToConvertDate.question"),
      answer: t("faqs.howToConvertDate.answer"),
    },
    {
      question: t("faqs.secondsOrMilliseconds.question"),
      answer: t("faqs.secondsOrMilliseconds.answer"),
    },
    {
      question: t("faqs.y2038.question"),
      answer: t("faqs.y2038.answer"),
    },
    {
      question: t("faqs.epoch.question"),
      answer: t("faqs.epoch.answer"),
    },
  ]

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <HeaderClient />

      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
              {t("pageTitle")}
            </h1>
            <p className="text-xl text-center text-muted-foreground mb-8">
              {t("subtitle")}
            </p>

            {/* Interactive client component */}
            <div className="mb-8">
              <UnixTimestampClient />
            </div>

            {/* Information cards */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-center">{t("aboutTitle")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Hash className="h-4 w-4" aria-hidden="true" />
                      {t("epochTimeTitle")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t("epochTimeDesc")}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      {t("secondsVsMillisecondsTitle")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t("secondsVsMillisecondsDesc")}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="h-4 w-4" aria-hidden="true" />
                      {t("whereUsedTitle")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t("whereUsedDesc")}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Hash className="h-4 w-4" aria-hidden="true" />
                      {t("iso8601Title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t("iso8601Desc")}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* FAQ Section */}
            <FAQSection title={t("faqTitle")} faqs={faqs} />

            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: faq.answer,
                    },
                  })),
                }),
              }}
            />

            <BreadcrumbJsonLd
              items={[
                { name: "Home", url: "https://datetime.app" },
                { name: "Unix Timestamp Converter", url: "https://datetime.app/unix-timestamp" },
              ]}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
