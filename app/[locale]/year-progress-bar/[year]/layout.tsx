import { Metadata } from "next"
import { calculateYearProgress, calculateTimeLeft, getYearStatus } from "@/lib/year-progress"

interface LayoutProps {
  params: { year: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const year = parseInt(params.year)

  // Handle invalid year
  if (isNaN(year) || year < 1970) {
    return {
      title: "Invalid Year | Year Progress Bar | Datetime.app",
      description: "The requested year is invalid. Please select a valid year after 1970.",
    }
  }

  const now = new Date()
  const progress = calculateYearProgress(now, year)
  const timeLeft = calculateTimeLeft(now, year)
  const { isCurrentYear, isCompleted, isFuture } = getYearStatus(now, year)

  let description = ""
  if (isCurrentYear) {
    description = `The year ${year} is ${progress.toFixed(2)}% complete with ${timeLeft}. Track the progress in real-time.`
  } else if (isCompleted) {
    description = `The year ${year} is complete. View the progress bar and explore other years.`
  } else {
    description = `The year ${year} hasn't started yet. Explore our year progress tracking tool.`
  }

  return {
    title: `${year} Year Progress Bar - ${progress.toFixed(2)}% Complete | Datetime.app`,
    description,
    keywords: [`${year} progress`, `${year} progress bar`, `time left in ${year}`, `days left in ${year}`, `${year} completion`, `${year} tracker`, "time tracking"],
    openGraph: {
      title: `${year} Year Progress Bar - ${progress.toFixed(2)}% Complete | Datetime.app`,
      description,
      type: "website",
    },
  }
}

export default function YearProgressBarLayout({ children }: LayoutProps) {
  return <>{children}</>
}
