"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { PageIntro, Section } from "@/components/ds"
import { CountdownLive } from "@/components/countdown/live"
import { MONTHS } from "@/lib/countdown"

/** Countdown for any holiday from /holidays (name, country and date come from the query string). */
export function HolidayCountdownClient() {
  const sp = useSearchParams()
  const name = (sp.get("n") ?? "").slice(0, 80)
  const country = (sp.get("c") ?? "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2)
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(sp.get("d") ?? "")
  if (!name || !m) {
    return (
      <Section>
        <PageIntro title="Holiday countdown" description="Pick a holiday from the holiday calendar to start a countdown." />
        <Link href="/holidays" className="text-brand hover:underline">Browse holidays →</Link>
      </Section>
    )
  }
  const date = { year: Number(m[1]), month: Number(m[2]) - 1, day: Number(m[3]) }
  return (
    <>
      <PageIntro
        eyebrow={country ? `Countdown · ${country}` : "Countdown"}
        title={`Days until ${name}`}
        description={`${name} falls on ${MONTHS[date.month]} ${date.day}, ${date.year}.`}
      />
      <Section>
        <CountdownLive year={date.year} name={name} date={date} />
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
          {country && <Link href={`/holidays/${country.toLowerCase()}`} className="text-brand hover:underline">All {country} holidays →</Link>}
          <Link href="/countdown" className="text-brand hover:underline">All countdowns →</Link>
        </div>
      </Section>
    </>
  )
}
