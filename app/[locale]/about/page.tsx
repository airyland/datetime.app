import { PageIntro, Section, SectionHeading, CardList, RowLink, cardClass, h2Class, monoLabel } from "@/components/ds"
import Link from "next/link"
import { getLocale } from "next-intl/server"
import { getLocalePath } from "@/lib/locale-utils"
import UtcClock from "./utc-clock"
import { pageAlternates } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return { alternates: pageAlternates("about", locale) }
}

const features = [
  ["Clean and intuitive interface", "Nothing between you and the time. Large type, calm colour, no clutter."],
  ["Precise time display and conversion", "Live clocks to the second, kept in step with your device and the IANA database."],
  ["Support for multiple time formats", "ISO 8601, Unix, RFC 2822 and local formats, each one tap away to copy."],
  ["Convenient timezone conversion", "Compare cities and zones side by side and see the offset at a glance."],
  ["Perfect for remote team collaboration", "Find the overlap in working hours across cities without the mental maths."],
  ["Developer-friendly features", "Copy-ready timestamps and Intl snippets for the zone you are looking at."],
]

const linkClass = "text-ink underline decoration-line2 underline-offset-4 transition-colors hover:decoration-brand"

export default async function AboutPage() {
  const locale = await getLocale()
  return (
    <main>
      <PageIntro crumbs={[{ label: "Home", href: getLocalePath("/", locale) }, { label: "About" }]} eyebrow="About" title="About datetime.app" />

      <Section top="clamp(8px,2vw,24px)">
        <div className="mt-[clamp(8px,2vw,24px)] flex flex-wrap items-end gap-x-16 gap-y-7">
          <p className="m-0 max-w-[26em] flex-[3_1_460px] text-[clamp(24px,3.2vw,40px)] font-medium leading-[1.25] tracking-[-0.03em]">
            datetime.app is a clean and powerful time viewing and conversion tool designed for developers, remote teams, and{" "}
            <span className="text-subtle">anyone who needs to work with different time zones.</span>
          </p>
          <UtcClock label="UTC now" />
        </div>
      </Section>

      <Section>
        <SectionHeading title="Features" description="What you get, and nothing you do not." />
        <ul className="m-0 grid list-none gap-px overflow-hidden rounded-[18px] border border-line bg-line p-0" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))" }}>
          {features.map(([title, desc], i) => (
            <li key={title} className="min-w-0 bg-surface px-[26px] py-6">
              <div className={monoLabel}>{String(i + 1).padStart(2, "0")}</div>
              <h3 className="m-0 mt-5 text-lg font-semibold tracking-[-0.02em]">{title}</h3>
              <p className="m-0 mt-2 text-[14.5px] leading-[1.65] text-subtle">{desc}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className={`${cardClass} flex flex-wrap gap-x-16 gap-y-5 p-[clamp(24px,3.4vw,44px)]`}>
          <div className="min-w-0 flex-[1_1_220px]">
            <h2 className={h2Class}>Technology</h2>
          </div>
          <p className="m-0 min-w-0 max-w-[72ch] flex-[3_1_520px] text-[15.5px] leading-[1.75] text-subtle">
            datetime.app is developed by the <Link href="https://datetime.app" className={linkClass} title="Visit datetime.app homepage">datetime.app</Link> team,
            powered by <Link href="https://v0.dev" className={linkClass} title="Visit v0.dev - AI-powered development platform">v0.dev</Link> and Windsurf technology,
            with design inspiration from <Link href="https://time.is" className={linkClass} title="Visit time.is - World Clock and Time Zone Converter">time.is</Link>,
            dedicated to providing the best time management experience for our users.
          </p>
        </div>
      </Section>

      <Section className="pb-[clamp(56px,8vw,96px)]">
        <SectionHeading title="Elsewhere" />
        <CardList>
          <RowLink href="https://github.com/airyland/datetime.app" title="GitHub" label="GitHub" description="airyland/datetime.app" />
          <RowLink href="https://x.com/we_webmaster" title="X (Twitter)" label="X (Twitter)" description="@we_webmaster" />
          <RowLink href="https://www.producthunt.com/products/datetime-app-world-clock-time" title="Product Hunt" label="Product Hunt" description="datetime.app on Product Hunt" />
          <RowLink href="https://a.coffee/becool" title="More Products" label="More products" description="Other things from the same maker" />
        </CardList>
      </Section>
    </main>
  )
}
