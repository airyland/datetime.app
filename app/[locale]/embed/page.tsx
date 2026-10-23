import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { getLocalePath } from "@/lib/locale-utils"
import { pageAlternates } from "@/lib/seo"
import { PageIntro, Section, SectionHeading, Stat, StatGrid, Faq, monoLabel } from "@/components/ds"
import EmbedDemo from "./embed-demo"
import { OG_IMAGES, TWITTER_IMAGES } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "embed" })
  return { title: t("metaTitle"), description: t("metaDesc"), alternates: pageAlternates("embed", locale), openGraph: {
    images: OG_IMAGES, title: t("metaTitle"), description: t("metaDesc"), type: "website" } }
}

export default async function EmbedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "embed" })
  const c = await getTranslations({ locale, namespace: "legal" })
  return (
    <main>
      <PageIntro
        crumbs={[{ label: c("home"), href: getLocalePath("/", locale) }, { label: t("crumb") }]}
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("desc")}
      />
      <Section top="clamp(24px,3vw,40px)">
        <EmbedDemo labels={{ theme: t("theme"), light: t("light"), dark: t("dark"), size: t("size"), iframeTitle: t("iframeTitle"), copy: t("copy") }} />
      </Section>

      <Section>
        <SectionHeading title={t("specsTitle")} description={t("specsDesc")} />
        <StatGrid>
          <Stat label={t("latency.label")} value="~140 ms" sub={t("latency.sub")} />
          <Stat label={t("uptime.label")} value="99.99%" sub={t("uptime.sub")} />
          <Stat label={t("requests.label")} value={t("requests.value")} sub={t("requests.sub")} />
          <Stat label={t("payload.label")} value="0 KB" sub={t("payload.sub")} />
        </StatGrid>
      </Section>

      <Section>
        <SectionHeading title={t("comparedTitle")} />
        <div className="grid gap-px overflow-hidden rounded-[18px] border border-line bg-line sm:grid-cols-2">
          <div className="bg-surface p-6"><div className={monoLabel}>{t("without")}</div><p className="m-0 mt-3 text-[15px] text-subtle"><code className="font-mono text-ink">new Date().getFullYear()</code> — {t("withoutText")}</p></div>
          <div className="bg-surface p-6"><div className={monoLabel}>{t("with")}</div><p className="m-0 mt-3 text-[15px] text-subtle">{t("withText")}</p></div>
        </div>
      </Section>

      <Faq title={t("faqTitle")} items={[1, 2, 3, 4, 5].map((n) => ({ q: t(`faq.q${n}`), a: t(`faq.a${n}`) }))} />
      <div className="pb-[clamp(56px,8vw,96px)]" />
    </main>
  )
}
