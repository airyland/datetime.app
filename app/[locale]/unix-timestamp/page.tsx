import { Metadata } from "next"
import { Clock, Hash, Info } from "lucide-react"
import { Faq, PageIntro, Section, SectionHeading, cardClass } from "@/components/ds"
import { getLocalePath } from "@/lib/locale-utils"
import UnixTimestampClient from "./unix-timestamp-client"
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld"
import { getTranslations } from "next-intl/server"
import { OG_IMAGES, TWITTER_IMAGES } from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
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
    images: OG_IMAGES,
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
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "unixTimestamp" })

  const faqs = (["whatIs", "howToConvert", "howToConvertDate", "secondsOrMilliseconds", "y2038", "epoch"] as const).map((k) => ({
    question: t(`faqs.${k}.question`),
    answer: t(`faqs.${k}.answer`),
  }))

  const infoCards = [
    { icon: Hash, title: t("epochTimeTitle"), desc: t("epochTimeDesc") },
    { icon: Clock, title: t("secondsVsMillisecondsTitle"), desc: t("secondsVsMillisecondsDesc") },
    { icon: Info, title: t("whereUsedTitle"), desc: t("whereUsedDesc") },
    { icon: Hash, title: t("iso8601Title"), desc: t("iso8601Desc") },
  ]

  return (
    <>
      <PageIntro
        crumbs={[{ label: "Home", href: getLocalePath("/", locale) }, { label: t("pageTitle") }]}
        eyebrow={t("pageTitle")}
        eyebrowAs="p"
        title={t("pageTitle")}
        description={t("subtitle")}
      />

      <Section top="clamp(8px,2vw,24px)">
        <UnixTimestampClient />
      </Section>

      <Section top="clamp(40px,5vw,64px)">
        <SectionHeading title={t("aboutTitle")} />
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

      <Faq title={t("faqTitle")} items={faqs.map((f) => ({ q: f.question, a: f.answer }))} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
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
      <div className="pb-[clamp(56px,8vw,96px)]" />
    </>
  )
}
