import type { Metadata } from "next"
import { pageAlternates } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ timezoneId: string; locale: string }> }): Promise<Metadata> {
  const { timezoneId, locale } = await params
  return { alternates: pageAlternates(`iana-timezones/${timezoneId}`, locale) }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
