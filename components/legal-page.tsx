import { getTranslations } from "next-intl/server"
import { getLocalePath } from "@/lib/locale-utils"
import { pageAlternates } from "@/lib/seo"
import { PageIntro, Section, Pill, monoLabel, h2Class } from "@/components/ds"

const sectionKeys = {
  privacy: ["overview", "collect", "analytics", "cookies", "thirdParties", "rights", "changes", "contact"],
  terms: ["acceptance", "use", "accuracy", "ip", "links", "liability", "changes", "contact"],
} as const
const summaryKeys = { privacy: ["stored", "collected", "sold"], terms: ["free", "asis", "yours"] } as const

const UPDATED = new Date(Date.UTC(2026, 9, 22))
const INTL: Record<string, string> = { "zh-hans": "zh-Hans", "zh-hant": "zh-Hant" }
const formatDate = (locale: string) => UPDATED.toLocaleDateString(INTL[locale] ?? locale, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })

export async function legalMetadata(kind: "privacy" | "terms", locale: string) {
  const t = await getTranslations({ locale, namespace: "legal" })
  const title = t(`${kind}MetaTitle`)
  const description = t(`${kind}MetaDesc`)
  return { title, description, alternates: pageAlternates(kind, locale), openGraph: { title, description, type: "website" } }
}

export async function LegalPage({ kind, locale }: { kind: "privacy" | "terms"; locale: string }) {
  const t = await getTranslations({ locale, namespace: "legal" })
  const sk = kind === "privacy" ? "privacySections" : "termsSections"
  const sm = kind === "privacy" ? "summary" : "termsSummary"
  const keys = sectionKeys[kind]
  const paragraphs = (key: string) => ["p1", "p2"].filter((p) => t.has(`${sk}.${key}.${p}`))

  return (
    <main>
      <PageIntro
        crumbs={[{ label: t("home"), href: getLocalePath("/", locale) }, { label: t(kind) }]}
        eyebrow={t("lastUpdated", { date: formatDate(locale) })}
        title={t(`${kind}Title`)}
        description={t(`${kind}Intro`)}
        right={
          <div className="flex gap-2">
            <Pill href={getLocalePath("/privacy", locale)} active={kind === "privacy"}>{t("privacy")}</Pill>
            <Pill href={getLocalePath("/terms", locale)} active={kind === "terms"}>{t("terms")}</Pill>
          </div>
        }
      />

      <Section top="clamp(24px,3vw,40px)">
        <ul className="m-0 grid list-none gap-px overflow-hidden rounded-[18px] border border-line bg-line p-0" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))" }}>
          {summaryKeys[kind].map((k) => (
            <li key={k} className="min-w-0 bg-surface px-6 py-5">
              <div className={monoLabel}>{t(`${sm}.${k}.k`)}</div>
              <p className="m-0 mt-2 text-[15px] leading-[1.6]">{t(`${sm}.${k}.v`)}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pb-[clamp(56px,8vw,96px)]">
        <div className="flex flex-wrap gap-x-16 gap-y-8">
          <nav aria-label={t("contents")} className="hidden min-w-0 flex-[0_0_220px] lg:block">
            <div className="sticky top-24">
              <div className={`${monoLabel} mb-3`}>{t("contents")}</div>
              <ol className="m-0 grid list-none gap-2 p-0 text-sm">
                {keys.map((k, i) => (
                  <li key={k}>
                    <a href={`#${k}`} className="text-subtle transition-colors hover:text-ink">
                      <span className="font-mono text-[11.5px]">{String(i + 1).padStart(2, "0")}</span> {t(`${sk}.${k}.title`)}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
          <div className="min-w-0 max-w-[720px] flex-[1_1_480px]">
            {keys.map((k, i) => (
              <section key={k} id={k} className="scroll-mt-24 border-t border-line py-8 first:border-t-0 first:pt-0">
                <div className={monoLabel}>{String(i + 1).padStart(2, "0")}</div>
                <h2 className={`${h2Class} mt-2`}>{t(`${sk}.${k}.title`)}</h2>
                {paragraphs(k).map((p) => (
                  <p key={p} className="m-0 mt-3 text-[15.5px] leading-[1.75] text-subtle">{t(`${sk}.${k}.${p}`)}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </Section>
    </main>
  )
}
