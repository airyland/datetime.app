"use client"

import { useEffect } from "react"
import { appendAdSenseScript } from "@/lib/adsense-script"

export function AdSenseScript() {
  useEffect(() => {
    let timer: number | undefined
    let idle: number | undefined
    const load = () => appendAdSenseScript(document)
    const schedule = () => {
      if (typeof window.requestIdleCallback === 'function') {
        idle = window.requestIdleCallback(load, { timeout: 1500 })
      } else {
        timer = window.setTimeout(load, 0)
      }
    }

    // Start after hydration reaches this layout and the document finishes loading.
    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })

    return () => {
      window.removeEventListener('load', schedule)
      if (idle !== undefined) window.cancelIdleCallback(idle)
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [])

  return null
}
