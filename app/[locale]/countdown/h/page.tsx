import type { Metadata } from "next"
import { Suspense } from "react"
import { HolidayCountdownClient } from "./client"
import { pageAlternates } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Holiday Countdown | Datetime.app",
  // Query-string variants all point at the hub; never inherit the home canonical from the locale layout.
  alternates: { canonical: pageAlternates("countdown", "en").canonical },
  robots: { index: false, follow: true },
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HolidayCountdownClient />
    </Suspense>
  )
}
