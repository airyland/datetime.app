import { Section, Card, PageIntro, h2Class } from "@/components/ds"
import HolidaysClientPage from "./client-page"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "World Holidays Calendar | Browse Holidays by Country | Datetime.app",
  description: "Browse holidays from countries and regions around the world. Find public holidays, observances, and special days for over 200 countries with accurate dates.",
  keywords: ["world holidays", "international holidays", "public holidays", "holiday calendar", "national holidays", "global holidays", "country holidays"],
  openGraph: {
    title: "World Holidays Calendar | Browse Holidays by Country | Datetime.app",
    description: "Browse holidays from countries and regions around the world. Find public holidays, observances, and special days for over 200 countries with accurate dates.",
    type: "website",
    url: "https://datetime.app/holidays",
  },
}

export default function HolidaysPage() {
  return (
    <main>
      <PageIntro
        crumbs={[{ label: "Home", href: "/" }, { label: "Holidays" }]}
        eyebrow="Holidays"
        title="World Holidays Calendar"
        description="Browse holidays from countries and regions around the world"
      />

      {/* Client-side interactive components */}
      <Section top="clamp(24px,3vw,40px)">
        <HolidaysClientPage />
      </Section>

      {/* Information section */}
      <Section>
        <Card className="p-[clamp(22px,3vw,36px)]">
          <h2 className={h2Class}>About World Holidays</h2>
          <p className="mb-0 mt-4 max-w-[70ch] leading-relaxed text-subtle">
            This page provides information about holidays around the world. You can browse holidays by country and region,
            and view them in different languages. The data includes public holidays, bank holidays, school holidays,
            and observances.
          </p>
          <p className="mb-0 mt-3 max-w-[70ch] leading-relaxed text-subtle">
            Select a country from the list above to see its holidays. For some countries, you can also view holidays
            for specific regions or states.
          </p>
        </Card>
      </Section>
    </main>
  )
}
