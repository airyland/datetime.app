import Link from 'next/link'
import { getLocalePath } from '@/lib/locale-utils'
import { monoLabel } from '@/components/ds'

export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  readTime: string
  image?: string
}

export const formatDate = (iso: string, long = false) =>
  new Date(iso).toLocaleDateString('en-US', { month: long ? 'long' : 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

export default function BlogCard({ post, locale }: { post: BlogPostMeta; locale: string }) {
  return (
    <Link
      href={getLocalePath(`/blog/${post.slug}`, locale)}
      className="flex min-h-[220px] flex-col justify-between gap-6 rounded-[18px] border border-line bg-surface p-[22px] text-ink transition-colors hover:border-ink"
    >
      <div>
        <div className={monoLabel}>{post.tags[0] ?? 'Article'}</div>
        <h2 className="m-0 mt-3 line-clamp-3 text-xl font-semibold leading-[1.25] tracking-[-0.02em]">{post.title}</h2>
        <p className="m-0 mt-2.5 line-clamp-3 text-[14.5px] leading-[1.6] text-subtle">{post.description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12px] text-subtle">
        <span>{formatDate(post.date)}</span>
        <span aria-hidden="true">·</span>
        <span>{post.readTime}</span>
      </div>
    </Link>
  )
}
