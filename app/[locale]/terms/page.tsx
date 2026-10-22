import { Metadata } from "next"
import { LegalPage, legalMetadata } from "@/components/legal-page"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return legalMetadata("terms", (await params).locale)
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  return <LegalPage kind="terms" locale={(await params).locale} />
}
