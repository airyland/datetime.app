"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { CheckCircle2, Clock, ListPlus, Pause, Play, RefreshCcw, Volume2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import StructuredData from "@/components/structured-data"
import { getLocalePath } from "@/lib/locale-utils"

const DEFAULT_WORK_MINUTES = 25
const DEFAULT_BREAK_MINUTES = 5
const LONG_BREAK_MINUTES = 15

interface TaskItem {
  id: string
  title: string
  completed: boolean
}

export default function PomodoroPage({ params }: { params: { locale: string } }) {
  const { locale } = params
  const t = useTranslations("pomodoro")
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [taskInput, setTaskInput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_WORK_MINUTES * 60)
  const audioContextRef = useRef<AudioContext | null>(null)

  const playSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.type = "sine"
    oscillator.frequency.value = 880
    gain.gain.value = 0.1
    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.start()
    oscillator.stop(ctx.currentTime + 0.3)
  }

  useEffect(() => {
    if (!isRunning) return
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          playSound()
          const nextIsBreak = !isBreak
          const nextCount = nextIsBreak ? sessionCount + 1 : sessionCount
          setIsBreak(nextIsBreak)
          setSessionCount(nextCount)
          if (nextIsBreak) {
            return nextCount % 4 === 0 ? LONG_BREAK_MINUTES * 60 : DEFAULT_BREAK_MINUTES * 60
          }
          return DEFAULT_WORK_MINUTES * 60
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isRunning, isBreak, sessionCount])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  const toggleTimer = () => setIsRunning((prev) => !prev)
  const resetTimer = () => {
    setIsRunning(false)
    setIsBreak(false)
    setSessionCount(0)
    setSecondsLeft(DEFAULT_WORK_MINUTES * 60)
  }

  const addTask = () => {
    const trimmed = taskInput.trim()
    if (!trimmed) return
    setTasks((prev) => [
      ...prev,
      { id: `${Date.now()}`, title: trimmed, completed: false },
    ])
    setTaskInput("")
  }

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const webAppSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: t("title"),
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Any",
      url: `https://datetime.app${getLocalePath("/pomodoro", locale)}`,
      inLanguage: locale,
    }),
    [locale, t]
  )

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
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {isBreak ? t("breakSession") : t("focusSession")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center text-5xl font-mono">
              {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
            </div>
            <div className="flex justify-center gap-3">
              <Button onClick={toggleTimer} className="gap-2">
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isRunning ? t("pause") : t("start")}
              </Button>
              <Button variant="outline" onClick={resetTimer} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                {t("reset")}
              </Button>
              <Button variant="outline" onClick={playSound} className="gap-2">
                <Volume2 className="h-4 w-4" />
                {t("testSound")}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">{t("sessionCount", { count: sessionCount })}</p>
          </CardContent>
        </Card>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListPlus className="h-5 w-5" />
              {t("taskList")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={taskInput}
                onChange={(event) => setTaskInput(event.target.value)}
                placeholder={t("taskPlaceholder")}
              />
              <Button onClick={addTask}>{t("addTask")}</Button>
            </div>
            <div className="space-y-2">
              {tasks.length === 0 && (
                <p className="text-sm text-muted-foreground">{t("emptyTasks")}</p>
              )}
              {tasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-left"
                >
                  <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                    {task.title}
                  </span>
                  {task.completed && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
