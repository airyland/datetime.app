import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/footer"
import { Analytics } from "@/components/analytics"
import { LanguageSuggestionModal } from "@/components/language-suggestion-modal"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/locales'

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
})

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })

  const baseUrl = 'https://datetime.app'
  const canonicalUrl = locale === DEFAULT_LOCALE ? baseUrl : `${baseUrl}/${locale}`
  const languageAlternates = Object.fromEntries(
    SUPPORTED_LOCALES.map((supportedLocale) => [
      supportedLocale,
      supportedLocale === DEFAULT_LOCALE ? baseUrl : `${baseUrl}/${supportedLocale}`
    ])
  ) as Record<string, string>
  
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates
    },
    icons: {
      icon: [
        { url: "/favicon-512x512.png", sizes: "any" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }]
    }
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  if (!SUPPORTED_LOCALES.includes(locale as typeof SUPPORTED_LOCALES[number])) {
    notFound()
  }

  const messages = await getMessages({ locale })

  return (
    <html lang={locale} suppressHydrationWarning dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID && (
          <meta 
            name="google-adsense-account" 
            content={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
          />
        )}
        <Analytics />
      </head>
      <body className={spaceGrotesk.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <main>
              {children}
            </main>
            <Footer />
            <LanguageSuggestionModal />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}