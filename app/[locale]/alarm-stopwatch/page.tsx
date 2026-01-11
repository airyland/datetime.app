"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { AlarmClock, Play, Pause, RotateCcw, Timer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import StructuredData from "@/components/structured-data"
import { getLocalePath } from "@/lib/locale-utils"

export default function AlarmStopwatchPage({ params }: { params: { locale: string } }) {
  const { locale } = params
  const t = useTranslations("alarmStopwatch")
  const [alarmTime, setAlarmTime] = useState("")
  const [alarmActive, setAlarmActive] = useState(false)
  const [alarmStatus, setAlarmStatus] = useState("")
  const [stopwatchRunning, setStopwatchRunning] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [laps, setLaps] = useState<string[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)

  const playSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.type = "square"
    oscillator.frequency.value = 660
    gain.gain.value = 0.1
    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.start()
    oscillator.stop(ctx.currentTime + 0.4)
  }

  useEffect(() => {
    if (!alarmActive || !alarmTime) return
    const timer = setInterval(() => {
      const now = new Date()
      const [hour, minute] = alarmTime.split(":").map(Number)
      if (now.getHours() === hour && now.getMinutes() === minute && now.getSeconds() === 0) {
        playSound()
        setAlarmStatus(t("alarmTriggered"))
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [alarmActive, alarmTime, t])

  useEffect(() => {
    if (!stopwatchRunning) return
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [stopwatchRunning])

  const formattedStopwatch = useMemo(() => {
    const hours = Math.floor(elapsedSeconds / 3600)
    const minutes = Math.floor((elapsedSeconds % 3600) / 60)
    const seconds = elapsedSeconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }, [elapsedSeconds])

  const toggleStopwatch = () => setStopwatchRunning((prev) => !prev)

  const resetStopwatch = () => {
    setStopwatchRunning(false)
    setElapsedSeconds(0)
    setLaps([])
  }

  const addLap = () => {
    setLaps((prev) => [`${prev.length + 1}. ${formattedStopwatch}`, ...prev])
  }

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("title"),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    url: `https://datetime.app${getLocalePath("/alarm-stopwatch", locale)}`,
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

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlarmClock className="h-5 w-5" />
                {t("alarmTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="time"
                value={alarmTime}
                onChange={(event) => setAlarmTime(event.target.value)}
              />
              <div className="flex items-center gap-3">
                <Button onClick={() => setAlarmActive((prev) => !prev)}>
                  {alarmActive ? t("disableAlarm") : t("enableAlarm")}
                </Button>
                <Button variant="outline" onClick={playSound}>
                  {t("testSound")}
                </Button>
              </div>
              {alarmStatus && <p className="text-sm text-muted-foreground">{alarmStatus}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                {t("stopwatchTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-mono text-center">{formattedStopwatch}</div>
              <div className="flex justify-center gap-2">
                <Button onClick={toggleStopwatch} className="gap-2">
                  {stopwatchRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {stopwatchRunning ? t("pause") : t("start")}
                </Button>
                <Button variant="outline" onClick={resetStopwatch} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  {t("reset")}
                </Button>
                <Button variant="outline" onClick={addLap} disabled={!stopwatchRunning}>
                  {t("lap")}
                </Button>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground max-h-36 overflow-auto">
                {laps.length === 0 && <p>{t("noLaps")}</p>}
                {laps.map((lap) => (
                  <p key={lap}>{lap}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
