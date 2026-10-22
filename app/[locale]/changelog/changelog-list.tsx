"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Section, monoLabel } from "@/components/ds"

type Type = "added" | "changed" | "fixed" | "removed"
interface Entry {
  date: string
  changes: { type: Type; description: string }[]
}

const typeClass: Record<Type, string> = {
  added: "border-ok text-ok",
  changed: "border-brand text-brand",
  fixed: "border-line2 text-ink",
  removed: "border-line2 text-subtle",
}

const tabs: { key: "all" | Type; label: string }[] = [
  { key: "all", label: "All" },
  { key: "added", label: "Added" },
  { key: "changed", label: "Changed" },
  { key: "fixed", label: "Fixed" },
  { key: "removed", label: "Removed" },
]

function fmt(date: string) {
  const [y, m, d] = date.split("-").map(Number)
  const mon = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })
  return { md: `${mon} ${d}`, year: String(y), full: new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }) }
}

export default function ChangelogList({ entries }: { entries: Entry[] }) {
  const [filter, setFilter] = useState<"all" | Type>("all")
  const count = entries.reduce((n, e) => n + e.changes.filter((c) => filter === "all" || c.type === filter).length, 0)

  return (
    <Section top="clamp(8px,2vw,24px)">
      <div className="flex flex-wrap items-center justify-between gap-x-3.5 gap-y-3">
        <div role="tablist" aria-label="Change type" className="inline-flex max-w-full flex-wrap gap-0.5 rounded-[22px] border border-line bg-surface p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={filter === t.key}
              onClick={() => setFilter(t.key)}
              className={cn("h-9 rounded-full px-4 text-sm font-medium transition-colors", filter === t.key ? "bg-ink text-paper" : "text-subtle hover:text-ink")}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className={cn(monoLabel, "tnum")}>{count} changes</span>
      </div>

      <div className="mt-7 border-t border-line">
        {entries.map((entry, gi) => {
          const f = fmt(entry.date)
          const visible = entry.changes.some((c) => filter === "all" || c.type === filter)
          return (
            <article key={entry.date} hidden={!visible} className="flex flex-wrap gap-x-14 gap-y-4 border-b border-line py-8 [&[hidden]]:hidden">
              <div className="flex-[0_0_190px]">
                <div className="sticky top-24">
                  <h2 className="m-0 text-[32px] font-light leading-none tracking-[-0.045em]">
                    <time dateTime={entry.date} title={f.full} className="tnum font-mono">{f.md}</time>
                  </h2>
                  <div className={cn(monoLabel, "mt-2")}>{f.year}</div>
                  {gi === 0 && (
                    <div className="mt-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.08em] text-brand">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                      Latest
                    </div>
                  )}
                </div>
              </div>
              <ul className="cl m-0 min-w-0 flex-[1_1_420px] list-none p-0">
                {entry.changes.map((c, i) => (
                  <li
                    key={i}
                    hidden={filter !== "all" && c.type !== filter}
                    className="flex items-baseline gap-4 border-t border-line py-[11px] [&[hidden]]:hidden"
                  >
                    <span className={cn("w-[76px] flex-none rounded-full border py-0.5 text-center font-mono text-[10.5px] uppercase tracking-[.08em]", typeClass[c.type])}>{c.type}</span>
                    <span className="min-w-0 text-[15.5px] leading-[1.55]">{c.description}</span>
                  </li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>
    </Section>
  )
}
