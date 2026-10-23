"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

/** Google AdSense auto-relaxed slot. The adsbygoogle.js script is loaded in the root layout. */
export function AdSlot() {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])

  return (
    <div className="mx-auto max-w-3xl">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-8443907573529681"
        data-ad-slot="8712987437"
      />
    </div>
  )
}
