"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"
import { calculateYearProgress, calculateTimeLeftData, formatTimeLeft } from "@/lib/year-progress"
import { useTranslations } from "next-intl"

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

  const t = useTranslations('yearProgress')
  
  // Create translation function for formatTimeLeft
  const timeTranslationFunction = (key: string, params?: any) => {
    const count = params?.count || 0
    switch (key) {
      case 'yearCompleted':
        return t('yearCompleted')
      case 'yearNotStarted':
        return t('yearNotStarted')
      case 'timeLeftMonths':
        return t('timeLeftMonths', { count })
      case 'timeLeftDays':
        return t('timeLeftDays', { count })
      case 'timeLeftHours':
        return t('timeLeftHours', { count })
      case 'timeLeftMinutes':
        return t('timeLeftMinutes', { count })
      case 'timeLeftSeconds':
        return t('timeLeftSeconds', { count })
      case 'left':
        return t('left')
      default:
        return key
    }
  }

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setProgress(calculateYearProgress(now, currentYear))
      const timeData = calculateTimeLeftData(now, currentYear)
      setTimeLeft(formatTimeLeft(timeData, timeTranslationFunction))
    }, 1000)

    return () => clearInterval(timer)
  }, [currentYear, t])

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
