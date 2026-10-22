'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Plus, Search } from 'lucide-react'

export interface TimezonePickerOption {
  value: string
  label: string
  /** Right-aligned secondary text, e.g. "GMT+8" */
  meta?: string
}

interface TimezonePickerProps {
  options: TimezonePickerOption[]
  onSelect: (value: string) => void
  /** Trigger text */
  label: string
  searchPlaceholder?: string
  emptyLabel?: string
}

/** Pill trigger + popover list; mirrors the header language switcher. */
export function TimezonePicker({ options, onSelect, label, searchPlaceholder = 'Search...', emptyLabel = 'No results' }: TimezonePickerProps) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase()
    return s ? options.filter((o) => (o.label + ' ' + o.value + ' ' + (o.meta ?? '')).toLowerCase().includes(s)) : options
  }, [options, q])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o)
          setQ('')
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-transparent pl-3.5 pr-3 text-[13px] font-medium transition-colors hover:border-line2 hover:bg-surface"
      >
        <Plus className="size-4" aria-hidden="true" />
        <span>{label}</span>
        <ChevronDown className="size-3 text-subtle" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(340px,calc(100vw-32px))] rounded-[14px] border border-line bg-surface p-1.5 shadow-[0_18px_40px_-12px_rgba(16,17,20,.22),0_2px_6px_rgba(16,17,20,.06)]">
          <div className="relative p-0.5">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-subtle" aria-hidden="true" />
            <input
              autoFocus
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="h-9 w-full rounded-lg border border-line bg-paper pl-9 pr-3 text-sm outline-none placeholder:text-subtle focus:border-ink"
            />
          </div>
          <div role="listbox" aria-label={label} className="mt-1 flex max-h-[min(320px,50vh)] flex-col gap-0.5 overflow-y-auto">
            {shown.length === 0 && <div className="px-3 py-6 text-center text-sm text-subtle">{emptyLabel}</div>}
            {shown.map((o) => (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => {
                  onSelect(o.value)
                  setOpen(false)
                }}
                className="flex h-[38px] flex-none items-center justify-between gap-3 rounded-lg px-3 text-left text-sm transition-colors hover:bg-paper"
              >
                <span className="truncate">{o.label}</span>
                {o.meta && <span className="tnum flex-none font-mono text-[12px] text-subtle">{o.meta}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
