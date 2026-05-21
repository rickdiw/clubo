import Link from 'next/link'
import { getLatestNews } from '@/lib/news'
import NewsCard from '@/components/NewsCard'
import ToolCard from '@/components/ToolCard'
import H5Card from '@/components/H5Card'
import AdPlacement from '@/components/AdPlacement'
import tools from '@/config/tools'
import h5Pages from '@/config/h5-pages'

function AnimatedHero() {
  return (
    <section className="relative overflow-hidden bg-zinc-950">
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-rose-500/20 to-orange-500/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-violet-600/20 to-blue-500/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, white 2px, white 4px)'
        }} />

      <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 text-sm text-white/70 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          实时更新 · 多平台聚合
        </div>

        <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
          发现<span className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">精彩</span>
          <br />
          <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-white/60 tracking-wider">每一天</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
          聚合微博、知乎、百度、今日头条、腾讯新闻等平台最新热点，
          一站尽览 AI 工具箱与创意 H5 体验
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/news"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg shadow-white/10 transition-all hover:scale-105 hover:shadow-xl hover:shadow-white/20"
          >
            <span className="relative z-10">浏览热门资讯</span>
            <svg className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/30 hover:scale-105"
          >
            AI 工具箱
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { icon: '🔥', label: '微博热搜', desc: '实时话题榜' },
            { icon: '📰', label: '今日头条', desc: '全民资讯' },
            { icon: '💡', label: '知乎热榜', desc: '深度讨论' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm p-4 text-center transition-all hover:bg-white/10 hover:border-white/10">
              <div className="text-2xl">{item.icon}</div>
              <p className="mt-2 text-sm font-semibold text-white/80">{item.label}</p>
              <p className="text-xs text-white/40">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const latestNews = getLatestNews(20)
  const featuredNews = latestNews.slice(0, 3)
  const listNews = latestNews.slice(3, 9)
  const featuredTools = tools.slice(0, 4)
  const recommendedH5 = h5Pages.filter((p) => p.featured).slice(0, 4)

  return (
    <div>
      <AnimatedHero />

      {/* Module 1: Hot News */}
      <section className="mx-auto max-w-6xl px-4 pt-20 pb-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 ring-1 ring-rose-500/20">
                <svg className="h-4 w-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" fillRule="evenodd" /></svg>
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">Hot Topics</span>
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">今日热点</h2>
            <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed max-w-md">实时追踪微博、知乎、百度、今日头条、腾讯新闻等各大平台最新热门话题</p>
          </div>
          <Link
            href="/news"
            className="group hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 transition-colors hover:text-rose-600"
          >
            查看全部
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3 mb-6">
          {featuredNews.map((item) => (
            <NewsCard key={item.id} item={item} featured />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {listNews.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>

        <AdPlacement module="news" />
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
      </div>

      {/* Module 2: AI Tools */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-500/20">
                  <svg className="h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">AI Tools</span>
              </div>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">在线工具箱</h2>
              <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed max-w-md">无需安装，打开即用的图片处理、格式转换等实用工具</p>
            </div>
            <Link
              href="/tools"
              className="group hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 transition-colors hover:text-rose-600"
            >
              查看全部
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
          <AdPlacement module="tools" />
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
      </div>

      {/* Module 3: Hot Games */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
                  <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">Hot Games</span>
              </div>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">热门游戏-入口</h2>
              <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed max-w-md">经典 H5 小游戏和创意在线互动体验，即点即玩</p>
            </div>
            <Link
              href="/games"
              className="group hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 transition-colors hover:text-amber-600"
            >
              查看全部
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedH5.map((page) => (
              <H5Card key={page.id} page={page} compact />
            ))}
          </div>
          <AdPlacement module="h5" />
        </div>
      </section>
    </div>
  )
}