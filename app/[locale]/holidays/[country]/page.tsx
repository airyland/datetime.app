import { notFound } from "next/navigation"
import { Section, Card, PageIntro, SectionHeading, Pill, h2Class } from "@/components/ds"
import {
  COUNTRIES,
  REGIONS,
  RegionInfo,
  getHolidays
} from "@/lib/holidays"
import CountryHolidaysClientPage from "./client-page"
import { Metadata } from "next"

interface CountryHolidaysProps {
  params: Promise<{ country: string }>
  searchParams: Promise<{ lang?: string; year?: string }>
}

export async function generateMetadata({ params, searchParams: searchParamsPromise }: CountryHolidaysProps): Promise<Metadata> {
  const { country } = await params
  const searchParams = await searchParamsPromise
  const countryInfo = COUNTRIES.find(c => c.code.toLowerCase() === country.toLowerCase())
  
  if (!countryInfo) {
    return {
      title: "Country Not Found | Datetime.app",
      description: "The requested country could not be found."
    }
  }
  
  const year = searchParams.year ? parseInt(searchParams.year) : new Date().getFullYear()
  
  return {
    title: `${countryInfo.name} Holidays ${year} | Public Holiday Calendar | Datetime.app`,
    description: `Complete list of public holidays and observances in ${countryInfo.name} for ${year}. National holidays, bank holidays, and special observances with dates.`,
    keywords: [`${countryInfo.name} holidays`, `${countryInfo.name} public holidays`, `${countryInfo.name} holiday calendar`, `${year} holidays`, `national holidays ${countryInfo.name}`],
    openGraph: {
      title: `${countryInfo.name} Holidays ${year} | Public Holiday Calendar | Datetime.app`,
      description: `Complete list of public holidays and observances in ${countryInfo.name} for ${year}. National holidays, bank holidays, and special observances with dates.`,
      type: "website",
      url: `https://datetime.app/holidays/${country}`,
    },
    alternates: {
      canonical: `https://datetime.app/holidays/${country}`
    }
  }
}

export default async function CountryHolidaysPage({ params, searchParams }: CountryHolidaysProps) {
  const { country } = await params
  const searchParams_ = await searchParams
  const langParam = searchParams_.lang || 'en'
  const yearParam = searchParams_.year ? parseInt(searchParams_.year) : new Date().getFullYear()

  // Find country info
  const countryInfo = COUNTRIES.find(c => c.code.toLowerCase() === country.toLowerCase())

  // If country doesn't exist, show 404
  if (!countryInfo) {
    notFound()
  }

  // Get regions for this country
  const countryRegions = REGIONS[countryInfo.code] || []

  // Get holidays for server-side rendering
  const holidays = getHolidays(
    countryInfo.code,
    yearParam,
    langParam
  )

  return (
    <main>
      <PageIntro
        crumbs={[{ label: "Home", href: "/" }, { label: "Holidays", href: "/holidays" }, { label: countryInfo.name }]}
        eyebrow={`Public holidays · ${countryInfo.code}`}
        title={`Holidays in ${countryInfo.name}`}
        description={`Public holidays and observances in ${countryInfo.name} for ${yearParam}, grouped by month.`}
      />

      {/* Client-side interactive components */}
      <Section top="clamp(24px,3vw,40px)">
        <CountryHolidaysClientPage
          countryCode={countryInfo.code}
          countryName={countryInfo.name}
          initialYear={yearParam}
          initialLanguage={langParam}
          initialHolidays={holidays}
        />
      </Section>

      {/* Regions section (if available) */}
      {countryRegions.length > 0 && (
        <Section top="clamp(40px,5vw,64px)">
          <SectionHeading title="Regions" description="Some holidays differ by state or region." />
          <div className="flex flex-wrap gap-2.5">
            {countryRegions.map((region: RegionInfo) => (
              <Pill
                key={region.code}
                href={`/holidays/${country}/${region.code.toLowerCase()}?lang=${langParam}`}
                title={`View holidays in ${region.name}`}
              >
                {region.name}
              </Pill>
            ))}
          </div>
        </Section>
      )}

      {/* SEO content */}
      <Section>
        <Card className="p-[clamp(22px,3vw,36px)]">
          <h2 className={h2Class}>About {countryInfo.name} Holidays</h2>
          <p className="mb-0 mt-4 max-w-[70ch] leading-relaxed text-subtle">
            This page provides a comprehensive list of holidays in {countryInfo.name} for {yearParam}.
            The list includes public holidays, bank holidays, school holidays, and observances.
          </p>
          <p className="mb-0 mt-3 max-w-[70ch] leading-relaxed text-subtle">
            In {countryInfo.name}, holidays are an important part of the cultural and social calendar.
            Public holidays are typically non-working days established by law, while observances are
            special days that may not be official holidays but are still celebrated or commemorated.
          </p>
          <p className="mb-0 mt-3 max-w-[70ch] leading-relaxed text-subtle">
            You can use the controls above to change the year or language of the holiday names.
            {countryRegions.length > 0 && ` ${countryInfo.name} also has region-specific holidays, which you can explore by selecting a region from the list above.`}
          </p>
        </Card>
      </Section>
    </main>
  )
}
