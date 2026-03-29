import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import CountdownClient from "./client"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/locales"

const COUNTDOWN_EVENTS = {
  christmas: {
    date: (year: number) => `${year}-12-25T00:00:00`,
    titleKey: "events.christmas.title",
    descriptionKey: "events.christmas.description",
  },
  "new-year-2027": {
    date: () => "2027-01-01T00:00:00",
    titleKey: "events.newYear2027.title",
    descriptionKey: "events.newYear2027.description",
  },
}

type CountdownEventKey = keyof typeof COUNTDOWN_EVENTS

interface PageProps {
  params: Promise<{ locale: string; event: string }>
}

const getEventConfig = (event: string) => COUNTDOWN_EVENTS[event as CountdownEventKey]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, event } = await params
  const config = getEventConfig(event)
  if (!config) {
    return {
      title: "Countdown not found",
      description: "The requested countdown page could not be found.",
    }
  }

  const t = await getTranslations({ locale, namespace: "countdown" })
  const baseUrl = "https://datetime.app"
  const canonical = locale === DEFAULT_LOCALE ? `${baseUrl}/countdown/${event}` : `${baseUrl}/${locale}/countdown/${event}`
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map((supportedLocale) => [
      supportedLocale,
      supportedLocale === DEFAULT_LOCALE
        ? `${baseUrl}/countdown/${event}`
        : `${baseUrl}/${supportedLocale}/countdown/${event}`,
    ])
  ) as Record<string, string>

  return {
    title: t(config.titleKey),
    description: t(config.descriptionKey),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: t(config.titleKey),
      description: t(config.descriptionKey),
      type: "website",
      url: canonical,
    },
  }
}

export default async function CountdownPage({ params }: PageProps) {
  const { locale, event } = await params
  const config = getEventConfig(event)
  if (!config) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: "countdown" })
  const year = new Date().getFullYear()
  const candidateDate = config.date(year)
  const targetDate = new Date(candidateDate) < new Date() && event === "christmas"
    ? config.date(year + 1)
    : candidateDate

  return (
    <CountdownClient
      event={event}
      locale={locale}
      targetDate={targetDate}
      title={t(config.titleKey)}
      description={t(config.descriptionKey)}
    />
  )
}
