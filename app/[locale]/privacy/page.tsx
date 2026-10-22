import { Metadata } from "next"
import { LegalPage, legalMetadata } from "@/components/legal-page"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return legalMetadata("privacy", (await params).locale)
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  return <LegalPage kind="privacy" locale={(await params).locale} />
}
