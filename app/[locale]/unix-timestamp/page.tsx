import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import UnixTimestampClient from "./client"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/locales"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "unixTimestamp" })
  const baseUrl = "https://datetime.app"
  const canonical = locale === DEFAULT_LOCALE ? `${baseUrl}/unix-timestamp` : `${baseUrl}/${locale}/unix-timestamp`
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map((supportedLocale) => [
      supportedLocale,
      supportedLocale === DEFAULT_LOCALE
        ? `${baseUrl}/unix-timestamp`
        : `${baseUrl}/${supportedLocale}/unix-timestamp`,
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

export default async function UnixTimestampPage({ params }: PageProps) {
  const { locale } = await params
  return <UnixTimestampClient locale={locale} />
}
