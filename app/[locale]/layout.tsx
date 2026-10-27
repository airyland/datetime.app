import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/footer"
import { LiveFavicon } from "@/components/live-favicon"
import Header from "@/components/header"
import { Analytics } from "@/components/analytics"
import { LanguageSuggestionModal } from "@/components/language-suggestion-modal"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/locales'
import { OG_IMAGES, TWITTER_IMAGES } from "@/lib/seo"

const geistSans = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-sans",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-mono",
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
    images: OG_IMAGES,
      title: t('title'),
      description: t('description'),
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
    images: TWITTER_IMAGES,
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
        { url: "/favicon.svg?v=2", type: "image/svg+xml" },
        { url: "/favicon.ico?v=2", sizes: "48x48" },
        { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
        { url: "/favicon-192x192.png?v=2", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180" }]
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8443907573529681"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Datetime.app",
              "url": "https://datetime.app",
              "applicationCategory": "UtilitiesApplication",
              "operatingSystem": "All",
              "description": "World clock, time zone converter, calendar, and date tools",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
        <Analytics />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <LiveFavicon />
            <Header />
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