'use client'

import { useState } from 'react'
import NewsCard from '@/components/NewsCard'
import AdPlacement from '@/components/AdPlacement'

const ALL_CATEGORIES = ['全部', '社会', '娱乐', '体育', '财经', '科技', '教育', '生活', '国际', '健康']

const sourceColors = {
  weibo: 'from-red-500/80 to-rose-500/80',
  zhihu: 'from-blue-500/80 to-indigo-500/80',
  baidu: 'from-orange-500/80 to-amber-500/80',
  toutiao: 'from-rose-500/80 to-pink-500/80',
  tencent: 'from-sky-500/80 to-cyan-500/80',
  thepaper: 'from-indigo-500/80 to-violet-500/80',
}

export default function NewsPageClient({ allNews }) {
  const [activeCategory, setActiveCategory] = useState('全部')

  const filteredNews = activeCategory === '全部'
    ? allNews
    : allNews.filter((item) => item.category === activeCategory)

  const featuredNews = filteredNews.slice(0, 3)
  const listNews = filteredNews.slice(3)

  const sourceList = [...new Set(allNews.map((n) => n.sourceId))].slice(0, 6)

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-rose-500/15 to-orange-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-violet-600/15 to-blue-500/10 blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04)_0%,transparent_60%)]" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose-400">Hot News</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-white md:text-5xl">热门资讯</h1>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-zinc-400">
            实时追踪微博、知乎、百度、今日头条、腾讯新闻、网易新闻等平台热点，每日凌晨自动更新
          </p>

          {/* Source badges */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {sourceList.map((id) => {
              const item = allNews.find((n) => n.sourceId === id)
              if (!item) return null
              return (
                <span key={id} className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${sourceColors[id] || 'from-zinc-500/80 to-zinc-600/80'} px-3 py-1.5 text-sm font-medium text-white shadow-lg whitespace-nowrap`}>
                  {item.sourceIcon} {item.source}
                </span>
              )
            })}
          </div>

          {/* Category filter pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat
              const count = cat === '全部' ? allNews.length : allNews.filter((n) => n.category === cat).length
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-white text-zinc-900 shadow-lg shadow-white/20 scale-105'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/90 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {cat}
                  <span className={`ml-0.5 text-xs ${isActive ? 'text-zinc-400' : 'text-white/30'}`}>({count})</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        {filteredNews.length === 0 ? (
          <div className="py-32 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-100 mb-6">
              <svg className="h-10 w-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            </div>
            <p className="text-xl font-semibold text-zinc-400">该分类暂无资讯</p>
            <p className="mt-2 text-sm text-zinc-400">试试选择其他分类，或等待每日更新</p>
          </div>
        ) : (
          <>
            {/* Featured Grid */}
            <div className="grid gap-5 md:grid-cols-3 mb-12">
              {featuredNews.map((item) => (
                <NewsCard key={item.id} item={item} featured />
              ))}
            </div>

            {/* Subtitle */}
            {listNews.length > 0 && (
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-200" />
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  {activeCategory === '全部' ? '全部资讯' : `${activeCategory} · ${filteredNews.length} 条`}
                </span>
                <div className="h-px flex-1 bg-zinc-200" />
              </div>
            )}

            {/* List Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {listNews.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <NewsCard item={item} />
                </div>
              ))}
            </div>
          </>
        )}

        <AdPlacement module="news" />
      </section>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}