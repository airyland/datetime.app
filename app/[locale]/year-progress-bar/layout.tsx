import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Year Progress Bar | Track How Much of the Year Has Passed | Datetime.app",
  description: "Track the current year's progress with a real-time progress bar. See exactly how much of the year has passed and how much time is left.",
  keywords: ["year progress", "year progress bar", "time left in year", "days left in year", "year completion", "year tracker", "time tracking"],
  openGraph: {
    title: "Year Progress Bar | Track How Much of the Year Has Passed | Datetime.app",
    description: "Track the current year's progress with a real-time progress bar. See exactly how much of the year has passed and how much time is left.",
    type: "website",
  },
}

export default function YearProgressBarLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
