import type { Metadata } from "next"
import { Suspense } from "react"
import { HolidayCountdownClient } from "./client"

export const metadata: Metadata = {
  title: "Holiday Countdown | Datetime.app",
  robots: { index: false, follow: true },
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HolidayCountdownClient />
    </Suspense>
  )
}
