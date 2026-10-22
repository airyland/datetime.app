'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { inputClass } from '@/components/ds'
import BlogCard, { type BlogPostMeta } from './BlogCard'

const PER_PAGE = 9
const btn = 'h-9 rounded-full border px-4 text-sm font-medium transition-colors disabled:opacity-40'

export default function BlogList({ posts, locale }: { posts: BlogPostMeta[]; locale: string }) {
  const [q, setQ] = useState('')
  const [tag, setTag] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const counts = new Map<string, number>()
  for (const p of posts) for (const x of p.tags) counts.set(x, (counts.get(x) ?? 0) + 1)
  const tags = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([x]) => x)
  const term = q.trim().toLowerCase()
  const filtered = posts.filter(
    (p) => (!term || p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)) && (!tag || p.tags.includes(tag)),
  )
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2">
          {[null, ...tags].map((t) => (
            <button
              key={t ?? 'all'}
              type="button"
              aria-pressed={tag === t}
              onClick={() => { setTag(t); setPage(1) }}
              className={cn(btn, tag === t ? 'border-ink bg-ink text-paper' : 'border-line bg-surface text-subtle hover:text-ink')}
            >
              {t ?? 'All'}
            </button>
          ))}
        </div>
        <input
          type="search"
          aria-label="Search articles"
          placeholder="Search articles"
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1) }}
          className={cn(inputClass, 'w-full sm:w-[280px]')}
        />
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,300px),1fr))' }}>
        {shown.map((p) => <BlogCard key={p.slug} post={p} locale={locale} />)}
      </div>

      {filtered.length === 0 && <p className="py-12 text-center text-sm text-subtle">No articles match your search.</p>}

      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button type="button" className={cn(btn, 'border-line bg-surface')} disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span className="font-mono text-[13px] text-subtle">{page} / {pages}</span>
          <button type="button" className={cn(btn, 'border-line bg-surface')} disabled={page === pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  )
}
