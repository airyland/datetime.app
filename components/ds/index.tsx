import Link from "next/link"
import type { ReactNode } from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

/** Page width wrapper used by every section. */
export function Section({ children, className, top = "clamp(56px,8vw,96px)", id }: { children: ReactNode; className?: string; top?: string; id?: string }) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-[1200px] px-[clamp(16px,4vw,40px)]", className)} style={{ paddingTop: top }}>
      {children}
    </section>
  )
}

export const cardClass = "rounded-2xl border border-line bg-surface"
export const monoLabel = "font-mono text-[11.5px] uppercase tracking-[.08em] text-subtle"
export const h2Class = "m-0 text-[clamp(24px,2.6vw,32px)] font-semibold leading-[1.15] tracking-[-0.025em]"
export const inputClass =
  "h-11 w-full rounded-xl border border-line2 bg-surface px-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-subtle focus:border-ink"

export function Card({ children, className, as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" | "article" }) {
  return <Tag className={cn(cardClass, className)}>{children}</Tag>
}

export type Crumb = { label: ReactNode; href?: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex flex-wrap items-center gap-x-3 gap-y-1.5", monoLabel)}>
      {items.map((c, i) => (
        <span key={i} className="inline-flex items-center gap-3">
          {i > 0 && <span aria-hidden="true" className="opacity-45">/</span>}
          {c.href ? (
            <Link href={c.href} className="transition-colors hover:text-ink">{c.label}</Link>
          ) : (
            <span className="text-ink">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export function Eyebrow({ children, as: Tag = "div" }: { children: ReactNode; as?: "div" | "h2" | "p" }) {
  return (
    <Tag className="m-0 flex items-center gap-2.5 font-mono text-[13px] font-medium uppercase tracking-[.14em] text-brand">
      <span aria-hidden="true" className="block h-0.5 w-5 rounded-[1px] bg-brand" />
      {children}
    </Tag>
  )
}

/** Breadcrumb + eyebrow + h1 + intro paragraph, with an optional right-hand slot. */
export function PageIntro({
  crumbs,
  eyebrow,
  eyebrowAs,
  title,
  description,
  right,
  wide,
}: {
  crumbs?: Crumb[]
  eyebrow?: ReactNode
  eyebrowAs?: "div" | "h2" | "p"
  title: ReactNode
  description?: ReactNode
  right?: ReactNode
  /** let long titles use up to 1100px before wrapping */
  wide?: boolean
}) {
  return (
    <Section top="clamp(18px,3vw,32px)">
      {crumbs && (
        <div className="mb-[clamp(24px,3vw,36px)]">
          <Breadcrumbs items={crumbs} />
        </div>
      )}
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div className={cn("min-w-0", wide ? "max-w-[1100px]" : "max-w-[760px]")}>
          {eyebrow && <Eyebrow as={eyebrowAs}>{eyebrow}</Eyebrow>}
          <h1 className="m-0 mt-3.5 text-[clamp(32px,4.6vw,60px)] font-medium leading-[1.04] tracking-[-0.04em] [overflow-wrap:anywhere]">{title}</h1>
          {description && <p className="m-0 mt-4 max-w-[60ch] text-[clamp(15px,1.4vw,17px)] leading-relaxed text-subtle">{description}</p>}
        </div>
        {right}
      </div>
    </Section>
  )
}

export function SectionHeading({ title, description, right, as: Tag = "h2" }: { title: ReactNode; description?: ReactNode; right?: ReactNode; as?: "h2" | "h3" }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-3.5">
      <div className="min-w-0">
        <Tag className={h2Class}>{title}</Tag>
        {description && <p className="m-0 mt-2 text-[15px] text-subtle">{description}</p>}
      </div>
      {right}
    </div>
  )
}

export function Stat({ label, value, sub, big }: { label: ReactNode; value: ReactNode; sub?: ReactNode; big?: boolean }) {
  return (
    <div className="min-w-0 bg-surface px-[22px] py-5">
      <div className={monoLabel}>{label}</div>
      <div className={cn("tnum mt-2 font-mono font-light leading-none tracking-[-0.04em]", big ? "text-[34px]" : "text-[28px]")}>{value}</div>
      {sub && <div className="mt-2 text-[12.5px] text-subtle">{sub}</div>}
    </div>
  )
}

/** Hairline-divided grid of Stat cells. */
export function StatGrid({ children, min = 200 }: { children: ReactNode; min?: number }) {
  return (
    <div
      className="grid overflow-hidden rounded-2xl border border-line bg-surface [&>*]:shadow-[1px_0_0_0_var(--line),0_1px_0_0_var(--line)]"
      style={{ gridTemplateColumns: `repeat(auto-fit,minmax(min(100%,${min}px),1fr))` }}
    >
      {children}
    </div>
  )
}

/** Divided list of rows inside a card. */
export function CardList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("cl overflow-hidden", cardClass, className)}>{children}</div>
}

export function RowLink({ href, title, label, description, meta }: { href: string; title?: string; label: ReactNode; description?: ReactNode; meta?: ReactNode }) {
  return (
    <Link href={href} title={title} className="group flex items-center justify-between gap-4 border-t border-line px-[22px] py-4 transition-colors hover:bg-paper">
      <div className="min-w-0">
        <div className="text-base font-medium tracking-[-0.01em]">{label}</div>
        {description && <div className="mt-0.5 text-sm text-subtle">{description}</div>}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {meta}
        <span aria-hidden="true" className="text-subtle transition-all group-hover:-translate-y-[3px] group-hover:translate-x-[3px] group-hover:text-brand">↗</span>
      </div>
    </Link>
  )
}

export function Pill({ href, children, active, title }: { href?: string; children: ReactNode; active?: boolean; title?: string }) {
  const cls = cn(
    "inline-flex h-[38px] items-center gap-2 rounded-full border px-4 font-mono text-[13px] transition-colors",
    active ? "border-ink bg-ink text-paper" : "border-line bg-surface text-ink hover:border-ink",
  )
  return href ? (
    <Link href={href} title={title} className={cls}>{children}</Link>
  ) : (
    <span className={cls}>{children}</span>
  )
}

export function Faq({ title, items }: { title: ReactNode; items: { q: string; a: ReactNode }[] }) {
  return (
    <Section>
      <div className="flex flex-wrap gap-x-16 gap-y-7">
        <div className="min-w-0 flex-[1_1_220px]">
          <h2 className={cn(h2Class, "max-w-[12ch]")}>{title}</h2>
        </div>
        <div className={cn("cl min-w-0 flex-[3_1_560px] overflow-hidden rounded-[18px] border border-line bg-surface")}>
          {items.map((f, i) => (
            <details key={i} className="group border-t border-line" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-lg font-medium tracking-[-0.015em] marker:hidden [&::-webkit-details-marker]:hidden">
                <h3 className="m-0 text-[length:inherit] font-[inherit] tracking-[inherit]">{f.q}</h3>
                <span aria-hidden="true" className="inline-flex size-7 flex-none items-center justify-center rounded-full border border-line2 text-subtle">
                  <Plus className="size-3 group-open:hidden" strokeWidth={2.25} />
                  <Minus className="hidden size-3 group-open:block" strokeWidth={2.25} />
                </span>
              </summary>
              <div className="px-6 pb-6 text-[15.5px] leading-[1.75] text-subtle">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}

export function ArrowLink({ href, children, title, className }: { href: string; children: ReactNode; title?: string; className?: string }) {
  return (
    <Link href={href} title={title} className={cn("inline-flex items-center gap-2 text-sm text-subtle transition-colors hover:text-ink", className)}>
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  )
}
