"use client"

import { useEffect, useState } from "react"

export default function EmbedClockPage({ params }: { params: { locale: string } }) {
  const { locale } = params
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
      <div className="text-3xl font-mono" suppressHydrationWarning>
        {now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </div>
    </div>
  )
}
