import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PageIntro, Section, monoLabel } from "@/components/ds"
import { CountdownLive, DaysAway, MonthCalendar } from "@/components/countdown/live"
import { COUNTDOWN_YEARS, MONTHS, allSlugs, dateLabel, getHoliday, holidaysOf, longName, parseSlug, slugOf, weekdayOf } from "@/lib/countdown"
import { CONTENT } from "@/lib/countdown-content"
import { pageAlternates } from "@/lib/seo"
import { cn } from "@/lib/utils"

type Props = { params: Promise<{ slug: string; locale: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = parseSlug(slug)
  const h = p && getHoliday(p.id, p.year)
  if (!h) return {}
  const title = `Days Until ${h.name} ${h.year} | Live Countdown | Datetime.app`
  const description = `How many days until ${h.name} ${h.year}? It falls on ${weekdayOf(h)}, ${dateLabel(h)}. Live countdown in days, hours, minutes and seconds, for any time zone.`
  return {
    title,
    description,
    alternates: { canonical: pageAlternates(`countdown/${slug}`, "en").canonical },
    openGraph: { title, description, type: "website", url: `https://datetime.app/countdown/${slug}` },
  }
}

const EXPECTED = ["ramadan", "eid-al-fitr", "eid-al-adha"]

const ABOUT: Record<string, string> = {
  christmas: "Christmas Day is fixed on December 25 in the Gregorian calendar. Many Orthodox churches follow the Julian calendar and celebrate on January 7. Christmas Eve is December 24 and Boxing Day is December 26.",
  "christmas-eve": "Christmas Eve is the evening and day before Christmas, December 24, and is the main celebration in many countries.",
  "new-year": "New Year's Day is January 1 in the Gregorian calendar and is a public holiday in most countries.",
  "new-years-eve": "New Year's Eve is December 31, the last day of the year. Celebrations begin at midnight local time, so the new year arrives first in the Pacific and last in Baker Island.",
  thanksgiving: "In the United States, Thanksgiving is observed on the fourth Thursday of November. Canada celebrates on the second Monday of October.",
  "black-friday": "Black Friday is the day after US Thanksgiving, the fourth Friday of November, and the traditional start of holiday shopping.",
  easter: "Easter Sunday is the first Sunday after the first full moon on or after the March equinox, so its date moves between March 22 and April 25.",
  "mothers-day": "In the United States, Canada and many other countries, Mother's Day is the second Sunday of May.",
  "independence-day": "Independence Day in the United States is July 4, marking the 1776 Declaration of Independence.",
  halloween: "Halloween is observed every year on October 31, the eve of All Saints' Day.",
  "valentines-day": "Valentine's Day is February 14 every year.",
  "lunar-new-year": "Lunar New Year falls on the new moon between late January and mid-February, so its Gregorian date changes every year.",
  diwali: "Diwali, the festival of lights, is held on the new moon of the Hindu month of Kartika, usually between mid-October and mid-November.",
}

export default async function CountdownDetail({ params }: Props) {
  const { slug } = await params
  const p = parseSlug(slug)
  const h = p && getHoliday(p.id, p.year)
  if (!p || !h) notFound()

  const c = CONTENT[h.id]
  const expected = EXPECTED.includes(h.id)
  const wd = weekdayOf(h)
  const related = holidaysOf(h.year).filter((x) => x.id !== h.id).sort((a, b) => Math.abs(a.month * 31 + a.day - (h.month * 31 + h.day)) - Math.abs(b.month * 31 + b.day - (h.month * 31 + h.day))).slice(0, 6)

  const faqs = [
    { q: `How many days until ${h.name} ${h.year}?`, a: `${h.name} ${h.year} is ${expected ? "expected on" : "on"} ${wd}, ${dateLabel(h)}${expected ? ", subject to the local moon sighting" : ""}. The live counter above shows the exact number of days, hours, minutes and seconds left, counted to midnight at the start of the day in your time zone.` },
    { q: `What day of the week is ${h.name} in ${h.year}?`, a: `${h.name} ${h.year} falls on a ${wd}.` },
    { q: `How many working days are left until ${h.name}?`, a: "The Working days figure counts Monday to Friday between tomorrow and the day before the holiday. Public holidays in your country are not subtracted." },
    ...(c?.faq ?? []),
    { q: `When is ${h.name} in ${COUNTDOWN_YEARS[0]}–${COUNTDOWN_YEARS[COUNTDOWN_YEARS.length - 1]}?`, a: COUNTDOWN_YEARS.map((y) => { const x = getHoliday(h.id, y)!; return `${y}: ${weekdayOf(x)}, ${MONTHS[x.month]} ${x.day}` }).join("; ") + "." },
    { q: "Which time zone does the countdown use?", a: "Your device's time zone by default. Use the time zone menu to count down to midnight anywhere else, for example when a friend is celebrating in a different country." },
  ]

  const doy = Math.round((Date.UTC(h.year, h.month, h.day) - Date.UTC(h.year, 0, 0)) / 864e5)
  const daysInYear = (h.year % 4 === 0 && h.year % 100 !== 0) || h.year % 400 === 0 ? 366 : 365
  const fromMonthStarts = MONTHS.map((m, i) => ({ m, d: Math.round((Date.UTC(h.year, h.month, h.day) - Date.UTC(h.year, i, 1)) / 864e5) })).filter((x) => x.d > 0)
  const facts: [string, string][] = [
    ["Date", `${wd}, ${dateLabel(h)}${expected ? " (expected)" : ""}`],
    ["Rule", c?.rule ?? "—"],
    ["Day of the year", `Day ${doy} of ${daysInYear}`],
    ["Days left in the year after it", String(daysInYear - doy)],
    ["Category", h.tag],
  ]
  const ZONES: [string, string][] = [["Auckland", "Pacific/Auckland"], ["Sydney", "Australia/Sydney"], ["Tokyo", "Asia/Tokyo"], ["Beijing", "Asia/Shanghai"], ["Mumbai", "Asia/Kolkata"], ["Dubai", "Asia/Dubai"], ["London", "Europe/London"], ["Paris", "Europe/Paris"], ["São Paulo", "America/Sao_Paulo"], ["New York", "America/New_York"], ["Chicago", "America/Chicago"], ["Los Angeles", "America/Los_Angeles"]]
  const startIn = (tz: string) => {
    const guess = Date.UTC(h.year, h.month, h.day)
    const off = (t: number) => { const q: Record<string, number> = {}; for (const x of new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).formatToParts(new Date(t))) if (x.type !== "literal") q[x.type] = Number(x.value); return Date.UTC(q.year, q.month - 1, q.day, q.hour, q.minute, q.second) - t }
    let t = guess - off(guess)
    t = guess - off(t)
    return new Date(t)
  }
  const around = ZONES.map(([city, tz]) => ({ city, t: startIn(tz) }))
    .sort((x, y) => x.t.getTime() - y.t.getTime())
    .map(({ city, t }) => ({ city, utc: `${t.toISOString().slice(11, 16)} UTC · ${MONTHS[t.getUTCMonth()].slice(0, 3)} ${t.getUTCDate()}` }))
  const two = "grid gap-x-14 gap-y-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
  const h2 = "m-0 text-[clamp(24px,2.6vw,32px)] font-semibold leading-[1.15] tracking-[-0.025em]"
  const short = `${MONTHS[h.month].slice(0, 3)} ${h.day}, ${h.year}`

  return (
    <main>
      <PageIntro
        crumbs={[{ label: "Home", href: "/" }, { label: "Holidays", href: "/holidays" }, { label: "Countdowns", href: "/countdown" }, { label: `${h.name} ${h.year}` }]}
        eyebrow={`Countdown · ${short}`}
        title={`How many days until ${h.name} ${h.year}?`}
        description={`${h.name} ${h.year} is ${expected ? "expected on" : "on"} ${wd}, ${dateLabel(h)}.${expected ? " The exact day depends on the local moon sighting and can differ by one day." : ""} See the exact countdown in days, hours, minutes and seconds, in your own time zone.`}
      />
      <Section top="clamp(8px,2vw,24px)">
        <CountdownLive id={h.id} year={h.year} name={h.name} kicker={longName(h.id, h.name)} years={COUNTDOWN_YEARS.map((y) => ({ year: y, href: `/countdown/${slugOf(h.id, y)}` }))} />
      </Section>

      <Section top="clamp(48px,6vw,72px)">
        <div className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <MonthCalendar year={h.year} month={h.month} day={h.day} name={h.name} />
          <div className="min-w-0 overflow-hidden rounded-[18px] border border-line bg-surface">
            <div className="flex items-baseline justify-between gap-3 px-6 pb-3.5 pt-[22px]">
              <h3 className="m-0 text-lg font-semibold tracking-[-0.02em]">{h.name} in other years</h3>
              <span className={monoLabel}>Days from today</span>
            </div>
            <div className="cl">
              {COUNTDOWN_YEARS.map((y) => {
                const x = getHoliday(h.id, y)!
                return (
                  <Link key={y} href={`/countdown/${slugOf(h.id, y)}`} className={cn("flex items-center gap-[18px] border-t border-line px-6 py-3 text-ink transition-colors hover:bg-paper", y === h.year && "bg-paper")}>
                    <span className="w-14 flex-none font-mono text-[15px]">{y}</span>
                    <span className="min-w-0 flex-1 text-[14.5px] text-subtle">{weekdayOf(x)}, {MONTHS[x.month]} {x.day}</span>
                    <span className="font-mono text-[15px]"><DaysAway year={x.year} month={x.month} day={x.day} bare /></span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </Section>

      <Section top="clamp(48px,6vw,72px)">
        <h2 className={cn(h2, "mb-6")}>Related countdowns</h2>
        <div className="flex flex-wrap gap-2.5">
          {related.map((x) => (
            <Link key={x.id} href={`/countdown/${slugOf(x.id, x.year)}`} className="flex min-h-11 items-center gap-3.5 rounded-full border border-line bg-surface px-[18px] py-2.5 text-ink transition-colors hover:border-ink">
              <span className="text-[14.5px] font-medium">{x.name}</span>
              <span className="font-mono text-[13px] text-subtle"><DaysAway year={x.year} month={x.month} day={x.day} /></span>
            </Link>
          ))}
        </div>
      </Section>

      <Section top="clamp(48px,6vw,72px)">
        <div className={two}>
          <h2 className={h2}>{h.name} {h.year} at a glance</h2>
          <dl className="m-0 min-w-0 overflow-hidden rounded-[18px] border border-line bg-surface">
            <div className="cl">
              {facts.map(([k, v]) => (
                <div key={k} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-line px-6 py-3.5">
                  <dt className={monoLabel}>{k}</dt>
                  <dd className="m-0 text-[15px]">{v}</dd>
                </div>
              ))}
            </div>
          </dl>
        </div>
      </Section>

      <Section top="clamp(48px,6vw,72px)">
        <div className={two}>
          <h2 className={h2}>About {h.name}</h2>
          <div className="max-w-[68ch] text-[15.5px] leading-[1.7] text-subtle">
            {(c?.origin ?? [ABOUT[h.id]]).map((t, i) => (
              <p key={i} className={cn("m-0", i > 0 && "mt-4")}>{t}</p>
            ))}
            <p className="m-0 mt-4">In {h.year} it falls on a {wd}. This countdown runs to the first moment of {MONTHS[h.month]} {h.day} in the time zone you choose, so the figure matches the calendar day on your wall.</p>
          </div>
        </div>
      </Section>

      {c && (
        <Section top="clamp(48px,6vw,72px)">
          <div className={two}>
            <h2 className={h2}>How {h.name} is celebrated</h2>
            <div className="max-w-[68ch]">
              <ul className="m-0 list-disc pl-5 text-[15.5px] leading-[1.7] text-subtle marker:text-line2">
                {c.traditions.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <h3 className="m-0 mb-2 mt-7 text-lg font-semibold tracking-[-0.02em]">Around the world</h3>
              <p className="m-0 text-[15.5px] leading-[1.7] text-subtle">{c.around}</p>
            </div>
          </div>
        </Section>
      )}

      <Section top="clamp(48px,6vw,72px)">
        <div className="mb-6">
          <h2 className={h2}>When {h.name} {h.year} begins around the world</h2>
          <p className="m-0 mt-2 max-w-[62ch] text-[15px] text-subtle">{h.name} starts at midnight local time, so it arrives in each city at a different moment. Times below are the start of {MONTHS[h.month]} {h.day} converted to UTC.</p>
        </div>
        <div className="overflow-hidden rounded-[18px] border border-line bg-surface">
          <div className="cl">
            {around.map((a) => (
              <div key={a.city} className="flex items-baseline justify-between gap-4 border-t border-line px-6 py-3">
                <span className="text-[15px] font-medium">{a.city}</span>
                <span className="font-mono text-[13.5px] text-subtle">{a.utc}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section top="clamp(48px,6vw,72px)">
        <h2 className={cn(h2, "mb-6")}>More tools and calendars</h2>
        <div className="flex flex-wrap gap-2.5">
          {[
            [`${MONTHS[h.month]} ${h.year} calendar`, `/calendar/${h.year}/${h.month + 1}`],
            [`${h.year} calendar`, `/calendar/${h.year}`],
            [`Year progress ${h.year}`, `/year-progress-bar/${h.year}`],
            ["Public holidays in the US", "/holidays/us"],
            ["Public holidays in the UK", "/holidays/gb"],
            ["Public holidays in Canada", "/holidays/ca"],
            ["Public holidays in Australia", "/holidays/au"],
            ["All holiday countdowns", "/countdown"],
            ["Current UTC time", "/utc"],
          ].map(([t, href]) => (
            <Link key={href} href={href} className="flex h-[38px] items-center rounded-full border border-line bg-surface px-4 font-mono text-[13px] text-ink transition-colors hover:border-ink">{t}</Link>
          ))}
        </div>
      </Section>

      {fromMonthStarts.length > 0 && (
        <Section top="clamp(48px,6vw,72px)">
          <div className="mb-6">
            <h2 className={h2}>Days until {h.name} from each month</h2>
            <p className="m-0 mt-2 max-w-[60ch] text-[15px] text-subtle">How far away {h.name} {h.year} is on the first day of each month.</p>
          </div>
          <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,150px),1fr))" }}>
            {fromMonthStarts.map(({ m, d }) => (
              <div key={m} className="rounded-2xl border border-line bg-surface px-[18px] py-4">
                <div className={monoLabel}>{m} 1</div>
                <div className="mt-1.5 font-mono text-[26px] font-light tracking-[-0.04em]">{d}</div>
                <div className="text-[13px] text-subtle">{d === 1 ? "day" : "days"} to go</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section top="clamp(48px,6vw,72px)">
        <div className={two}>
          <h2 className={h2}>Common questions</h2>
          <div className="min-w-0 overflow-hidden rounded-[18px] border border-line bg-surface">
            <div className="cl">
              {faqs.map((f, i) => (
                <details key={i} className="group border-t border-line" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-[16.5px] font-medium tracking-[-0.01em] marker:hidden [&::-webkit-details-marker]:hidden">
                    <h3 className="m-0 text-[length:inherit] font-[inherit] tracking-[inherit]">{f.q}</h3>
                    <span aria-hidden="true" className="flex-none font-mono text-xl font-light text-subtle"><span className="group-open:hidden">+</span><span className="hidden group-open:inline">−</span></span>
                  </summary>
                  <p className="m-0 max-w-[70ch] px-6 pb-[22px] text-[15px] leading-[1.65] text-subtle">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
            { "@context": "https://schema.org", "@type": "Event", name: `${h.name} ${h.year}`, startDate: `${h.year}-${String(h.month + 1).padStart(2, "0")}-${String(h.day).padStart(2, "0")}`, eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode", location: { "@type": "VirtualLocation", url: `https://datetime.app/countdown/${slug}` } },
          ]),
        }}
      />
      <div className="pb-[clamp(56px,8vw,96px)]" />
    </main>
  )
}
