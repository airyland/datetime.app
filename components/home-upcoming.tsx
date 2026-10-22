"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Section, SectionHeading, cardClass, monoLabel } from "@/components/ds"
import { calendarDaysUntil, dateLabel, holidaysOf, slugOf } from "@/lib/countdown"
import { cn } from "@/lib/utils"

export function HomeUpcoming() {
  const t = useTranslations("homeUpcoming")
  const [items, setItems] = useState<{ id: string; name: string; tag: string; label: string; slug: string; days: number }[]>([])

  useEffect(() => {
    const now = Date.now()
    let tz = "UTC"
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC" } catch {}
    const y = new Date().getFullYear()
    const list = [...holidaysOf(y), ...holidaysOf(y + 1)]
      .map((h) => ({ id: h.id, name: h.name, tag: h.tag, label: dateLabel(h), slug: slugOf(h.id, h.year), days: calendarDaysUntil(h, now, tz) }))
      .filter((x) => x.days >= 0)
      .slice(0, 4)
    setItems(list)
  }, [])

  return (
    <Section>
      <SectionHeading
        title={t("title")}
        description={t("description")}
        right={<Link href="/countdown" className="text-sm text-subtle transition-colors hover:text-ink">{t("all")} →</Link>}
      />
      <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))" }}>
        {(items.length ? items : Array.from({ length: 4 }, () => null)).map((x, i) =>
          x ? (
            <Link key={x.id} href={`/countdown/${x.slug}`} className={cn(cardClass, "block p-5 transition-colors hover:border-ink")}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-lg font-medium tracking-[-0.02em]">{x.name}</span>
                <span className={monoLabel}>{x.tag}</span>
              </div>
              <div className="mt-1 text-sm text-subtle">{x.label}</div>
              <div className="tnum mt-5 font-mono text-[40px] font-light leading-none tracking-[-0.05em]">
                {x.days === 0 ? t("today") : <>{x.days}<span className="ml-2 text-sm tracking-normal text-subtle">{x.days === 1 ? t("day") : t("days")}</span></>}
              </div>
            </Link>
          ) : (
            <div key={i} className={cn(cardClass, "h-[158px]")} aria-hidden="true" />
          ),
        )}
      </div>
    </Section>
  )
}
