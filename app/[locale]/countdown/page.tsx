import type { Metadata } from "next"
import Link from "next/link"
import { PageIntro, Section } from "@/components/ds"
import { CountdownHub } from "@/components/countdown/hub"
import { COUNTDOWN_YEARS, dateLabel, getHoliday, holidaysOf, longName, slugOf, weekdayOf } from "@/lib/countdown"
import { pageAlternates } from "@/lib/seo"
import { OG_IMAGES, TWITTER_IMAGES } from "@/lib/seo"

const title = "Holiday Countdowns | Days Until Christmas, New Year & More | Datetime.app"
const description = "Live countdowns to Christmas, New Year, Thanksgiving, Easter, Halloween and more. See exactly how many days, hours and minutes are left, in your time zone."

export function generateMetadata(): Metadata {
  return {
    title,
    description,
    alternates: { canonical: pageAlternates("countdown", "en").canonical },
    openGraph: {
    images: OG_IMAGES, title, description, type: "website", url: "https://datetime.app/countdown" },
  }
}

const faqs = [
  { q: "How are the countdowns calculated?", a: "Each countdown runs to the first moment of the holiday, midnight at the start of the day, in the time zone you pick. By default that is the time zone of your device." },
  { q: "Why does the number of days differ from the clock?", a: "The large number counts calendar days, the way people say it: tomorrow is 1 day away. The days, hours, minutes and seconds row shows the exact time left, so it can read one day lower." },
  { q: "Which holidays move from year to year?", a: "Easter, Thanksgiving, Mother’s Day, Black Friday, Lunar New Year and Diwali change date each year. Their dates are calculated for every year shown." },
  { q: "Can I count down to my own date?", a: "Not yet. A custom date countdown is planned for this section. Every holiday listed in a country's holiday calendar already has its own countdown." },
]

const h2 = "m-0 text-[clamp(24px,2.6vw,32px)] font-semibold leading-[1.15] tracking-[-0.025em]"

export default function CountdownPage() {
  const base = new Date().getFullYear()
  const today = new Date()
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  return (
    <main>
      <PageIntro
        crumbs={[{ label: "Home", href: "/" }, { label: "Holidays", href: "/holidays" }, { label: "Countdowns" }]}
        eyebrow={`Holiday countdowns · ${base}`}
        title="How many days until the next holiday?"
        description={`Live countdowns to Christmas, New Year, Thanksgiving, Easter and more, from ${base} onward. Days, hours, minutes and seconds, in your own time zone.`}
      />
      <CountdownHub baseYear={base} />
      <Section top="clamp(48px,6vw,72px)">
        <div className="grid gap-x-14 gap-y-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <h2 className={h2}>About these countdowns</h2>
          <div className="max-w-[68ch] text-[15.5px] leading-[1.7] text-subtle">
            <p className="m-0">Every page counts the time left until the first moment of the holiday, midnight at the start of the day, in the time zone you choose. You see the number of calendar days, the exact days, hours, minutes and seconds, the number of weeks, the working days and weekends in between, and how far through the year you are.</p>
            <p className="m-0 mt-4">We cover fixed-date holidays such as Christmas, New Year&apos;s Day, Halloween and Independence Day, and moving dates such as Easter, Thanksgiving, Mother&apos;s Day, Black Friday, Lunar New Year and Diwali. Every date is calculated in advance for {COUNTDOWN_YEARS[0]} to {COUNTDOWN_YEARS[COUNTDOWN_YEARS.length - 1]}. For holidays that are not listed here, open a country in the <Link href="/holidays" className="text-ink underline underline-offset-2">holiday calendar</Link> and use its Countdown link.</p>
          </div>
        </div>
      </Section>
      {[base, base + 1].map((y) => (
        <Section key={y} top="clamp(48px,6vw,72px)">
          <div className="mb-6">
            <h2 className={h2}>Holiday dates in {y}</h2>
            <p className="m-0 mt-2 max-w-[60ch] text-[15px] text-subtle">Every countdown for {y}, in calendar order.</p>
          </div>
          <div className="overflow-hidden rounded-[18px] border border-line bg-surface">
            <div className="cl">
              {holidaysOf(y).map((x) => (
                <Link key={x.id} href={`/countdown/${slugOf(x.id, x.year)}`} className="flex flex-wrap items-center gap-x-[18px] gap-y-1 border-t border-line px-6 py-3.5 text-ink transition-colors hover:bg-paper">
                  <span className="min-w-0 flex-1 basis-[200px] text-[15.5px] font-medium">{longName(x.id, x.name)} {x.year}</span>
                  <span className="text-[14.5px] text-subtle">{weekdayOf(x)}, {dateLabel(x)}</span>
                  <span className="font-mono text-[13px] text-brand">Countdown →</span>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      ))}
      <Section top="clamp(48px,6vw,72px)">
        <div className="mb-6">
          <h2 className={h2}>Christmas countdown by year</h2>
          <p className="m-0 mt-2 max-w-[60ch] text-[15px] text-subtle">The most searched countdown, for the years ahead.</p>
        </div>
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))" }}>
          {COUNTDOWN_YEARS.map((y) => {
            const x = getHoliday("christmas", y)!
            const days = Math.round((Date.UTC(y, 11, 25) - todayUtc) / 864e5)
            return (
              <Link key={y} href={`/countdown/${slugOf("christmas", y)}`} className="block rounded-2xl border border-line bg-surface px-5 py-[18px] text-ink transition-colors hover:border-ink">
                <div className="font-mono text-[22px] font-light tracking-[-0.03em]">Christmas {y}</div>
                <div className="mt-1.5 text-[13.5px] text-subtle">{weekdayOf(x)} · {days} days</div>
              </Link>
            )
          })}
        </div>
      </Section>
      <Section top="clamp(48px,6vw,72px)">
        <div className="grid gap-x-14 gap-y-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <h2 className={h2}>Common questions</h2>
            <p className="m-0 mt-2.5 text-[15px] leading-[1.6] text-subtle">How the countdowns work and what they count.</p>
          </div>
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
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />
      <div className="pb-[clamp(56px,8vw,96px)]" />
    </main>
  )
}
