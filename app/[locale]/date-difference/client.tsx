"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { CalendarClock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import StructuredData from "@/components/structured-data"
import { getLocalePath } from "@/lib/locale-utils"

interface DateDifferenceClientProps {
  locale: string
}

export default function DateDifferenceClient({ locale }: DateDifferenceClientProps) {
  const t = useTranslations("dateDifference")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const diff = useMemo(() => {
    if (!startDate || !endDate) return null
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null
    const diffMs = end.getTime() - start.getTime()
    const days = Math.round(diffMs / 86400000)
    return {
      days,
      weeks: Math.floor(days / 7),
      months: Math.floor(days / 30),
    }
  }, [startDate, endDate])

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("title"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    url: `https://datetime.app${getLocalePath("/date-difference", locale)}`,
    inLanguage: locale,
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <StructuredData data={webAppSchema} />
      <div className="container mx-auto px-4 py-10 flex-grow">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("title")}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              {t("calculatorTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("startDate")}</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("endDate")}</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </div>
            </div>

            <div className="rounded-lg bg-secondary/40 p-4 text-center space-y-1">
              <p className="text-sm text-muted-foreground">{t("resultLabel")}</p>
              {diff ? (
                <div className="space-y-1">
                  <p className="text-3xl font-bold">{t("daysResult", { days: diff.days })}</p>
                  <p className="text-sm text-muted-foreground">{t("summaryResult", { weeks: diff.weeks, months: diff.months })}</p>
                </div>
              ) : (
                <p className="text-2xl font-semibold">{t("resultPlaceholder")}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
