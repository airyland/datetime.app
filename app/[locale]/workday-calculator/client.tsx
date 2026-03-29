"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import StructuredData from "@/components/structured-data"
import { getLocalePath } from "@/lib/locale-utils"

interface WorkdayCalculatorClientProps {
  locale: string
}

const isWeekend = (date: Date) => {
  const day = date.getDay()
  return day === 0 || day === 6
}

export default function WorkdayCalculatorClient({ locale }: WorkdayCalculatorClientProps) {
  const t = useTranslations("workdayCalculator")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [excludeWeekends, setExcludeWeekends] = useState(true)
  const [holidayList, setHolidayList] = useState("")

  const holidayDates = useMemo(() => {
    return holidayList
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => new Date(entry))
      .filter((date) => !Number.isNaN(date.getTime()))
      .map((date) => date.toDateString())
  }, [holidayList])

  const totalWorkdays = useMemo(() => {
    if (!startDate || !endDate) return null
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null
    if (start > end) return null

    let count = 0
    const cursor = new Date(start)
    while (cursor <= end) {
      const isHoliday = holidayDates.includes(cursor.toDateString())
      const weekend = isWeekend(cursor)
      if ((!excludeWeekends || !weekend) && !isHoliday) {
        count += 1
      }
      cursor.setDate(cursor.getDate() + 1)
    }
    return count
  }, [startDate, endDate, excludeWeekends, holidayDates])

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("title"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    url: `https://datetime.app${getLocalePath("/workday-calculator", locale)}`,
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
              <Briefcase className="h-5 w-5" />
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

            <div className="flex items-center gap-2">
              <Checkbox
                id="exclude-weekends"
                checked={excludeWeekends}
                onCheckedChange={(value) => setExcludeWeekends(Boolean(value))}
              />
              <label htmlFor="exclude-weekends" className="text-sm">
                {t("excludeWeekends")}
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("holidayList")}</label>
              <Input
                type="text"
                value={holidayList}
                onChange={(event) => setHolidayList(event.target.value)}
                placeholder={t("holidayPlaceholder")}
              />
              <p className="text-xs text-muted-foreground">{t("holidayHint")}</p>
            </div>

            <div className="rounded-lg bg-secondary/40 p-4 text-center">
              <p className="text-sm text-muted-foreground">{t("resultLabel")}</p>
              <p className="text-3xl font-bold">
                {totalWorkdays == null ? t("resultPlaceholder") : totalWorkdays}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
