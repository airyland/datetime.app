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

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
})

const locales = ['en', 'zh-hans', 'zh-hant', 'ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt', 'ru']

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  
  const baseUrl = 'https://datetime.app'
  const canonicalUrl = locale === 'en' ? baseUrl : `${baseUrl}/${locale}`
  
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
      languages: {
        'en': baseUrl,
        'zh-hans': `${baseUrl}/zh-hans`,
        'zh-hant': `${baseUrl}/zh-hant`,
        'ar': `${baseUrl}/ar`,
        'de': `${baseUrl}/de`,
        'es': `${baseUrl}/es`,
        'fr': `${baseUrl}/fr`,
        'hi': `${baseUrl}/hi`,
        'it': `${baseUrl}/it`,
        'ja': `${baseUrl}/ja`,
        'ko': `${baseUrl}/ko`,
        'pt': `${baseUrl}/pt`,
        'ru': `${baseUrl}/ru`,
      }
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
  
  if (!locales.includes(locale)) {
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
        <NextIntlClientProvider messages={messages}>
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
  return locales.map((locale) => ({ locale }))
}