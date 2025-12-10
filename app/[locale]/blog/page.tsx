import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import BlogList from '@/components/blog/BlogList'
import Header from '@/components/header'
import { promises as fs } from 'fs'
import path from 'path'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'blog' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      url: `https://datetime.app/${locale}/blog`,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: `https://datetime.app/${locale}/blog`,
    },
  }
}

async function getBlogPosts() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'blog', 'posts.json')
    const fileContent = await fs.readFile(filePath, 'utf8')
    const posts = JSON.parse(fileContent)
    const now = new Date()
    // Only show posts that are published AND have a date less than or equal to today
    return posts.filter((post: any) => post.published && new Date(post.date) <= now)
  } catch (error) {
    console.error('Error loading blog posts:', error)
    return []
  }
}

export default async function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'blog' })
  const posts = await getBlogPosts()

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg text-muted-foreground">{t('description')}</p>
        </div>

        <BlogList posts={posts} locale={locale} />
      </div>
    </>
  )
}