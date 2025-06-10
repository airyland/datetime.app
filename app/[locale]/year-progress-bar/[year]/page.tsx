import { notFound } from 'next/navigation'
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { JetBrains_Mono } from "next/font/google"
import { Clock, Calendar, ArrowLeft } from "lucide-react"
import { calculateYearProgress, calculateTimeLeft, getYearStatus } from "@/lib/year-progress"
import YearProgressClient from "../year-progress-client"
import HeaderClient from "../header-client"

// Load JetBrains Mono for numbers
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

interface YearProgressBarProps {
  params: { year: string }
}

export default function YearProgressBarWithYear({ params }: YearProgressBarProps) {
  const yearParam = parseInt(params.year)

  // Validate year parameter
  if (isNaN(yearParam) || yearParam < 1970) {
    notFound()
  }

  // Calculate initial values on the server
  const now = new Date()
  const initialProgress = calculateYearProgress(now, yearParam)
  const initialTimeLeft = calculateTimeLeft(now, yearParam)
  const { isCurrentYear, isCompleted, isFuture } = getYearStatus(now, yearParam)

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <HeaderClient />

      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-4">
              <Link href="/year-progress-bar" className="inline-flex items-center text-primary hover:underline">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Current Year
              </Link>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
              Year Progress Bar {yearParam}
            </h1>
            <p className="text-xl text-center text-muted-foreground mb-8">
              {isCurrentYear ? (
                <span dangerouslySetInnerHTML={{ __html: `The year ${yearParam} is <strong>${initialProgress.toFixed(2)}%</strong> complete` }} />
              ) : isCompleted ? (
                "This year has been completed"
              ) : (
                "This year hasn't started yet"
              )}
            </p>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Year {yearParam} Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isCurrentYear ? (
                  /* Client component for real-time updates (only for current year) */
                  <YearProgressClient
                    initialProgress={initialProgress}
                    initialTimeLeft={initialTimeLeft}
                    currentYear={yearParam}
                  />
                ) : (
                  /* Static display for non-current years */
                  <div className="space-y-6">
                    <div className="text-center">
                      <span className={`text-5xl md:text-6xl font-bold ${jetbrainsMono.className}`}>
                        {initialProgress.toFixed(2)}%
                      </span>
                    </div>
                    <Progress value={initialProgress} className="h-6" />
                    <div className="text-center text-muted-foreground">
                      <Clock className="inline-block mr-2 h-4 w-4" />
                      <span>{initialTimeLeft}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="text-center mb-8">
              <p className="mb-4">View progress for other years:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[yearParam - 2, yearParam - 1, yearParam, yearParam + 1, yearParam + 2].map((year) => (
                  <Link
                    key={year}
                    href={`/year-progress-bar/${year}`}
                    className={`px-4 py-2 rounded-md ${year === yearParam ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}
                  >
                    {year}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
