"use client"

import { useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { Download, HeartPulse } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import StructuredData from "@/components/structured-data"
import { getLocalePath } from "@/lib/locale-utils"

export default function LifeProgressPage({ params }: { params: { locale: string } }) {
  const { locale } = params
  const t = useTranslations("lifeProgress")
  const [birthDate, setBirthDate] = useState("")
  const [lifeExpectancy, setLifeExpectancy] = useState("80")
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const progress = useMemo(() => {
    if (!birthDate) return null
    const birth = new Date(birthDate)
    const expectancy = Number(lifeExpectancy)
    if (Number.isNaN(birth.getTime()) || Number.isNaN(expectancy) || expectancy <= 0) return null
    const endDate = new Date(birth)
    endDate.setFullYear(endDate.getFullYear() + expectancy)
    const now = new Date()
    const total = endDate.getTime() - birth.getTime()
    const elapsed = now.getTime() - birth.getTime()
    const percent = Math.min(Math.max((elapsed / total) * 100, 0), 100)
    return percent
  }, [birthDate, lifeExpectancy])

  const generateShareImage = () => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.fillStyle = "#0F172A"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 36px sans-serif"
    ctx.fillText(t("shareTitle"), 40, 70)
    ctx.font = "24px sans-serif"
    ctx.fillText(t("shareSubtitle"), 40, 120)
    ctx.font = "bold 48px monospace"
    ctx.fillText(`${progress?.toFixed(1) ?? "--"}%`, 40, 200)
    ctx.font = "20px sans-serif"
    ctx.fillText("Datetime.app", 40, 260)

    const link = document.createElement("a")
    link.download = "life-progress.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("title"),
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Any",
    url: `https://datetime.app${getLocalePath("/life-progress", locale)}`,
    inLanguage: locale,
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <StructuredData data={webAppSchema} />
      <div className="container mx-auto px-4 py-10 flex-grow">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("title")}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5" />
              {t("calculatorTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">{t("birthDate")}</label>
                <Input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">{t("lifeExpectancy")}</label>
                <Input
                  type="number"
                  value={lifeExpectancy}
                  onChange={(event) => setLifeExpectancy(event.target.value)}
                  min={1}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Progress value={progress ?? 0} />
              <p className="text-sm text-muted-foreground">
                {progress == null ? t("placeholder") : t("progressLabel", { percent: progress.toFixed(1) })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={generateShareImage} disabled={progress == null} className="gap-2">
                <Download className="h-4 w-4" />
                {t("shareButton")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <canvas ref={canvasRef} width={600} height={320} className="hidden" />
      </div>
    </main>
  )
}
