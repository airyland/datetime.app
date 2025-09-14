import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import BlogPost from '@/components/blog/BlogPost'
import { promises as fs } from 'fs'
import path from 'path'

interface BlogPostData {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  keywords: string
  image: string
  readTime: string
  content: string
  published: boolean
}

async function getPost(slug: string): Promise<BlogPostData | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'blog', 'posts.json')
    const fileContent = await fs.readFile(filePath, 'utf8')
    const posts = JSON.parse(fileContent)
    const post = posts.find((p: BlogPostData) => p.slug === slug && p.published)
    return post || null
  } catch (error) {
    console.error('Error loading blog post:', error)
    return null
  }
}

async function getAllPosts(): Promise<BlogPostData[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'blog', 'posts.json')
    const fileContent = await fs.readFile(filePath, 'utf8')
    const posts = JSON.parse(fileContent)
    return posts.filter((p: BlogPostData) => p.published)
  } catch (error) {
    console.error('Error loading blog posts:', error)
    return []
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(post => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [post.image],
      url: `https://datetime.app/${params.locale}/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image],
    },
    alternates: {
      canonical: `/${params.locale}/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string; locale: string } }) {
  const post = await getPost(params.slug)
  const t = await getTranslations({ locale: params.locale, namespace: 'blog' })

  if (!post) {
    notFound()
  }

  // Get related posts (same tags or recent posts)
  const allPosts = await getAllPosts()
  const relatedPosts = allPosts
    .filter(p => p.slug !== post.slug)
    .filter(p => p.tags.some(tag => post.tags.includes(tag)))
    .slice(0, 3)

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <BlogPost post={post} relatedPosts={relatedPosts} locale={params.locale} />
    </article>
  )
}