"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowLeftRight, Plane, CalendarCheck2, Clock } from "lucide-react"
import spacetime from "spacetime"
import { citiesData } from "../../cities/[city]/metadata"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getLocalePath } from "@/lib/locale-utils"
import StructuredData from "@/components/structured-data"

type CityInfo = (typeof citiesData)[keyof typeof citiesData]

const WORKDAY_START = 9
const WORKDAY_END = 17

const parseCoordinates = (coordinates: string) => {
  const parts = coordinates.split(",")
  if (parts.length !== 2) {
    return null
  }

  const parsePart = (part: string) => {
    const trimmed = part.trim()
    const value = parseFloat(trimmed)
    if (Number.isNaN(value)) return null
    const lastChar = trimmed.charAt(trimmed.length - 1).toUpperCase()
    const sign = lastChar === "S" || lastChar === "W" ? -1 : 1
    return value * sign
  }

  const lat = parsePart(parts[0])
  const lon = parsePart(parts[1])

  if (lat == null || lon == null) {
    return null
  }

  return { lat, lon }
}

const haversineKm = (start: { lat: number; lon: number }, end: { lat: number; lon: number }) => {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const R = 6371
  const dLat = toRad(end.lat - start.lat)
  const dLon = toRad(end.lon - start.lon)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(start.lat)) * Math.cos(toRad(end.lat)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const getTimeDifference = (cityA: CityInfo, cityB: CityInfo) => {
  const offsetA = spacetime.now(cityA.timezone).timezone().current.offset
  const offsetB = spacetime.now(cityB.timezone).timezone().current.offset
  const diff = offsetA - offsetB
  return diff
}

const getMeetingOverlap = (cityA: CityInfo, cityB: CityInfo) => {
  for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
    const baseA = spacetime.now(cityA.timezone).add(dayOffset, "day")
    const baseB = spacetime.now(cityB.timezone).add(dayOffset, "day")

    const startA = baseA.clone().hour(WORKDAY_START).minute(0).second(0).millisecond(0)
    const endA = baseA.clone().hour(WORKDAY_END).minute(0).second(0).millisecond(0)
    const startB = baseB.clone().hour(WORKDAY_START).minute(0).second(0).millisecond(0)
    const endB = baseB.clone().hour(WORKDAY_END).minute(0).second(0).millisecond(0)

    const startUTC = startA.goto("UTC")
    const endUTC = endA.goto("UTC")
    const startBUtc = startB.goto("UTC")
    const endBUtc = endB.goto("UTC")

    const overlapStart = startUTC.epoch > startBUtc.epoch ? startUTC : startBUtc
    const overlapEnd = endUTC.epoch < endBUtc.epoch ? endUTC : endBUtc

    if (overlapStart.epoch < overlapEnd.epoch) {
      return {
        dayOffset,
        overlapStart,
        overlapEnd,
      }
    }
  }

  return null
}

interface TimeDifferenceClientProps {
  pair: string
  locale: string
}

export default function TimeDifferenceClient({ pair, locale }: TimeDifferenceClientProps) {
  const t = useTranslations("timeDifference")
  const tCities = useTranslations("cities")
  const [currentTime, setCurrentTime] = useState(new Date())

  const [cityAKey, cityBKey] = pair.split("-vs-")
  const cityA = citiesData[cityAKey as keyof typeof citiesData]
  const cityB = citiesData[cityBKey as keyof typeof citiesData]

  const getCityName = (key: string, fallback: string) => {
    try {
      return tCities(`cityNames.${key}`)
    } catch {
      return fallback
    }
  }

  const cityAName = getCityName(cityAKey, cityA.name)
  const cityBName = getCityName(cityBKey, cityB.name)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timeDifference = useMemo(() => getTimeDifference(cityA, cityB), [cityA, cityB])
  const meetingOverlap = useMemo(() => getMeetingOverlap(cityA, cityB), [cityA, cityB])

  const cityATime = useMemo(
    () =>
      currentTime.toLocaleTimeString(locale, {
        timeZone: cityA.timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [currentTime, cityA.timezone, locale]
  )

  const cityBTime = useMemo(
    () =>
      currentTime.toLocaleTimeString(locale, {
        timeZone: cityB.timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [currentTime, cityB.timezone, locale]
  )

  const flightEstimate = useMemo(() => {
    const start = parseCoordinates(cityA.coordinates)
    const end = parseCoordinates(cityB.coordinates)
    if (!start || !end) return null
    const distanceKm = haversineKm(start, end)
    const cruiseSpeed = 900
    const durationHours = distanceKm / cruiseSpeed
    return {
      distanceKm,
      durationHours,
    }
  }, [cityA.coordinates, cityB.coordinates])

  const meetingLabel = useMemo(() => {
    if (!meetingOverlap) return null
    const startLocalA = meetingOverlap.overlapStart.goto(cityA.timezone)
    const endLocalA = meetingOverlap.overlapEnd.goto(cityA.timezone)
    const startLocalB = meetingOverlap.overlapStart.goto(cityB.timezone)
    const endLocalB = meetingOverlap.overlapEnd.goto(cityB.timezone)

    return {
      startLocalA,
      endLocalA,
      startLocalB,
      endLocalB,
      dayOffset: meetingOverlap.dayOffset,
    }
  }, [meetingOverlap, cityA.timezone, cityB.timezone])

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("metaTitle", { cityA: cityAName, cityB: cityBName }),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    url: `https://datetime.app${getLocalePath(`/time-difference/${pair}`, locale)}`,
    inLanguage: locale,
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <StructuredData data={webAppSchema} />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t("title", { cityA: cityAName, cityB: cityBName })}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle", { cityA: cityAName, cityB: cityBName })}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {cityAName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-mono">{cityATime}</p>
              <p className="text-sm text-muted-foreground">{cityA.country}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {cityBName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-mono">{cityBTime}</p>
              <p className="text-sm text-muted-foreground">{cityB.country}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              {t("timeDifferenceTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-lg">
              {t("timeDifferenceValue", {
                hours: Math.abs(timeDifference),
                direction: timeDifference >= 0 ? t("ahead") : t("behind"),
                cityA: cityAName,
                cityB: cityBName,
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("differenceNote")}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck2 className="h-5 w-5" />
              {t("meetingPlannerTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {meetingLabel ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {meetingLabel.dayOffset === 0
                    ? t("meetingToday")
                    : t("meetingInDays", { days: meetingLabel.dayOffset })}
                </p>
                <p className="text-lg">
                  {t("meetingTime", {
                    cityA: cityAName,
                    timeA: meetingLabel.startLocalA.format("time"),
                    endA: meetingLabel.endLocalA.format("time"),
                    cityB: cityBName,
                    timeB: meetingLabel.startLocalB.format("time"),
                    endB: meetingLabel.endLocalB.format("time"),
                  })}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">{t("meetingUnavailable")}</p>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              {t("flightTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {flightEstimate ? (
              <div className="space-y-2">
                <p className="text-lg">
                  {t("flightDistance", { distance: Math.round(flightEstimate.distanceKm) })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("flightDuration", { hours: flightEstimate.durationHours.toFixed(1) })}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">{t("flightUnavailable")}</p>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Link
            href={getLocalePath("/cities", locale)}
            className="text-sm text-primary hover:underline"
          >
            {t("viewAllCities")}
          </Link>
        </div>
      </div>
    </main>
  )
}
