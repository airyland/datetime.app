import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"
import { Section, SectionHeading, Card, Pill, cardClass, monoLabel, h2Class } from "@/components/ds"

// Plain (hook-free) component: rendered into the page HTML so crawlers see real content.

const nthSunday = (year: number, month: number, n: number) => {
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay()
  return 1 + ((7 - first) % 7) + (n - 1) * 7
}
const lastSunday = (year: number, month: number) => {
  const last = new Date(Date.UTC(year, month + 1, 0))
  return last.getUTCDate() - last.getUTCDay()
}
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const fmt = (m: number, d: number) => `${MON[m]} ${d}`

const factKeys: [string, string][] = [["utc", "UTC"], ["gmt", "GMT"], ["iana", "IANA"], ["dst", "DST"], ["iso", "ISO 8601"], ["unix", "Unix time"]]

const zones: [string, string, string][] = [
  ["pst", "PST / PDT", "/timezones/pst"],
  ["est", "EST / EDT", "/timezones/est"],
  ["cst", "CST / CDT", "/timezones/cst"],
  ["gmt", "GMT", "/timezones/gmt"],
  ["cet", "CET / CEST", "/timezones/cet"],
  ["ist", "IST", "/timezones/ist"],
  ["jst", "JST", "/timezones/jst"],
  ["aest", "AEST / AEDT", "/timezones/aest"],
]

const useKeys = ["remote", "dev", "travel", "trade"]

export function HomeSeoSections({ year, localePath }: { year: number; localePath: (p: string) => string }) {
  const t = useTranslations("homeSeo")
  const dst = [
    { key: "us", start: fmt(2, nthSunday(year, 2, 2)), end: fmt(10, nthSunday(year, 10, 1)) },
    { key: "eu", start: fmt(2, lastSunday(year, 2)), end: fmt(9, lastSunday(year, 9)) },
    { key: "au", start: fmt(9, nthSunday(year, 9, 1)), end: fmt(3, nthSunday(year, 3, 1)) },
  ]
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: "Datetime.app", url: "https://datetime.app" },
          ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Section top="clamp(64px,9vw,112px)">
        <div className="flex flex-wrap gap-x-16 gap-y-7">
          <div className="min-w-0 flex-[1_1_220px]">
            <h2 className={h2Class}>{t("introTitle")}</h2>
          </div>
          <div className={`${cardClass} min-w-0 flex-[3_1_520px] rounded-[18px] p-[clamp(22px,3vw,36px)] text-[15.5px] leading-[1.75] text-subtle`}>
            <p className="m-0">{t("intro1")}</p>
            <p className="m-0 mt-4">{t("intro2")}</p>
          </div>
        </div>
      </Section>

      <Section top="clamp(64px,9vw,112px)">
        <SectionHeading title={t("basicsTitle")} description={t("basicsDesc")} />
        <ul className="m-0 grid list-none gap-px overflow-hidden rounded-[18px] border border-line bg-line p-0" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))" }}>
          {factKeys.map(([key, code]) => (
            <li key={key} className="min-w-0 bg-surface px-[26px] py-6">
              <div className={monoLabel}>{code}</div>
              <h3 className="m-0 mt-4 text-lg font-semibold tracking-[-0.02em]">{t(`facts.${key}.name`)}</h3>
              <p className="m-0 mt-2 text-[14.5px] leading-[1.65] text-subtle">{t(`facts.${key}.desc`)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-5"><Link href={localePath("/glossary")} className="inline-flex items-center gap-2 text-sm text-subtle hover:text-ink">{t("glossaryLink")} <ArrowRight className="size-3.5 rtl:rotate-180" /></Link></div>
      </Section>

      <Section top="clamp(64px,9vw,112px)">
        <SectionHeading title={t("zonesTitle")} description={t("zonesDesc")} />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-2.5">
          {zones.map(([key, name, href]) => (
            <Link key={key} href={localePath(href)} title={t("zoneTitle", { name })} className={`${cardClass} block px-5 py-4 transition-colors hover:border-ink`}>
              <div className="text-lg font-semibold tracking-[-0.02em]">{name}</div>
              <div className="mt-1 font-mono text-[12px] text-subtle">{t(`zoneMeta.${key}`)}</div>
            </Link>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Pill href={localePath("/iana-timezones")}>{t("allIana")}</Pill>
          <Pill href={localePath("/utc")}>{t("utcNow")}</Pill>
        </div>
      </Section>

      <Section top="clamp(64px,9vw,112px)">
        <SectionHeading title={t("dstTitle", { year })} description={t("dstDesc")} />
        <div className={`${cardClass} overflow-hidden rounded-[18px]`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-start text-[15px]">
              <thead>
                <tr className="border-b border-line">
                  {["region", "forward", "back", "rule"].map((h) => (
                    <th key={h} scope="col" className={`${monoLabel} px-5 py-3.5 text-start font-normal`}>{t(`dstCols.${h}`)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dst.map((r) => (
                  <tr key={r.key} className="border-t border-line first:border-t-0">
                    <th scope="row" className="px-5 py-4 text-start font-medium">{t(`dstRegions.${r.key}.name`)}</th>
                    <td className="tnum px-5 py-4 font-mono">{r.start}</td>
                    <td className="tnum px-5 py-4 font-mono">{r.end}</td>
                    <td className="px-5 py-4 text-subtle">{t(`dstRegions.${r.key}.rule`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="m-0 mt-3 text-[13px] text-subtle">{t("dstNote")}</p>
      </Section>

      <Section top="clamp(64px,9vw,112px)">
        <SectionHeading title={t("usesTitle")} />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-2.5">
          {useKeys.map((k) => (
            <Card key={k} className="p-6">
              <h3 className="m-0 text-lg font-semibold tracking-[-0.02em]">{t(`uses.${k}.title`)}</h3>
              <p className="m-0 mt-2 text-[14.5px] leading-[1.65] text-subtle">{t(`uses.${k}.desc`)}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
