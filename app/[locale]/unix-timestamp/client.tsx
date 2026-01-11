"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Clock, ArrowLeftRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import StructuredData from "@/components/structured-data"
import { getLocalePath } from "@/lib/locale-utils"

interface UnixTimestampClientProps {
  locale: string
}

const toSeconds = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return null
  const num = Number(trimmed)
  if (Number.isNaN(num)) return null
  return num > 1e12 ? Math.floor(num / 1000) : Math.floor(num)
}

export default function UnixTimestampClient({ locale }: UnixTimestampClientProps) {
  const t = useTranslations("unixTimestamp")
  const [timestampInput, setTimestampInput] = useState("")
  const [dateInput, setDateInput] = useState("")

  const timestampSeconds = useMemo(() => toSeconds(timestampInput), [timestampInput])
  const parsedDate = useMemo(() => {
    if (!dateInput) return null
    const parsed = new Date(dateInput)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }, [dateInput])

  const dateFromTimestamp = useMemo(() => {
    if (timestampSeconds == null) return null
    return new Date(timestampSeconds * 1000)
  }, [timestampSeconds])

  const timestampFromDate = useMemo(() => {
    if (!parsedDate) return null
    return Math.floor(parsedDate.getTime() / 1000)
  }, [parsedDate])

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("title"),
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    url: `https://datetime.app${getLocalePath("/unix-timestamp", locale)}`,
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

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t("timestampToDate")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                value={timestampInput}
                onChange={(event) => setTimestampInput(event.target.value)}
                placeholder={t("timestampPlaceholder")}
                aria-label={t("timestampPlaceholder")}
              />
              <div className="text-sm text-muted-foreground">
                {dateFromTimestamp
                  ? dateFromTimestamp.toLocaleString(locale, { dateStyle: "full", timeStyle: "medium" })
                  : t("invalidTimestamp")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5" />
                {t("dateToTimestamp")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="datetime-local"
                value={dateInput}
                onChange={(event) => setDateInput(event.target.value)}
                aria-label={t("datePlaceholder")}
              />
              <div className="text-sm text-muted-foreground">
                {timestampFromDate != null ? timestampFromDate : t("invalidDate")}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
