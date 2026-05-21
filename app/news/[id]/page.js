import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getNewsById, getAllNewsIds, getNewsBySource } from '@/lib/news'
import NewsCard from '@/components/NewsCard'
import AdPlacement from '@/components/AdPlacement'
import ShareButton from '@/components/ShareButton'

export function generateStaticParams() {
  return getAllNewsIds()
}

const GRADIENT_PRESETS = [
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #1a1a1a 0%, #2d1b69 50%, #1b0a3e 100%)',
  'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  'linear-gradient(135deg, #0d0d0d 0%, #1a0a2e 50%, #16213e 100%)',
  'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
  'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
  'linear-gradient(135deg, #0c0c1d 0%, #1a1040 50%, #0d0d2b 100%)',
  'linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)',
]

function pickGradient(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return GRADIENT_PRESETS[Math.abs(hash) % GRADIENT_PRESETS.length]
}

function formatScore(score) {
  if (!score) return '0'
  if (score >= 100000000) return `${(score / 100000000).toFixed(1)}亿`
  if (score >= 10000) return `${(score / 10000).toFixed(1)}万`
  if (score >= 1000) return `${(score / 1000).toFixed(1)}k`
  return score.toString()
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })
  } catch { return dateStr }
}

const sourceAccents = {
  weibo: { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  zhihu: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  baidu: { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  toutiao: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  tencent: { text: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
  thepaper: { text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
}

function ArticleBody({ news }) {
  const paragraphs = []

  if (news.summary) {
    paragraphs.push({
      type: 'lead',
      content: `${news.summary}。该资讯来源于${news.source}平台，在今日引发广泛关注和热烈讨论。`,
    })
  } else {
    paragraphs.push({
      type: 'lead',
      content: `该资讯来源于${news.source}平台，目前正在引发广泛关注。`,
    })
  }

  paragraphs.push({
    type: 'heading',
    content: '事件概述',
  })
  paragraphs.push({
    type: 'text',
    content: `根据${news.source}平台的数据显示，「${news.title}」这一话题在短时间内获得了${formatScore(news.hotScore)}的讨论热度，吸引了大量用户的积极参与和互动。话题内容涵盖了${news.category || '多个'}领域，引发了社会各界的广泛关注和深入探讨。`,
  })

  paragraphs.push({
    type: 'heading',
    content: '平台热度分析',
  })
  const hotLevel = (news.hotScore || 0) > 5000000 ? '极高' : (news.hotScore || 0) > 1000000 ? '很高' : (news.hotScore || 0) > 100000 ? '较高' : '一般'
  paragraphs.push({
    type: 'text',
    content: `截止目前，该话题在${news.source}平台的热度评级为「${hotLevel}」，热度值达到${formatScore(news.hotScore)}。${hotLevel === '极高' ? '这一数据表明该话题已成为今日最受关注的焦点事件之一。' : hotLevel === '很高' ? '这一数据反映出用户对该话题的持续关注和积极参与。' : '话题保持一定的讨论热度，反映了用户对该领域话题的关注。'}`,
  })

  paragraphs.push({
    type: 'heading',
    content: '信息来源',
  })
  paragraphs.push({
    type: 'text',
    content: `本资讯由${news.source}平台实时数据聚合而成，数据采集时间为${formatDate(news.fetchedAt)}。资讯分类归属为「${news.category || '综合'}」类别，相关数据和讨论持续更新中。`,
  })

  paragraphs.push({
    type: 'text',
    content: `如需了解更多详情和最新进展，可以点击下方「查看原始来源」按钮跳转至${news.source}平台查看完整内容和网友评论。同时，您也可以通过分享按钮将这条资讯分享给身边的朋友。`,
  })

  if (news.source === '今日头条') {
    paragraphs.push({
      type: 'tip',
      content: '头条资讯的热度值反映了该话题在平台上的实时关注度，数值越高表示越多人正在关注和讨论此话题。',
    })
  }

  return (
    <div className="space-y-8">
      {paragraphs.map((p, i) => {
        if (p.type === 'lead') {
          return (
            <div key={i} className="rounded-2xl border-l-4 border-rose-400 bg-rose-50/50 p-6">
              <p className="text-lg leading-relaxed text-zinc-700 font-medium">{p.content}</p>
            </div>
          )
        }
        if (p.type === 'heading') {
          return (
            <h2 key={i} className="flex items-center gap-3 text-xl font-bold text-zinc-900">
              <span className="h-8 w-1 rounded-full bg-gradient-to-b from-rose-400 to-orange-400" />
              {p.content}
            </h2>
          )
        }
        if (p.type === 'tip') {
          return (
            <div key={i} className="rounded-2xl bg-amber-50/60 border border-amber-200 p-5 flex items-start gap-3">
              <span className="text-amber-500 text-lg flex-shrink-0 mt-0.5">💡</span>
              <p className="text-sm leading-relaxed text-amber-800">{p.content}</p>
            </div>
          )
        }
        return (
          <p key={i} className="text-base leading-8 text-zinc-600">{p.content}</p>
        )
      })}
    </div>
  )
}

export default async function NewsDetailPage({ params }) {
  const { id } = await params
  const news = getNewsById(id)
  if (!news) notFound()

  const relatedNews = getNewsBySource(news.sourceId, 10)
    .filter((item) => item.id !== id)
    .slice(0, 6)

  const colors = sourceAccents[news.sourceId] || sourceAccents.weibo
  const gradient = pickGradient(news.title)

  return (
    <div>
      {/* Back nav */}
      <div className="bg-white border-b border-zinc-100 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link href="/news" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            返回资讯列表
          </Link>
          <span className="text-xs text-zinc-400">{news.sourceIcon} {news.source}</span>
        </div>
      </div>

      {/* Cover Image Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden bg-zinc-900">
        {news.coverImage && news.coverImage.startsWith('http') ? (
          <>
            <img
              src={news.coverImage}
              alt={news.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-zinc-900/60" />
          </>
        ) : (
          <>
            <div className="absolute inset-0" style={{ background: gradient }} />
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255,255,255,0.03) 15px, rgba(255,255,255,0.03) 30px)'
              }} />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1.5 text-sm font-semibold text-white/90 ring-1 ring-white/10 whitespace-nowrap">
                {news.sourceIcon} {news.source}
              </span>
              {news.category && (
                <span className="inline-flex rounded-full bg-white/10 backdrop-blur-md px-3 py-1.5 text-sm font-semibold text-white/80 whitespace-nowrap">
                  {news.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-5xl px-4 -mt-16 relative z-10">
        <div className="rounded-3xl bg-white p-8 md:p-12 shadow-2xl shadow-zinc-200/50 ring-1 ring-zinc-100">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight tracking-tight text-zinc-900">
            {news.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-2 text-white font-semibold shadow-lg shadow-rose-500/20 whitespace-nowrap flex-shrink-0">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
              {formatScore(news.hotScore)} 热度
            </div>
            <span className="text-zinc-400 whitespace-nowrap">{formatDate(news.fetchedAt)}</span>
            <span className="text-zinc-300">·</span>
            <span className={`font-semibold ${colors.text} whitespace-nowrap`}>{news.sourceIcon} {news.source}</span>
            {news.category && (
              <>
                <span className="text-zinc-300">·</span>
                <span className="text-zinc-500 whitespace-nowrap">{news.category}</span>
              </>
            )}
          </div>

          {/* Article body */}
          <div className="mt-10">
            <ArticleBody news={news} />
          </div>

          {/* Actions */}
          <div className="mt-12 flex items-center gap-3 border-t border-zinc-100 pt-8">
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all hover:bg-zinc-800 hover:scale-105 hover:shadow-xl"
            >
              查看原始来源
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <ShareButton />
          </div>

          {/* Meta grid */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 rounded-2xl bg-zinc-50 p-6">
            {[
              { label: '来源平台', value: `${news.sourceIcon} ${news.source}` },
              { label: '内容分类', value: news.category || '综合' },
              { label: '热议指数', value: formatScore(news.hotScore) },
              { label: '收录时间', value: formatDate(news.fetchedAt) },
            ].map((item) => (
              <div key={item.label}>
                <span className="text-xs text-zinc-400">{item.label}</span>
                <p className="mt-1 text-sm font-bold text-zinc-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-16">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">相关推荐</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
              来自 {news.source} 的更多资讯
            </h2>
            <p className="mt-1 text-sm text-zinc-500">同一来源平台的其他热门话题</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatedNews.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
          <AdPlacement module="news" />
        </section>
      )}
    </div>
  )
}