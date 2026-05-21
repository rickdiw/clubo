'use client'

import tools from '@/config/tools'
import ToolCard from '@/components/ToolCard'
import AdPlacement from '@/components/AdPlacement'

const categories = [
  {
    key: 'image',
    label: '图片处理',
    desc: '压缩、加水印、格式转换、裁剪等实用图片编辑功能',
    icon: '🖼️',
    gradient: 'from-sky-500 to-cyan-500',
    glow: 'from-sky-500/20 to-cyan-500/10',
    accent: 'text-sky-500',
    bg: 'ring-sky-500/20',
    badge: 'bg-sky-500/10 text-sky-600',
  },
  {
    key: 'design',
    label: '设计工具',
    desc: '取色器、SVG转换等设计师常用工具',
    icon: '🎨',
    gradient: 'from-violet-500 to-purple-500',
    glow: 'from-violet-500/20 to-purple-500/10',
    accent: 'text-violet-500',
    bg: 'ring-violet-500/20',
    badge: 'bg-violet-500/10 text-violet-600',
  },
]

const sectionColors = {
  image: {
    bar: 'bg-sky-500',
    text: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    glow: 'shadow-sky-500/20',
    dot: 'bg-sky-500',
  },
  design: {
    bar: 'bg-violet-500',
    text: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    glow: 'shadow-violet-500/20',
    dot: 'bg-violet-500',
  },
}

export default function ToolsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-sky-500/15 to-cyan-500/5 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-violet-600/15 to-purple-500/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[250px] w-[250px] rounded-full bg-gradient-to-r from-sky-400/5 to-violet-400/5 blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, white 2px, white 4px)' }}
        />

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 text-sm text-white/70 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
            </span>
            浏览器端运行 · 无需上传服务器
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
            AI 在线
            <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent"> 工具箱</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-400">
            所有工具均在你浏览器中本地运行，图片不会上传到任何服务器，
            开箱即用，安全快捷
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white/70">
              🖼️ 图片处理
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white/70">
              🎨 设计工具
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white/70">
              ⚡ 本地运行
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        {categories.map((cat) => {
          const catTools = tools.filter((t) => t.category === cat.key)
          const colors = sectionColors[cat.key]

          return (
            <div key={cat.key} className="mb-16 last:mb-0">
              {/* Section Header */}
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${colors.bg} ring-1 ${colors.border}`}>
                      <svg className={`h-4 w-4 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-[0.2em] ${colors.text}`}>{cat.label}</span>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${colors.bg} ${colors.text}`}>{catTools.length}</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500 max-w-md">{cat.desc}</p>
                </div>
              </div>

              {/* Tool Grid */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {catTools.map((tool, index) => (
                  <div key={tool.id} className="animate-in" style={{ animationDelay: `${index * 80}ms` }}>
                    <ToolCard tool={tool} />
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        <AdPlacement module="tools" />
      </section>

      {/* Bottom CTA */}
      <section className="pb-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 p-10 md:p-14 text-center shadow-2xl shadow-zinc-900/20">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/20 to-violet-400/20 ring-1 ring-white/10">
              <span className="text-2xl">⚡</span>
            </div>
            <h2 className="text-2xl font-bold text-white">所有工具完全免费</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 max-w-md mx-auto">
              在你浏览器本地运行，不消耗服务器资源，无限次使用，随时可用
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm mx-auto">
              {[
                { icon: '🔒', label: '隐私安全' },
                { icon: '🚀', label: '即时响应' },
                { icon: '♾️', label: '无限使用' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-white/5 bg-white/5 p-3 text-center backdrop-blur-sm">
                  <div className="text-xl">{item.icon}</div>
                  <p className="mt-1 text-[11px] font-medium text-white/60">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}