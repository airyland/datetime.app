"use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Moon, Sun } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import StructuredData from "@/components/structured-data"
import { getLocalePath } from "@/lib/locale-utils"

const getMoonPhase = (date: Date) => {
  const knownNewMoon = new Date("2000-01-06T18:14:00Z")
  const synodicMonth = 29.53058867
  const daysSince = (date.getTime() - knownNewMoon.getTime()) / 86400000
  const phase = ((daysSince % synodicMonth) + synodicMonth) % synodicMonth
  const phaseIndex = Math.floor((phase / synodicMonth) * 8)
  const phases = [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
    "Full Moon",
    "Waning Gibbous",
    "Last Quarter",
    "Waning Crescent",
  ]
  return phases[phaseIndex]
}

export default function SunriseSunsetPage({ params }: { params: { locale: string } }) {
  const { locale } = params
  const t = useTranslations("sunriseSunset")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [sunrise, setSunrise] = useState("")
  const [sunset, setSunset] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const moonPhase = useMemo(() => getMoonPhase(new Date()), [])

  const fetchSunTimes = () => {
    const lat = parseFloat(latitude)
    const lon = parseFloat(longitude)
    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      setError(t("invalidCoordinates"))
      return
    }
    setLoading(true)
    setError("")
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&timezone=auto&forecast_days=1`)
      .then((response) => response.json())
      .then((data) => {
        const sunriseIso = data.daily?.sunrise?.[0]
        const sunsetIso = data.daily?.sunset?.[0]
        if (sunriseIso && sunsetIso) {
          setSunrise(new Date(sunriseIso).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }))
          setSunset(new Date(sunsetIso).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }))
        } else {
          setError(t("fetchError"))
        }
      })
      .catch(() => setError(t("fetchError")))
      .finally(() => setLoading(false))
  }

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(t("locationUnavailable"))
      return
    }
    setError("")
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(4))
        setLongitude(position.coords.longitude.toFixed(4))
        setLoading(false)
      },
      () => {
        setError(t("locationDenied"))
        setLoading(false)
      }
    )
  }

  useEffect(() => {
    if (latitude && longitude) {
      fetchSunTimes()
    }
  }, [latitude, longitude])

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("title"),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    url: `https://datetime.app${getLocalePath("/sunrise-sunset", locale)}`,
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

        <Card className="max-w-2xl mx-auto mb-8">
          <CardHeader>
            <CardTitle>{t("locationTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                type="number"
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
                placeholder={t("latitude")}
              />
              <Input
                type="number"
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
                placeholder={t("longitude")}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={fetchSunTimes} disabled={loading}>{t("fetchTimes")}</Button>
              <Button variant="outline" onClick={useCurrentLocation} disabled={loading}>{t("useLocation")}</Button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                {t("sunTimes")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>{t("sunrise", { time: sunrise || "--:--" })}</p>
              <p>{t("sunset", { time: sunset || "--:--" })}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                {t("moonTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t("moonPhase", { phase: moonPhase })}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
