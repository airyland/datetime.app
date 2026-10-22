"use client"

import { useEffect, useState } from "react"
import { monoLabel } from "@/components/ds"

function pad(n: number) {
  return String(n).padStart(2, "0")
}

export default function UtcClock({ label }: { label: string }) {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const hm = now ? `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}` : "--:--"
  const ss = now ? pad(now.getUTCSeconds()) : "--"
  return (
    <div className="min-w-0 flex-[1_1_240px]">
      <div className={`${monoLabel} mb-2.5`}>{label}</div>
      <div className="tnum flex items-baseline whitespace-nowrap font-mono text-[clamp(40px,6vw,76px)] font-light leading-none tracking-[-0.055em]" suppressHydrationWarning>
        {hm}
        <span className="text-brand">:{ss}</span>
      </div>
    </div>
  )
}
