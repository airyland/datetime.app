"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const dark = mounted && resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-transparent transition-colors hover:border-line2 hover:bg-surface"
    >
      {dark ? <Sun className="size-[17px]" aria-hidden="true" /> : <Moon className="size-[17px]" aria-hidden="true" />}
    </button>
  )
}
