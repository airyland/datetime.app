import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Globe } from "lucide-react"
import {
  COUNTRIES,
  REGIONS,
  getHolidays
} from "@/lib/holidays"
import RegionHolidaysClientPage from "./client-page"
import { Metadata } from "next"
import Header from "@/components/header"

interface RegionHolidaysProps {
  params: { country: string; region: string }
  searchParams: { lang?: string; year?: string }
}

export async function generateMetadata({ params, searchParams }: RegionHolidaysProps): Promise<Metadata> {
  const { country, region } = params
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

export default function RegionHolidaysPage({ params, searchParams }: RegionHolidaysProps) {
  const { country, region } = params
  const langParam = searchParams.lang || 'en'
  const yearParam = searchParams.year ? parseInt(searchParams.year) : new Date().getFullYear()
  
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
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <Header />

      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <Link href={`/holidays/${country}?lang=${langParam}`} className="inline-flex items-center text-primary hover:underline">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to {countryInfo.name}
              </Link>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center flex items-center justify-center gap-2">
              <Globe className="h-8 w-8" />
              <span>Holidays in {regionInfo.name}, {countryInfo.name}</span>
            </h1>
            <p className="text-xl text-center text-muted-foreground mb-8">
              {yearParam} holiday calendar for {regionInfo.name}
            </p>

            {/* Client-side interactive components */}
            <RegionHolidaysClientPage 
              countryCode={countryInfo.code}
              countryName={countryInfo.name}
              regionCode={regionInfo.code}
              regionName={regionInfo.name}
              initialYear={yearParam}
              initialLanguage={langParam}
              initialHolidays={holidays}
            />

            {/* SEO content */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>About {regionInfo.name} Holidays</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  This page provides a comprehensive list of holidays in {regionInfo.name}, {countryInfo.name} for {yearParam}. 
                  The list includes public holidays, bank holidays, school holidays, and observances specific to this region.
                </p>
                <p className="mb-4">
                  In {regionInfo.name}, regional holidays are an important part of the local cultural and social calendar. 
                  These may include holidays that are specific to this region and not celebrated in other parts of {countryInfo.name}.
                </p>
                <p>
                  You can use the controls above to change the year or language of the holiday names. 
                  To see holidays for all of {countryInfo.name}, use the back link at the top of the page.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
