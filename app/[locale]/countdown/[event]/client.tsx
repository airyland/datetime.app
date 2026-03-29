"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Calendar, Download, Timer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import StructuredData from "@/components/structured-data"
import { getLocalePath } from "@/lib/locale-utils"

interface CountdownClientProps {
  event: string
  locale: string
  targetDate: string
  title: string
  description: string
}

const formatDuration = (seconds: number) => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return { days, hours, minutes, seconds: remainingSeconds }
}

export default function CountdownClient({ event, locale, targetDate, title, description }: CountdownClientProps) {
  const t = useTranslations("countdown")
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const target = new Date(targetDate)
      const diffSeconds = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000))
      setRemainingSeconds(diffSeconds)
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const duration = useMemo(() => formatDuration(remainingSeconds), [remainingSeconds])

  const generateShareImage = () => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.fillStyle = "#0F172A"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 36px sans-serif"
    ctx.fillText(title, 40, 70)
    ctx.font = "24px sans-serif"
    ctx.fillText(description, 40, 120)
    ctx.font = "bold 48px monospace"
    ctx.fillText(`${duration.days}d ${duration.hours}h ${duration.minutes}m`, 40, 200)
    ctx.font = "20px sans-serif"
    ctx.fillText("Datetime.app", 40, 260)

    const link = document.createElement("a")
    link.download = `${event}-countdown.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Any",
    url: `https://datetime.app${getLocalePath(`/countdown/${event}`, locale)}`,
    inLanguage: locale,
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <StructuredData data={webAppSchema} />
      <div className="container mx-auto px-4 py-10 flex-grow">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>

        <Card className="max-w-2xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Timer className="h-5 w-5" />
              {t("countdownTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { label: t("days"), value: duration.days },
                { label: t("hours"), value: duration.hours },
                { label: t("minutes"), value: duration.minutes },
                { label: t("seconds"), value: duration.seconds },
              ].map((item) => (
                <div key={item.label} className="bg-secondary/40 rounded-lg py-4">
                  <div className="text-3xl font-mono">{item.value.toString().padStart(2, "0")}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t("eventDetails")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>{t("targetDate", { date: new Date(targetDate).toLocaleDateString(locale, { dateStyle: "full" }) })}</p>
            <p className="text-sm text-muted-foreground">{t("timezoneNote")}</p>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button onClick={generateShareImage} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {t("shareImage")}
          </Button>
        </div>

        <div className="text-center mt-8">
          <Link href={getLocalePath("/calendar", locale)} className="text-sm text-primary hover:underline">
            {t("viewCalendars")}
          </Link>
        </div>
      </div>
      <canvas ref={canvasRef} width={800} height={320} className="hidden" />
    </main>
  )
}
