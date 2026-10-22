'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { PageIntro, Section, SectionHeading, monoLabel } from '@/components/ds'
import { getLocalePath } from '@/lib/locale-utils'
import BlogCard, { formatDate, type BlogPostMeta } from './BlogCard'
import '../../app/[locale]/blog/blog.css'

interface BlogPostData extends BlogPostMeta {
  content: string
}

export default function BlogPost({ post, relatedPosts, locale }: { post: BlogPostData; relatedPosts: BlogPostData[]; locale: string }) {
  const t = useTranslations('blog')
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: post.title, text: post.description, url })
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      /* share cancelled */
    }
  }

  return (
    <article>
      <PageIntro
        wide
        crumbs={[{ label: 'Home', href: getLocalePath('/', locale) }, { label: 'Blog', href: getLocalePath('/blog', locale) }, { label: post.tags[0] ?? 'Article' }]}
        eyebrow={`${formatDate(post.date, true)} · ${post.readTime}`}
        title={post.title}
        description={post.description}
      />
      <Section top="clamp(24px,3vw,40px)">
        <div className="mx-auto max-w-[720px]">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-y border-line py-3.5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className={monoLabel}>By {post.author}</span>
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-line2 px-2.5 py-[3px] font-mono text-[10.5px] uppercase tracking-[.08em] text-subtle">{tag}</span>
              ))}
            </div>
            <button type="button" onClick={share} className="h-9 rounded-full border border-line2 px-4 text-sm font-medium text-ink transition-colors hover:border-ink">
              {copied ? 'Link copied' : 'Share'}
            </button>
          </div>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="mt-12 border-t border-line pt-6">
            <Link href={getLocalePath('/blog', locale)} className="text-sm font-medium text-ink underline underline-offset-[3px]">
              ← All articles
            </Link>
          </div>
        </div>
      </Section>
      {relatedPosts.length > 0 && (
        <Section top="clamp(48px,6vw,72px)">
          <div className="mb-6">
            <SectionHeading title={t('relatedPosts')} />
          </div>
          <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,300px),1fr))' }}>
            {relatedPosts.map((p) => (
              <BlogCard key={p.slug} post={p} locale={locale} />
            ))}
          </div>
        </Section>
      )}
      <div className="pb-[clamp(56px,8vw,96px)]" />
    </article>
  )
}
