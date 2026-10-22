"use client"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Section, inputClass, monoLabel, h2Class } from "@/components/ds"

interface GlossaryItem {
  id: string
  title: string
  shortDescription: string
  category: string
}

interface GlossaryClientProps {
  locale: string
  translations: {
    searchPlaceholder: string
    searchResults: string
    noResults: string
    allTerms: string
    categories: Record<string, string>
  }
  glossaryItems: Record<string, GlossaryItem>
}

export default function GlossaryClient({ locale, translations, glossaryItems }: GlossaryClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [cat, setCat] = useState("all")

  const categoryKeys = Object.keys(translations.categories)
  const entries = Object.entries(glossaryItems)
  const q = searchTerm.trim().toLowerCase()

  const matches = (item: GlossaryItem) =>
    (!q || item.title.toLowerCase().includes(q) || item.shortDescription.toLowerCase().includes(q)) &&
    (q || cat === "all" || item.category === cat)

  const visibleCount = entries.filter(([, item]) => matches(item)).length
  const heading = q
    ? translations.searchResults.replace("{count}", String(visibleCount))
    : cat === "all"
      ? translations.allTerms
      : translations.categories[cat]

  const tabs = [{ key: "all", label: translations.allTerms }, ...categoryKeys.map((k) => ({ key: k, label: translations.categories[k] }))]

  return (
    <Section top="clamp(8px,2vw,24px)">
      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-3">
        <div className="relative min-w-0 flex-[1_1_280px]">
          <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-3.5 size-4 text-subtle" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={translations.searchPlaceholder}
            aria-label={translations.searchPlaceholder}
            className={cn(inputClass, "h-[46px] rounded-full pl-11 pr-4")}
          />
        </div>
      </div>

      <div className={cn("mt-3.5 transition-opacity", q && "pointer-events-none opacity-40")}>
        <div role="tablist" aria-label="Category" className="inline-flex max-w-full flex-wrap gap-0.5 rounded-[22px] border border-line bg-surface p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={cat === t.key}
              onClick={() => setCat(t.key)}
              className={cn(
                "h-9 rounded-full px-4 text-sm font-medium transition-colors",
                cat === t.key ? "bg-ink text-paper" : "text-subtle hover:text-ink",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-baseline justify-between gap-4">
        <h2 className={h2Class}>{heading}</h2>
        <span className={cn(monoLabel, "tnum shrink-0")}>{visibleCount} / {entries.length}</span>
      </div>

      <div className="mt-5 grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,360px),1fr))" }}>
        {entries.map(([id, item]) => (
          <Link
            key={id}
            href={`/${locale === "en" ? "" : locale + "/"}glossary/${id}`}
            title={item.title}
            hidden={!matches(item)}
            className="group flex min-w-0 flex-col gap-3 rounded-[18px] border border-line bg-surface px-6 py-[22px] transition-colors hover:border-ink [&[hidden]]:hidden"
          >
            <div className="flex items-center justify-between gap-3">
              <span className={monoLabel}>{translations.categories[item.category]}</span>
              <span aria-hidden="true" className="text-subtle transition-all group-hover:-translate-y-[3px] group-hover:translate-x-[3px] group-hover:text-brand">↗</span>
            </div>
            <h3 className="m-0 text-[19px] font-medium leading-tight tracking-[-0.02em]">{item.title}</h3>
            <p className="m-0 text-[14.5px] leading-relaxed text-subtle">{item.shortDescription}</p>
          </Link>
        ))}
      </div>

      {visibleCount === 0 && (
        <p className="py-14 text-center text-[17px] text-ink">{translations.noResults}</p>
      )}
    </Section>
  )
}
