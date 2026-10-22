"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cardClass, monoLabel } from "@/components/ds"

const sizes = { S: 72, M: 120, L: 200 } as const

type Labels = { theme: string; light: string; dark: string; size: string; iframeTitle: string; copy: string }

export default function EmbedDemo({ labels }: { labels: Labels }) {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [size, setSize] = useState<keyof typeof sizes>("M")
  const [copied, setCopied] = useState(false)
  const h = sizes[size]
  const src = `https://datetime.app/embed/year?theme=${theme}`
  const snippet = `<iframe src="${src}" width="100%" height="${h}" style="border:0" title="Current year"></iframe>`

  const seg = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm transition-colors ${active ? "border-ink bg-ink text-btn-ink" : "border-line2 text-subtle hover:text-ink"}`

  return (
    <div className={`${cardClass} overflow-hidden`}>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-line p-4">
        <div className="flex items-center gap-2"><span className={monoLabel}>{labels.theme}</span>
          {(["light", "dark"] as const).map((t) => <button key={t} className={seg(theme === t)} onClick={() => setTheme(t)}>{t === "light" ? labels.light : labels.dark}</button>)}
        </div>
        <div className="flex items-center gap-2"><span className={monoLabel}>{labels.size}</span>
          {(Object.keys(sizes) as (keyof typeof sizes)[]).map((s) => <button key={s} className={seg(size === s)} onClick={() => setSize(s)}>{s}</button>)}
        </div>
      </div>
      <div className="bg-paper p-4 sm:p-8">
        <iframe key={theme} src={`/embed/year?theme=${theme}`} width="100%" height={h} title={labels.iframeTitle} className="block rounded-xl border border-line" />
      </div>
      <div className="flex items-start gap-3 border-t border-line p-4">
        <code className="min-w-0 flex-1 break-all font-mono text-[13px] leading-relaxed text-subtle">{snippet}</code>
        <button
          aria-label={labels.copy}
          className="inline-flex size-9 flex-none items-center justify-center rounded-full border border-line2 text-subtle hover:text-ink"
          onClick={() => { navigator.clipboard?.writeText(snippet); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
        >
          {copied ? <Check className="size-4 text-ok" /> : <Copy className="size-4" />}
        </button>
      </div>
    </div>
  )
}
