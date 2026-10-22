'use client'

import { useMemo } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

// Type for timezone info
export interface TimezoneInfo {
  city?: string
  name?: string
  value?: string
  label?: string
  isLocal?: boolean
}

interface TimezoneTimelineProps {
  timezones: TimezoneInfo[]
  /** Current instant; defaults to a self-updating clock owned by the caller. */
  now: Date
  use24Hour?: boolean
  dstLabel?: string
  localLabel?: string
  removeLabel?: string
  dayLabel?: string
  twilightLabel?: string
  nightLabel?: string
  nowLabel?: string
  onRemove?: (value: string) => void
  /** @deprecated kept for backwards compatibility, no longer used */
  onSwitchToWorldClock?: () => void
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const HOUR_MS = 3600000

const formatters = new Map<string, Intl.DateTimeFormat>()
function getFormatter(tz: string) {
  let f = formatters.get(tz)
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    })
    formatters.set(tz, f)
  }
  return f
}

function parts(tz: string, ts: number) {
  const o: Record<string, string> = {}
  getFormatter(tz)
    .formatToParts(ts)
    .forEach((p) => {
      o[p.type] = p.value
    })
  const h = Number(o.hour) % 24
  const asUtc = Date.UTC(Number(o.year), Number(o.month) - 1, Number(o.day), h, Number(o.minute), Number(o.second))
  return {
    y: Number(o.year),
    mo: Number(o.month),
    d: Number(o.day),
    h,
    mi: Number(o.minute),
    off: Math.round((asUtc - Math.floor(ts / 1000) * 1000) / 60000),
  }
}

function offLabel(off: number) {
  const a = Math.abs(off)
  const h = Math.floor(a / 60)
  const m = a % 60
  return `GMT${off < 0 ? '-' : '+'}${h}${m ? ':' + String(m).padStart(2, '0') : ''}`
}

function isDst(tz: string, p: { y: number; off: number }) {
  const a = parts(tz, Date.UTC(p.y, 0, 1)).off
  const b = parts(tz, Date.UTC(p.y, 6, 1)).off
  return a !== b && p.off === Math.max(a, b)
}

function band(h: number): 'day' | 'mid' | 'night' {
  if (h >= 8 && h < 18) return 'day'
  if ((h >= 6 && h < 8) || (h >= 18 && h < 22)) return 'mid'
  return 'night'
}

function cityLabel(id: string) {
  return id.split('/').pop()!.replace(/_/g, ' ')
}

function safeTz(name: string) {
  try {
    getFormatter(name)
    return name
  } catch {
    return 'UTC'
  }
}

const AXIS = [0, 3, 6, 9, 12, 15, 18, 21]

/**
 * World-clock rows aligned to the viewer's local day, with a single accent
 * "now" line spanning every row.
 *
 * Usage:
 *   <TimezoneTimeline timezones={[{ label: 'Local', value: tz, isLocal: true }]} now={now} onRemove={fn} />
 */
