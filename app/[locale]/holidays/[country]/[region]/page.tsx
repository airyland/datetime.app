import { notFound } from "next/navigation"
import { Section, Card, PageIntro, ArrowLink, h2Class } from "@/components/ds"
import {
  COUNTRIES,
  REGIONS,
  getHolidays
} from "@/lib/holidays"
import RegionHolidaysClientPage from "./client-page"
import { Metadata } from "next"

interface RegionHolidaysProps {
  params: Promise<{ country: string; region: string }>
  searchParams: Promise<{ lang?: string; year?: string }>
}

export async function generateMetadata({ params, searchParams: searchParamsPromise }: RegionHolidaysProps): Promise<Metadata> {
  const { country, region } = await params
  const searchParams = await searchParamsPromise
  const countryInfo = COUNTRIES.find(c => c.code.toLowerCase() === country.toLowerCase())
  
  if (!countryInfo) {
    return {
      title: "Country Not Found | Datetime.app",
      description: "The requested country could not be found."
    }
  }
  
  const countryRegions = REGIONS[countryInfo.code] || []
  const regionInfo = countryRegions.find(r => r.code.toLowerCase() === region.toLowerCase())
  
  if (!regionInfo) {
    return {
      title: "Region Not Found | Datetime.app",
      description: "The requested region could not be found."
    }
  }
  
  const year = searchParams.year ? parseInt(searchParams.year) : new Date().getFullYear()
  
  return {
    title: `${regionInfo.name}, ${countryInfo.name} Holidays ${year} | Regional Holiday Calendar | Datetime.app`,
    description: `Complete list of public holidays and observances in ${regionInfo.name}, ${countryInfo.name} for ${year}. Regional holidays, bank holidays, and special observances with dates.`,
    keywords: [`${regionInfo.name} holidays`, `${countryInfo.name} regional holidays`, `${regionInfo.name} holiday calendar`, `${year} holidays`, `regional holidays ${countryInfo.name}`],
    openGraph: {
      title: `${regionInfo.name}, ${countryInfo.name} Holidays ${year} | Regional Holiday Calendar | Datetime.app`,
      description: `Complete list of public holidays and observances in ${regionInfo.name}, ${countryInfo.name} for ${year}. Regional holidays, bank holidays, and special observances with dates.`,
      type: "website",
      url: `https://datetime.app/holidays/${country}/${region}`,
    },
    alternates: {
      canonical: `https://datetime.app/holidays/${country}/${region}`
    }
  }
}

export default async function RegionHolidaysPage({ params, searchParams }: RegionHolidaysProps) {
  const { country, region } = await params
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
  
  // Find region info
  const regionInfo = countryRegions.find(r => r.code.toLowerCase() === region.toLowerCase())
  
  // If region doesn't exist for this country, show 404
  if (!regionInfo) {
    notFound()
  }
  
  // Get holidays for server-side rendering
  const holidays = getHolidays(
    countryInfo.code,
    yearParam,
    langParam,
    regionInfo.code
  )
  
  return (
    <main>
      <PageIntro
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Holidays", href: "/holidays" },
          { label: countryInfo.name, href: `/holidays/${country}?lang=${langParam}` },
          { label: regionInfo.name },
        ]}
        eyebrow={regionInfo.code}
        title={`Holidays in ${regionInfo.name}, ${countryInfo.name}`}
        description={`${yearParam} holiday calendar for ${regionInfo.name}`}
        right={<ArrowLink href={`/holidays/${country}?lang=${langParam}`} title={`Back to ${countryInfo.name} holidays`}>Back to {countryInfo.name}</ArrowLink>}
      />

      {/* Client-side interactive components */}
      <Section top="clamp(24px,3vw,40px)">
        <RegionHolidaysClientPage
          countryCode={countryInfo.code}
          countryName={countryInfo.name}
          regionCode={regionInfo.code}
          regionName={regionInfo.name}
          initialYear={yearParam}
          initialLanguage={langParam}
          initialHolidays={holidays}
        />
      </Section>

      {/* SEO content */}
      <Section>
        <Card className="p-[clamp(22px,3vw,36px)]">
          <h2 className={h2Class}>About {regionInfo.name} Holidays</h2>
          <p className="mb-0 mt-4 max-w-[70ch] leading-relaxed text-subtle">
            This page provides a comprehensive list of holidays in {regionInfo.name}, {countryInfo.name} for {yearParam}.
            The list includes public holidays, bank holidays, school holidays, and observances specific to this region.
          </p>
          <p className="mb-0 mt-3 max-w-[70ch] leading-relaxed text-subtle">
            In {regionInfo.name}, regional holidays are an important part of the local cultural and social calendar.
            These may include holidays that are specific to this region and not celebrated in other parts of {countryInfo.name}.
          </p>
          <p className="mb-0 mt-3 max-w-[70ch] leading-relaxed text-subtle">
            You can use the controls above to change the year or language of the holiday names.
            To see holidays for all of {countryInfo.name}, use the back link at the top of the page.
          </p>
        </Card>
      </Section>
    </main>
  )
}
