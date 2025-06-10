"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"
import { calculateYearProgress, calculateTimeLeft } from "@/lib/year-progress"

interface YearProgressClientProps {
  initialProgress: number
  initialTimeLeft: string
  currentYear: number
}

export default function YearProgressClient({
  initialProgress,
  initialTimeLeft,
  currentYear
}: YearProgressClientProps) {
  const [progress, setProgress] = useState(initialProgress)
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setProgress(calculateYearProgress(now, currentYear))
      setTimeLeft(calculateTimeLeft(now, currentYear))
    }, 1000)

    return () => clearInterval(timer)
  }, [currentYear])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className={`text-5xl md:text-6xl font-bold font-mono`}>
          {progress.toFixed(2)}%
        </span>
      </div>
      <Progress value={progress} className="h-6" />
      <div className="text-center text-muted-foreground">
        <Clock className="inline-block mr-2 h-4 w-4" />
        <span>{timeLeft}</span>
      </div>
    </div>
  )
}
