import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

// Load Space Grotesk for general text
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "datetime.app - Precise World Time",
  description:
    "Get precise world time, date, and timezone information. datetime.app provides accurate time display in multiple formats and timezone conversions.",
  keywords:
    "time, date, world time, timezone, time conversion, precise time, UTC, GMT, ISO 8601, Unix timestamp, daylight saving time, DST, world clock, timezone converter, countdown timer, sunrise, sunset",
  openGraph: {
    title: "datetime.app - Precise World Time",
    description:
      "Get precise world time, date, and timezone information. View current time, world clocks, timezone conversions, and more.",
    type: "website",
    url: "https://datetime.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "datetime.app - Precise World Time",
    description:
      "Get precise world time, date, and timezone information. View current time, world clocks, timezone conversions, and more.",
  },
  alternates: {
    canonical: "https://datetime.app",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={spaceGrotesk.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
