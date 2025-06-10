import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Globe } from "lucide-react"
import { COUNTRIES } from "@/lib/holidays"
import HolidaysClientPage from "./client-page"
import { Metadata } from "next"
import Header from "@/components/header"

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
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <Header />

      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
              World Holidays Calendar
            </h1>
            <p className="text-xl text-center text-muted-foreground mb-8">
              Browse holidays from countries and regions around the world
            </p>

            {/* Client-side interactive components */}
            <HolidaysClientPage />

            {/* Information section */}
            <Card className="mt-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>About World Holidays</span>
                </h2>
                <p className="mb-4">
                  This page provides information about holidays around the world. You can browse holidays by country and region,
                  and view them in different languages. The data includes public holidays, bank holidays, school holidays,
                  and observances.
                </p>
                <p>
                  Select a country from the list above to see its holidays. For some countries, you can also view holidays
                  for specific regions or states.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
