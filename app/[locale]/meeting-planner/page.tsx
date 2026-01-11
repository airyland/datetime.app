import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import MeetingPlannerClient from "./client"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/locales"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meetingPlanner" })
  const baseUrl = "https://datetime.app"
  const canonical = locale === DEFAULT_LOCALE ? `${baseUrl}/meeting-planner` : `${baseUrl}/${locale}/meeting-planner`
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map((supportedLocale) => [
      supportedLocale,
      supportedLocale === DEFAULT_LOCALE
        ? `${baseUrl}/meeting-planner`
        : `${baseUrl}/${supportedLocale}/meeting-planner`,
    ])
  ) as Record<string, string>

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      type: "website",
      url: canonical,
    },
  }
}

export default async function MeetingPlannerPage({ params }: PageProps) {
  const { locale } = await params
  return <MeetingPlannerClient locale={locale} />
}
