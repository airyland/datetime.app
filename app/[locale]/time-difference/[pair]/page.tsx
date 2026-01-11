import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import TimeDifferenceClient from "./client"
import { citiesData } from "../../cities/[city]/metadata"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/locales"

interface PageProps {
  params: Promise<{ locale: string; pair: string }>
}

const isValidPair = (pair: string) => {
  const [cityA, cityB] = pair.split("-vs-")
  if (!cityA || !cityB) return false
  return Boolean(citiesData[cityA as keyof typeof citiesData] && citiesData[cityB as keyof typeof citiesData])
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, pair } = await params
  if (!isValidPair(pair)) {
    return {
      title: "Time difference not found",
      description: "The requested city comparison could not be found.",
    }
  }

  const [cityAKey, cityBKey] = pair.split("-vs-")
  const cityA = citiesData[cityAKey as keyof typeof citiesData]
  const cityB = citiesData[cityBKey as keyof typeof citiesData]
  const t = await getTranslations({ locale, namespace: "timeDifference" })
  const tCities = await getTranslations({ locale, namespace: "cities" })
  const getCityName = (key: string, fallback: string) => {
    try {
      return tCities(`cityNames.${key}`)
    } catch {
      return fallback
    }
  }
  const cityAName = getCityName(cityAKey, cityA.name)
  const cityBName = getCityName(cityBKey, cityB.name)
  const baseUrl = "https://datetime.app"
  const canonical = locale === DEFAULT_LOCALE ? `${baseUrl}/time-difference/${pair}` : `${baseUrl}/${locale}/time-difference/${pair}`
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map((supportedLocale) => [
      supportedLocale,
      supportedLocale === DEFAULT_LOCALE
        ? `${baseUrl}/time-difference/${pair}`
        : `${baseUrl}/${supportedLocale}/time-difference/${pair}`,
    ])
  ) as Record<string, string>

  return {
    title: t("metaTitle", { cityA: cityAName, cityB: cityBName }),
    description: t("metaDescription", { cityA: cityAName, cityB: cityBName }),
    keywords: [
      `Time difference ${cityAName} vs ${cityBName}`,
      `${cityAName} to ${cityBName} meeting planner`,
      `${cityAName} ${cityBName} time zone`,
    ],
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: t("metaTitle", { cityA: cityAName, cityB: cityBName }),
      description: t("metaDescription", { cityA: cityAName, cityB: cityBName }),
      type: "website",
      url: canonical,
    },
  }
}

export default async function TimeDifferencePage({ params }: PageProps) {
  const { locale, pair } = await params

  if (!isValidPair(pair)) {
    notFound()
  }

  return <TimeDifferenceClient pair={pair} locale={locale} />
}
