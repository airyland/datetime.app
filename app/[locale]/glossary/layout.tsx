import { Metadata } from "next"
import { redirect } from 'next/navigation'

interface LayoutProps {
  params: { locale: string };
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Glossary of Datetime Concepts | Datetime.app",
  description: "Comprehensive glossary of time-related concepts, standards, and formats. Learn about UTC, GMT, timezones, ISO 8601, Unix timestamps, and more.",
  keywords: ["datetime glossary", "time concepts", "UTC", "GMT", "timezone", "ISO 8601", "Unix timestamp", "time standards", "time formats"],
  openGraph: {
    title: "Glossary of Datetime Concepts | Datetime.app",
    description: "Comprehensive glossary of time-related concepts, standards, and formats. Learn about UTC, GMT, timezones, ISO 8601, Unix timestamps, and more.",
    type: "website",
  },
  alternates: {
    canonical: "https://datetime.app/glossary"
  }
}

export default function GlossaryLayout({ params, children }: LayoutProps) {
  // Redirect non-English locales to English version since glossary is English-only
  if (params.locale !== 'en') {
    redirect('/glossary');
  }
  
  return <>{children}</>
}
