'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Clock, User, Share2, Copy, Check, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'
import { useTranslations } from 'next-intl'

interface BlogPostData {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  readTime: string
  content: string
}

interface BlogPostProps {
  post: BlogPostData
  relatedPosts: BlogPostData[]
  locale: string
}

export default function BlogPost({ post, relatedPosts, locale }: BlogPostProps) {
  const t = useTranslations('blog')
  const [copied, setCopied] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleShare = async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: url,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback - copy to clipboard
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {post.author}
          </span>
          <span className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            {format(new Date(post.date), 'MMMM d, yyyy')}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readTime}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Share button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              Share
            </>
          )}
        </Button>
      </header>

      {/* Article Content */}
      <div
        className="prose prose-neutral dark:prose-invert max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">{t('relatedPosts')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedPosts.map(relatedPost => (
              <Link key={relatedPost.slug} href={`/${locale}/blog/${relatedPost.slug}`}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
                  <h3 className="font-semibold mb-2 line-clamp-2">{relatedPost.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.description}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <CalendarIcon className="h-3 w-3" />
                    {format(new Date(relatedPost.date), 'MMM d, yyyy')}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-8 right-8 z-50 rounded-full shadow-lg"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      )}
    </>
  )
}