const TimezoneTimeline = ({
  timezones,
  now,
  use24Hour = true,
  dstLabel = 'DST',
  localLabel = 'Local',
  removeLabel = 'Remove timezone',
  dayLabel = 'Daytime',
  twilightLabel = 'Early / late',
  nightLabel = 'Night',
  nowLabel = 'Now',
  onRemove,
}: TimezoneTimelineProps) => {
  const ts = now.getTime()
  const localId = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    } catch {
      return 'UTC'
    }
  }, [])

  const list: TimezoneInfo[] = timezones.length > 0 ? timezones : [{ label: 'Local', value: localId, isLocal: true }]

  // Local midnight (the strips are anchored to the viewer's day)
  const dayStart = new Date(ts)
  dayStart.setHours(0, 0, 0, 0)
  const mid = dayStart.getTime()
  const secOfDay = (ts - mid) / 1000
  const linePos = Math.min(100, Math.max(0, (secOfDay / 86400) * 100))
  const lp = parts(localId, ts)
  const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const rows = list.map((z) => {
    const id = safeTz(z.name || z.value || 'UTC')
    const p = parts(id, ts)
    const hh = p.h
    const time = use24Hour ? `${String(hh).padStart(2, '0')}:${String(p.mi).padStart(2, '0')}` : `${String(hh % 12 || 12).padStart(2, '0')}:${String(p.mi).padStart(2, '0')}`
    const ap = use24Hour ? '' : hh < 12 ? 'AM' : 'PM'
    const diff = Math.round((Date.UTC(p.y, p.mo - 1, p.d) - Date.UTC(lp.y, lp.mo - 1, lp.d)) / 864e5)
    const rel = diff === 0 ? 'Today' : diff > 0 ? 'Tomorrow' : 'Yesterday'

    const cells: { t: string; b: string }[] = []
    let midnightAt = -1
    for (let i = 0; i < 24; i++) {
      const q = parts(id, mid + i * HOUR_MS + HOUR_MS / 2)
      cells.push({ t: `${String(q.h).padStart(2, '0')}:00`, b: band(q.h) })
      if (midnightAt < 0 && q.h === 0) midnightAt = i
    }
    const mark = midnightAt > 0 ? { pos: (midnightAt / 24) * 100, ...(() => { const q = parts(id, mid + midnightAt * HOUR_MS + HOUR_MS / 2); return { label: `${MONTHS[q.mo - 1]} ${q.d}` } })() } : null

    return {
      key: (z.name || z.value || 'UTC') + (z.isLocal ? '-local' : ''),
      value: z.value || z.name || 'UTC',
      name: z.isLocal ? cityLabel(id) : z.city || z.label || cityLabel(id),
      isLocal: !!z.isLocal,
      sub: `${offLabel(p.off)} · ${rel}`,
      dst: isDst(id, p),
      time,
      ap,
      cells,
      mark,
    }
  })

  const gridCls =
    'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-3 px-5 min-[821px]:grid-cols-[minmax(140px,210px)_116px_minmax(0,1fr)_28px] min-[821px]:gap-y-0'

  return (
    <div className="relative overflow-hidden rounded-[18px] border border-line bg-surface">
      {/* axis */}
      <div aria-hidden="true" className={cn(gridCls, 'hidden h-[52px] border-b border-line min-[821px]:grid')}>
        <div />
        <div />
        <div className="relative h-full">
          {AXIS.map((h) => (
            <div key={h} className="absolute bottom-0 flex h-full flex-col justify-end" style={{ left: `${(h / 24) * 100}%` }}>
              <span className="mb-[7px] ml-[5px] block font-mono text-[10.5px] text-subtle">{String(h).padStart(2, '0')}:00</span>
              <span className="absolute bottom-0 left-0 block h-[7px] w-px bg-line2" />
            </div>
          ))}
        </div>
        <div />
      </div>

      {/* rows */}
      <div className="cl">
        {rows.map((r) => (
          <div key={r.key} className={cn(gridCls, 'border-t border-line py-3.5')}>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-base font-medium tracking-[-0.01em]">
                <span className="truncate">{r.name}</span>
                {r.isLocal && (
                  <span className="flex-none rounded-full bg-ink px-[7px] py-px text-[10.5px] font-medium uppercase tracking-[.04em] text-btn-ink">{localLabel}</span>
                )}
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[12.5px] text-subtle">
                <span>{r.sub}</span>
                {r.dst && <span className="rounded-full border border-line2 px-1.5 text-[10.5px]">{dstLabel}</span>}
              </div>
            </div>
            <div className="tnum whitespace-nowrap text-right font-mono text-[28px] font-light leading-none tracking-[-0.045em]">
              {r.time}
              {r.ap && <span className="ml-[5px] text-[11px] font-normal tracking-normal text-subtle">{r.ap}</span>}
            </div>
            <div className="relative col-span-full min-[821px]:col-auto">
              <div className="grid h-[26px] grid-cols-[repeat(24,minmax(0,1fr))] overflow-hidden rounded-[7px] shadow-[inset_0_0_0_1px_var(--line)]">
                {r.cells.map((c, i) => (
                  <div key={i} title={c.t} className={c.b === 'day' ? 'bg-day' : c.b === 'mid' ? 'bg-mid' : 'bg-night'} />
                ))}
              </div>
              {r.mark && (
                <>
                  <span aria-hidden="true" className="absolute inset-y-0 -ml-px w-0.5 bg-surface" style={{ left: `${r.mark.pos}%` }} />
                  <span
                    aria-hidden="true"
                    className="absolute top-[5px] h-4 whitespace-nowrap rounded bg-surface px-1.5 font-mono text-[10px] leading-4 text-ink shadow-[0_0_0_1px_var(--line)]"
                    style={{ left: `calc(${r.mark.pos}% + 6px)` }}
                  >
                    {r.mark.label}
                  </span>
                </>
              )}
              <span
                aria-hidden="true"
                className="absolute -inset-y-1 -ml-px w-0.5 rounded-[1px] bg-brand min-[821px]:hidden"
                style={{ left: `${linePos}%` }}
              />
            </div>
            <div className="hidden text-right min-[821px]:block">
              {onRemove && !r.isLocal && (
                <button
                  type="button"
                  onClick={() => onRemove(r.value)}
                  aria-label={removeLabel}
                  title={removeLabel}
                  className="inline-flex size-7 items-center justify-center rounded-lg border border-transparent text-subtle transition-colors hover:border-line2 hover:bg-paper"
                >
                  <X className="size-3.5" strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* legend */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line px-5 py-3 text-[12.5px] text-subtle">
        {[
          ['bg-day', dayLabel, '08:00–18:00'],
          ['bg-mid', twilightLabel, '06:00–08:00 · 18:00–22:00'],
          ['bg-night', nightLabel, '22:00–06:00'],
        ].map(([cls, name, range]) => (
          <span key={cls} className="inline-flex items-center gap-2">
            <span aria-hidden="true" className={cn('inline-block h-3 w-5 rounded-[4px] shadow-[inset_0_0_0_1px_var(--line)]', cls)} />
            <span className="text-ink">{name}</span>
            <span className="font-mono text-[11.5px] max-sm:hidden">{range}</span>
          </span>
        ))}
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-3 w-0.5 rounded-[1px] bg-brand" />
          <span className="text-ink">{nowLabel}</span>
        </span>
      </div>

      {/* one now-line across every row */}
      <div aria-hidden="true" className={cn(gridCls, 'pointer-events-none absolute inset-0 hidden grid-rows-[100%] min-[821px]:grid')}>
        <div />
        <div />
        <div className="relative h-full">
          <div className="absolute inset-y-0 w-0" style={{ left: `${linePos}%` }}>
            <span className="tnum absolute left-0 top-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-2 py-0.5 font-mono text-[11px] font-medium leading-4 text-white">{hm}</span>
            <span className="absolute -left-px bottom-0 top-[30px] w-0.5 bg-brand" />
          </div>
        </div>
        <div />
      </div>
    </div>
  )
}

export default TimezoneTimeline
