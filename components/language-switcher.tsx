'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { DEFAULT_LOCALE, LANGUAGE_OPTIONS, LOCALE_PREFIXES } from '@/lib/locales'

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const pathSegments = pathname.split('/').filter(Boolean)
  const hasPrefix = pathSegments.length > 0 && LOCALE_PREFIXES.includes(pathSegments[0] as typeof LOCALE_PREFIXES[number])
  const currentLocale = hasPrefix ? pathSegments[0] : DEFAULT_LOCALE
  const currentName = LANGUAGE_OPTIONS.find((l) => l.code === currentLocale)?.name ?? 'English'

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

  const handleLocaleChange = (newLocale: string) => {
    const rest = hasPrefix ? pathSegments.slice(1) : pathSegments
    const basePath = rest.length > 0 ? `/${rest.join('/')}` : '/'
    const newPath = newLocale === DEFAULT_LOCALE ? basePath : basePath === '/' ? `/${newLocale}` : `/${newLocale}${basePath}`
    setOpen(false)
    router.push(newPath)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-transparent pl-3.5 pr-3 text-[13px] font-medium transition-colors hover:border-line2 hover:bg-surface"
      >
        <Globe className="size-4" aria-hidden="true" />
        <span className="max-w-[7.5rem] truncate max-sm:hidden">{currentName}</span>
        <ChevronDown className="size-3 text-subtle" aria-hidden="true" />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label="Language"
          className="absolute right-0 top-[calc(100%+8px)] z-50 grid w-[min(340px,calc(100vw-32px))] grid-cols-2 gap-0.5 rounded-[14px] border border-line bg-surface p-1.5 shadow-[0_18px_40px_-12px_rgba(16,17,20,.22),0_2px_6px_rgba(16,17,20,.06)]"
        >
          {LANGUAGE_OPTIONS.map((lang) => {
            const on = lang.code === currentLocale
            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={on}
                onClick={() => handleLocaleChange(lang.code)}
                className={`flex h-[38px] items-center justify-between gap-2 rounded-lg px-3 text-left text-sm transition-colors hover:bg-paper ${on ? 'bg-paper font-semibold' : ''}`}
              >
                <span className="truncate">{lang.name}</span>
                {on && <Check className="size-3.5 shrink-0 text-brand" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
