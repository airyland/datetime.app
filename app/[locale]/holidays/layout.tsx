import { Metadata } from "next"
import { redirect } from 'next/navigation'

interface LayoutProps {
  params: { locale: string };
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "World Holidays Calendar | Datetime.app",
  description: "Browse holidays from around the world. Find public holidays, observances, and special days for countries and regions worldwide.",
  keywords: ["holidays", "world holidays", "public holidays", "international holidays", "holiday calendar", "national holidays", "regional holidays"],
  openGraph: {
    title: "World Holidays Calendar | Datetime.app",
    description: "Browse holidays from around the world. Find public holidays, observances, and special days for countries and regions worldwide.",
    type: "website",
  },
  alternates: {
    canonical: "https://datetime.app/holidays"
  }
}

export default function HolidaysLayout({ params, children }: LayoutProps) {
  // Redirect non-English locales to English version since holidays is English-only
  if (params.locale !== 'en') {
    redirect('/holidays');
  }
  
  return <>{children}</>
}
