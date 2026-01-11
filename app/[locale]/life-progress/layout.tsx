import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/locales"

interface LayoutProps {
  params: Promise<{ locale: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "lifeProgress" })
  const baseUrl = "https://datetime.app"
  const canonical = locale === DEFAULT_LOCALE ? `${baseUrl}/life-progress` : `${baseUrl}/${locale}/life-progress`
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map((supportedLocale) => [
      supportedLocale,
      supportedLocale === DEFAULT_LOCALE ? `${baseUrl}/life-progress` : `${baseUrl}/${supportedLocale}/life-progress`,
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

export default function LifeProgressLayout({ children }: LayoutProps) {
  return <>{children}</>
}
