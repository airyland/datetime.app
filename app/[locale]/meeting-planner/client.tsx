"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import spacetime from "spacetime"
import { Plus, Trash2, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import StructuredData from "@/components/structured-data"
import { getLocalePath } from "@/lib/locale-utils"

interface MeetingPlannerClientProps {
  locale: string
}

const availableTimezones = [
  { value: "America/New_York", label: "New York" },
  { value: "America/Los_Angeles", label: "Los Angeles" },
  { value: "America/Chicago", label: "Chicago" },
  { value: "America/Toronto", label: "Toronto" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris" },
  { value: "Europe/Berlin", label: "Berlin" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Asia/Shanghai", label: "Shanghai" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Asia/Dubai", label: "Dubai" },
  { value: "Australia/Sydney", label: "Sydney" },
]

export default function MeetingPlannerClient({ locale }: MeetingPlannerClientProps) {
  const t = useTranslations("meetingPlanner")
  const [selectedTimezone, setSelectedTimezone] = useState("")
  const [timezones, setTimezones] = useState<string[]>(["America/New_York", "Europe/London"])
  const [workingHours, setWorkingHours] = useState<number[]>([9, 17])

  const addTimezone = () => {
    if (!selectedTimezone || timezones.includes(selectedTimezone)) return
    setTimezones((prev) => [...prev, selectedTimezone])
    setSelectedTimezone("")
  }

  const removeTimezone = (timezone: string) => {
    setTimezones((prev) => prev.filter((tz) => tz !== timezone))
  }

  const overlap = useMemo(() => {
    if (timezones.length === 0) return null
    const start = workingHours[0]
    const end = workingHours[1]
    const ranges = timezones.map((tz) => {
      const base = spacetime.now(tz)
      const startLocal = base.clone().hour(start).minute(0).second(0).millisecond(0)
      const endLocal = base.clone().hour(end).minute(0).second(0).millisecond(0)
      return {
        tz,
        startUtc: startLocal.goto("UTC"),
        endUtc: endLocal.goto("UTC"),
      }
    })
    const overlapStart = ranges.reduce((latest, range) => (range.startUtc.epoch > latest.epoch ? range.startUtc : latest), ranges[0].startUtc)
    const overlapEnd = ranges.reduce((earliest, range) => (range.endUtc.epoch < earliest.epoch ? range.endUtc : earliest), ranges[0].endUtc)

    if (overlapStart.epoch >= overlapEnd.epoch) return null
    return {
      startUtc: overlapStart,
      endUtc: overlapEnd,
    }
  }, [timezones, workingHours])

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("title"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    url: `https://datetime.app${getLocalePath("/meeting-planner", locale)}`,
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

        <Card className="max-w-3xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t("citySelector")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCity")} />
                </SelectTrigger>
                <SelectContent>
                  {availableTimezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addTimezone} className="gap-2" type="button">
                <Plus className="h-4 w-4" />
                {t("addCity")}
              </Button>
            </div>

            <div className="space-y-2">
              {timezones.map((tz) => (
                <div key={tz} className="flex items-center justify-between border rounded-lg px-3 py-2">
                  <span>{tz}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeTimezone(tz)} aria-label={t("removeCity")}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>{t("workingHours")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Slider
                value={workingHours}
                onValueChange={setWorkingHours}
                min={0}
                max={23}
                step={1}
                className="mt-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{t("hourLabel", { hour: workingHours[0] })}</span>
                <span>{t("hourLabel", { hour: workingHours[1] })}</span>
              </div>
            </div>

            <div className="rounded-lg bg-secondary/40 p-4 space-y-3">
              <p className="text-sm text-muted-foreground">{t("overlapTitle")}</p>
              {overlap ? (
                <div className="space-y-2">
                  {timezones.map((tz) => {
                    const localStart = overlap.startUtc.goto(tz)
                    const localEnd = overlap.endUtc.goto(tz)
                    return (
                      <div key={tz} className="flex items-center justify-between text-sm">
                        <span>{tz}</span>
                        <span>
                          {localStart.format("time")} - {localEnd.format("time")}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm">{t("noOverlap")}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
