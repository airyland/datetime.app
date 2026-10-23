"use client"

import Link from "next/link"
import { Globe, Calculator, Calendar, PartyPopper, TrendingUp, Clock } from "lucide-react"
import { Section, cardClass } from "@/components/ds"
import { useLocale, useTranslations } from "next-intl"
import { getLocalePath } from "@/lib/locale-utils"

export default function NotFound() {
  const locale = useLocale()
  const t = useTranslations("notFound")

  const tools = [
    {
      title: t("worldClock"),
      description: t("worldClockDesc"),
      path: "/",
      icon: Globe,
    },
    {
      title: t("ageCalculator"),
      description: t("ageCalculatorDesc"),
      path: "/age-calculator",
      icon: Calculator,
    },
    {
      title: t("calendar"),
      description: t("calendarDesc"),
      path: "/calendar/2026",
      icon: Calendar,
    },
    {
      title: t("holidays"),
      description: t("holidaysDesc"),
      path: "/holidays",
      icon: PartyPopper,
    },
    {
      title: t("yearProgress"),
      description: t("yearProgressDesc"),
      path: "/year-progress-bar",
      icon: TrendingUp,
    },
    {
      title: t("utcTime"),
      description: t("utcTimeDesc"),
      path: "/utc",
      icon: Clock,
    },
  ]

  return (
    <main>
      <Section top="clamp(40px,7vw,96px)">
        <div className="max-w-[760px]">
          <p className="m-0 font-mono text-[clamp(64px,12vw,140px)] font-light leading-none tracking-[-0.05em] text-line2 select-none">404</p>
          <h1 className="m-0 mt-5 text-[clamp(32px,4.6vw,60px)] font-medium leading-[1.04] tracking-[-0.04em]">{t("title")}</h1>
          <p className="m-0 mt-4 max-w-[60ch] text-[clamp(15px,1.4vw,17px)] leading-relaxed text-subtle">{t("description")}</p>
        </div>
      </Section>
      <Section top="clamp(32px,4vw,56px)" className="pb-[clamp(56px,8vw,96px)]">
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,300px),1fr))" }}>
          {tools.map(({ title, description, path, icon: Icon }) => (
            <Link
              key={path}
              href={getLocalePath(path, locale)}
              className={`${cardClass} block p-[22px] transition-colors hover:border-ink`}
            >
              <span aria-hidden="true" className="inline-flex size-9 items-center justify-center rounded-full border border-line2 text-brand">
                <Icon className="size-4" strokeWidth={1.75} />
              </span>
              <h2 className="m-0 mt-3.5 text-lg font-semibold tracking-[-0.015em]">{title}</h2>
              <p className="m-0 mt-1.5 text-[15px] leading-[1.6] text-subtle">{description}</p>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  )
}
