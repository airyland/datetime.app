"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { BellRing, Plus, Trash2, Upload } from "lucide-react"
import { cardClass, inputClass, monoLabel } from "@/components/ds"
import { cn } from "@/lib/utils"

type Tone = "beep" | "chime" | "pulse" | "custom"
interface Alarm {
  id: string
  time: string // HH:MM
  label: string
  days: number[] // 0=Sun..6=Sat, empty = once
  tone: Tone
  enabled: boolean
}

const STORE = "alarms.v1"
const FILE_STORE = "alarms.customSound"
const MAX_STORED_FILE = 1_500_000
const DAYS = ["S", "M", "T", "W", "T", "F", "S"]
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const TONES: { value: Tone; label: string }[] = [
  { value: "beep", label: "Beep" },
  { value: "chime", label: "Chime" },
  { value: "pulse", label: "Pulse" },
  { value: "custom", label: "Your own file" },
]

const pad = (n: number) => String(n).padStart(2, "0")
const hhmm = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`

/** Plays a short synthesized pattern once; returns nothing, safe to call repeatedly. */
function playTone(ctx: AudioContext, tone: Exclude<Tone, "custom">) {
  const now = ctx.currentTime
  const note = (freq: number, start: number, dur: number, type: OscillatorType = "sine", vol = 0.25) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type
    o.frequency.value = freq
    g.gain.setValueAtTime(0, now + start)
    g.gain.linearRampToValueAtTime(vol, now + start + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur)
    o.connect(g).connect(ctx.destination)
    o.start(now + start)
    o.stop(now + start + dur + 0.05)
  }
  if (tone === "beep") {
    for (let i = 0; i < 3; i++) note(880, i * 0.28, 0.18, "square", 0.12)
  } else if (tone === "chime") {
    note(659.25, 0, 0.9)
    note(830.6, 0.25, 0.9)
    note(987.8, 0.5, 1.2)
  } else {
    for (let i = 0; i < 4; i++) note(i % 2 ? 520 : 740, i * 0.2, 0.18, "triangle", 0.3)
  }
}

export default function AlarmClient() {
  const [now, setNow] = useState<Date | null>(null)
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [loaded, setLoaded] = useState(false)
  const [ringing, setRinging] = useState<Alarm | null>(null)
  const [customSound, setCustomSound] = useState<{ name: string; url: string } | null>(null)
  const [notice, setNotice] = useState("")

  // form
  const [time, setTime] = useState("07:00")
  const [label, setLabel] = useState("")
  const [days, setDays] = useState<number[]>([])
  const [tone, setTone] = useState<Tone>("chime")

  const ctxRef = useRef<AudioContext | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const firedRef = useRef<string>("") // `${id}@${yyyy-mm-dd hh:mm}` already rung
  const snoozedRef = useRef<{ alarm: Alarm; at: number }[]>([])
  const titleRef = useRef("")

  const getCtx = () => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume()
    return ctxRef.current
  }

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE)
      if (raw) setAlarms(JSON.parse(raw))
      const f = localStorage.getItem(FILE_STORE)
      if (f) setCustomSound(JSON.parse(f))
    } catch {}
    setLoaded(true)
    setNow(new Date())
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORE, JSON.stringify(alarms))
    } catch {}
  }, [alarms, loaded])

  const stopSound = useCallback(() => {
    if (loopRef.current) clearInterval(loopRef.current)
    loopRef.current = null
    audioRef.current?.pause()
    audioRef.current = null
  }, [])

  const startSound = useCallback(
    (t: Tone) => {
      stopSound()
      if (t === "custom" && customSound) {
        const a = new Audio(customSound.url)
        a.loop = true
        void a.play().catch(() => {})
        audioRef.current = a
        return
      }
      const kind = t === "custom" ? "chime" : t
      const play = () => playTone(getCtx(), kind)
      play()
      loopRef.current = setInterval(play, 1800)
    },
    [customSound, stopSound],
  )

  const ring = useCallback(
    (a: Alarm) => {
      setRinging(a)
      startSound(a.tone)
      titleRef.current = document.title
      document.title = `⏰ ${a.label || a.time}`
      try {
        if ("Notification" in window && Notification.permission === "granted") new Notification(a.label || "Alarm", { body: a.time })
      } catch {}
    },
    [startSound],
  )

  const dismiss = useCallback(() => {
    stopSound()
    if (titleRef.current) document.title = titleRef.current
    setRinging(null)
  }, [stopSound])

  const snooze = useCallback(() => {
    if (!ringing) return
    snoozedRef.current.push({ alarm: ringing, at: Date.now() + 5 * 60_000 })
    dismiss()
  }, [ringing, dismiss])

  // clock + trigger check
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date()
      setNow(d)
      if (ringing) return
      const due = snoozedRef.current.find((s) => s.at <= d.getTime())
      if (due) {
        snoozedRef.current = snoozedRef.current.filter((s) => s !== due)
        ring(due.alarm)
        return
      }
      const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${hhmm(d)}`
      for (const a of alarms) {
        if (!a.enabled || a.time !== hhmm(d)) continue
        if (a.days.length && !a.days.includes(d.getDay())) continue
        const key = `${a.id}@${stamp}`
        if (firedRef.current === key) continue
        firedRef.current = key
        if (!a.days.length) setAlarms((prev) => prev.map((x) => (x.id === a.id ? { ...x, enabled: false } : x)))
        ring(a)
        break
      }
    }, 1000)
    return () => clearInterval(id)
  }, [alarms, ringing, ring])

  useEffect(() => () => stopSound(), [stopSound])

  const addAlarm = () => {
    if (!/^\d{2}:\d{2}$/.test(time)) return
    try {
      if ("Notification" in window && Notification.permission === "default") void Notification.requestPermission()
    } catch {}
    getCtx() // unlock audio while we have a user gesture
    setAlarms((prev) =>
      [...prev, { id: crypto.randomUUID(), time, label: label.trim(), days: [...days].sort(), tone, enabled: true }].sort((a, b) =>
        a.time.localeCompare(b.time),
      ),
    )
    setLabel("")
  }

  const onFile = (file: File | undefined) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    const next = { name: file.name, url }
    setCustomSound(next)
    setTone("custom")
    if (file.size <= MAX_STORED_FILE) {
      const r = new FileReader()
      r.onload = () => {
        const stored = { name: file.name, url: String(r.result) }
        try {
          localStorage.setItem(FILE_STORE, JSON.stringify(stored))
          setCustomSound(stored)
          setNotice("")
        } catch {
          setNotice("Sound loaded for this visit only (browser storage is full).")
        }
      }
      r.readAsDataURL(file)
    } else {
      try {
        localStorage.removeItem(FILE_STORE)
      } catch {}
      setNotice("File is larger than 1.5 MB, so it will only be kept until you reload the page.")
    }
  }

  const testSound = () => {
    if (ringing) return
    if (tone === "custom" && customSound) {
      startSound("custom")
      setTimeout(stopSound, 3000)
    } else {
      playTone(getCtx(), tone === "custom" ? "chime" : tone)
    }
  }

  const toggleDay = (d: number) => setDays((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]))
  const repeatText = (a: Alarm) =>
    a.days.length === 0 ? "Once" : a.days.length === 7 ? "Every day" : a.days.map((d) => DAY_NAMES[d].slice(0, 3)).join(", ")

  const labelCls = cn(monoLabel, "mb-2 block")

  return (
    <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))" }}>
      <div className={cn(cardClass, "px-[clamp(20px,3vw,32px)] py-[clamp(20px,3vw,28px)]")}>
        <div className={monoLabel}>Now</div>
        <div className="tnum mt-2 font-mono text-[clamp(40px,6vw,64px)] font-medium leading-none tracking-[-0.03em]" suppressHydrationWarning>
          {now ? `${pad(now.getHours())}:${pad(now.getMinutes())}` : "--:--"}
          <span className="text-[.45em] text-subtle">{now ? `:${pad(now.getSeconds())}` : ""}</span>
        </div>

        <h2 className="m-0 mt-8 text-xl font-semibold tracking-[-0.02em]">New alarm</h2>
        <div className="mt-4 flex flex-col gap-[18px]">
          <div className="flex flex-wrap gap-3.5">
            <div className="min-w-0 flex-[1_1_130px]">
              <label htmlFor="alarm-time" className={labelCls}>Time</label>
              <input id="alarm-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className={cn(inputClass, "font-mono")} />
            </div>
            <div className="min-w-0 flex-[2_1_180px]">
              <label htmlFor="alarm-label" className={labelCls}>Label</label>
              <input id="alarm-label" type="text" maxLength={60} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Wake up" className={inputClass} />
            </div>
          </div>

          <div>
            <span className={labelCls}>Repeat</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Repeat on">
              {DAYS.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  aria-pressed={days.includes(i)}
                  aria-label={DAY_NAMES[i]}
                  onClick={() => toggleDay(i)}
                  className={cn(
                    "size-10 rounded-full border text-sm font-medium transition-colors",
                    days.includes(i) ? "border-ink bg-ink text-paper" : "border-line2 hover:border-ink",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="m-0 mt-2 text-[13px] text-subtle">{days.length ? "Repeats on the selected days." : "No day selected: rings once."}</p>
          </div>

          <div className="flex flex-wrap items-end gap-3.5">
            <div className="min-w-0 flex-[1_1_180px]">
              <label htmlFor="alarm-tone" className={labelCls}>Sound</label>
              <select id="alarm-tone" value={tone} onChange={(e) => setTone(e.target.value as Tone)} className={cn(inputClass, "appearance-none")}>
                {TONES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <button type="button" onClick={testSound} className="h-11 rounded-full border border-line2 px-5 text-sm font-medium transition-colors hover:border-ink">
              Test sound
            </button>
          </div>

          {tone === "custom" && (
            <div>
              <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-line2 px-5 text-sm font-medium transition-colors hover:border-ink">
                <Upload className="size-4" aria-hidden="true" />
                {customSound ? "Change file" : "Choose audio file"}
                <input type="file" accept="audio/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
              </label>
              <span className="ml-3 text-[13px] text-subtle">{customSound ? customSound.name : "No file chosen (Chime plays instead)"}</span>
              {notice && <p className="m-0 mt-2 text-[13px] text-subtle">{notice}</p>}
            </div>
          )}

          <button
            type="button"
            onClick={addAlarm}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[15px] font-medium text-paper transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add alarm
          </button>
        </div>
      </div>

      <div className={cn(cardClass, "px-[clamp(20px,3vw,32px)] py-[clamp(20px,3vw,28px)]")}>
        <h2 className="m-0 text-xl font-semibold tracking-[-0.02em]">Your alarms</h2>
        {alarms.length === 0 ? (
          <p className="m-0 mt-4 text-[15px] leading-relaxed text-subtle">No alarms yet. Add one and keep this tab open.</p>
        ) : (
          <ul className="m-0 mt-4 flex list-none flex-col p-0">
            {alarms.map((a) => (
              <li key={a.id} className="flex items-center gap-4 border-t border-line py-4 first:border-t-0 first:pt-0">
                <div className="min-w-0 flex-1">
                  <div className={cn("tnum font-mono text-[28px] font-medium leading-none tracking-[-0.02em]", !a.enabled && "text-subtle")}>{a.time}</div>
                  <div className="mt-1.5 truncate text-sm text-subtle">
                    {a.label ? `${a.label} · ` : ""}
                    {repeatText(a)}
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={a.enabled}
                  aria-label={`${a.enabled ? "Turn off" : "Turn on"} alarm at ${a.time}`}
                  onClick={() => setAlarms((p) => p.map((x) => (x.id === a.id ? { ...x, enabled: !x.enabled } : x)))}
                  className={cn("relative h-7 w-12 flex-none rounded-full border transition-colors", a.enabled ? "border-ink bg-ink" : "border-line2 bg-transparent")}
                >
                  <span className={cn("absolute top-1/2 size-5 -translate-y-1/2 rounded-full transition-all", a.enabled ? "left-[24px] bg-paper" : "left-[3px] bg-subtle")} />
                </button>
                <button
                  type="button"
                  aria-label={`Delete alarm at ${a.time}`}
                  onClick={() => setAlarms((p) => p.filter((x) => x.id !== a.id))}
                  className="inline-flex size-9 flex-none items-center justify-center rounded-full text-subtle transition-colors hover:text-ink"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="m-0 mt-5 text-[13px] leading-relaxed text-subtle">Alarms ring only while this page is open. They are stored in your browser and follow your device&apos;s local time.</p>
      </div>

      {ringing && (
        <div role="alertdialog" aria-modal="true" aria-label="Alarm ringing" className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-4">
          <div className={cn(cardClass, "w-full max-w-[380px] px-8 py-9 text-center shadow-2xl")}>
            <BellRing className="mx-auto size-8 text-brand" aria-hidden="true" />
            <div className="tnum mt-4 font-mono text-5xl font-medium tracking-[-0.03em]">{ringing.time}</div>
            {ringing.label && <p className="m-0 mt-3 text-lg">{ringing.label}</p>}
            <div className="mt-7 flex gap-3">
              <button type="button" onClick={snooze} className="h-12 flex-1 rounded-full border border-line2 text-[15px] font-medium transition-colors hover:border-ink">
                Snooze 5 min
              </button>
              <button type="button" autoFocus onClick={dismiss} className="h-12 flex-1 rounded-full bg-ink text-[15px] font-medium text-paper transition-opacity hover:opacity-90">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
