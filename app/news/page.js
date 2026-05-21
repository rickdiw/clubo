import { getLatestNews } from '@/lib/news'
import NewsPageClient from '@/components/NewsPageClient'

export default function NewsPage() {
  const allNews = getLatestNews(60)

  return <NewsPageClient allNews={allNews} />
}