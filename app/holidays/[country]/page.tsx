import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Globe } from "lucide-react"
import {
  COUNTRIES,
  REGIONS,
  RegionInfo,
  getHolidays
} from "@/lib/holidays"
import CountryHolidaysClientPage from "./client-page"
import Header from "@/components/header"
import { Metadata } from "next"

interface CountryHolidaysProps {
  params: { country: string }
  searchParams: { lang?: string; year?: string }
}

export async function generateMetadata({ params, searchParams }: CountryHolidaysProps): Promise<Metadata> {
  const { country } = params
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

export default function CountryHolidaysPage({ params, searchParams }: CountryHolidaysProps) {
  const { country } = params
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
  
  // Get holidays for server-side rendering
  const holidays = getHolidays(
    countryInfo.code,
    yearParam,
    langParam
  )
  
  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <Header />

      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <Link href="/holidays" className="inline-flex items-center text-primary hover:underline">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Countries
              </Link>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center flex items-center justify-center gap-2">
              <Globe className="h-8 w-8" />
              <span>Holidays in {countryInfo.name}</span>
            </h1>
            <p className="text-xl text-center text-muted-foreground mb-8">
              {yearParam} holiday calendar for {countryInfo.name}
            </p>

            {/* Client-side interactive components */}
            <CountryHolidaysClientPage 
              countryCode={countryInfo.code}
              countryName={countryInfo.name}
              initialYear={yearParam}
              initialLanguage={langParam}
              initialHolidays={holidays}
            />

            {/* Regions section (if available) */}
            {countryRegions.length > 0 && (
              <Card className="mb-8 mt-8">
                <CardHeader>
                  <CardTitle className="text-center flex items-center justify-center gap-2">
                    <Globe className="h-5 w-5" />
                    <span>Regions in {countryInfo.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {countryRegions.map((region: RegionInfo) => (
                      <Link
                        key={region.code}
                        href={`/holidays/${country}/${region.code.toLowerCase()}?lang=${langParam}`}
                        className="text-primary font-medium py-2 px-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors flex items-center justify-center"
                      >
                        {region.name}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* SEO content */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>About {countryInfo.name} Holidays</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  This page provides a comprehensive list of holidays in {countryInfo.name} for {yearParam}. 
                  The list includes public holidays, bank holidays, school holidays, and observances.
                </p>
                <p className="mb-4">
                  In {countryInfo.name}, holidays are an important part of the cultural and social calendar. 
                  Public holidays are typically non-working days established by law, while observances are 
                  special days that may not be official holidays but are still celebrated or commemorated.
                </p>
                <p>
                  You can use the controls above to change the year or language of the holiday names. 
                  {countryRegions.length > 0 && ` ${countryInfo.name} also has region-specific holidays, which you can explore by selecting a region from the list above.`}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
