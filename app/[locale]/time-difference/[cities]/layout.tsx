import type { Metadata } from "next"
import { citiesData } from "@/app/[locale]/cities/[city]/metadata"
import { pageAlternates } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ cities: string; locale: string }> }): Promise<Metadata> {
  const { cities, locale } = await params
  const [a, b] = cities.split("-vs-")
  const cityA = citiesData[a as keyof typeof citiesData]
  const cityB = citiesData[b as keyof typeof citiesData]
  if (!cityA || !cityB) return {}
  const title = `Time Difference Between ${cityA.name} and ${cityB.name} | Datetime.app`
  return {
    title,
    description: `Current time difference between ${cityA.name} and ${cityB.name}, with live clocks and the best overlapping business hours for meetings.`,
    alternates: pageAlternates(`time-difference/${cities}`, locale),
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
