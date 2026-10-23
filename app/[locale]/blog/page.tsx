import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import BlogList from '@/components/blog/BlogList'
import { PageIntro, Section } from '@/components/ds'
import { promises as fs } from 'fs'
import path from 'path'
import { getLocalePath } from '@/lib/locale-utils'
import { OG_IMAGES, TWITTER_IMAGES } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
    images: OG_IMAGES,
      title: t('title'),
      description: t('description'),
      type: 'website',
      url: `https://datetime.app${getLocalePath("/blog", locale)}`,
    },
    twitter: {
    images: TWITTER_IMAGES,
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: `https://datetime.app${getLocalePath("/blog", locale)}`,
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

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  const posts = await getBlogPosts()

  return (
    <>
      <PageIntro
        crumbs={[{ label: 'Home', href: getLocalePath('/', locale) }, { label: 'Blog' }]}
        eyebrow="Blog"
        title={t('title')}
        description={t('description')}
      />
      <Section top="clamp(28px,4vw,48px)">
        <BlogList posts={posts} locale={locale} />
      </Section>
      <div className="pb-[clamp(56px,8vw,96px)]" />
    </>
  )
}
