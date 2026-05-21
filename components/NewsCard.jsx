'use client'

import { useState } from 'react'
import Link from 'next/link'

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
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return GRADIENT_PRESETS[Math.abs(hash) % GRADIENT_PRESETS.length]
}

function formatScore(score) {
  if (!score) return ''
  if (score >= 100000000) return `${(score / 100000000).toFixed(1)}亿`
  if (score >= 10000) return `${(score / 10000).toFixed(1)}万`
  if (score >= 1000) return `${(score / 1000).toFixed(1)}k`
  return score.toString()
}

const sourceAccents = {
  weibo: { bar: 'bg-red-500', text: 'text-red-400', bg: 'bg-red-500/10', ring: 'ring-red-500/20' },
  zhihu: { bar: 'bg-blue-500', text: 'text-blue-400', bg: 'bg-blue-500/10', ring: 'ring-blue-500/20' },
  baidu: { bar: 'bg-orange-500', text: 'text-orange-400', bg: 'bg-orange-500/10', ring: 'ring-orange-500/20' },
  toutiao: { bar: 'bg-rose-500', text: 'text-rose-400', bg: 'bg-rose-500/10', ring: 'ring-rose-500/20' },
  tencent: { bar: 'bg-sky-500', text: 'text-sky-400', bg: 'bg-sky-500/10', ring: 'ring-sky-500/20' },
  thepaper: { bar: 'bg-indigo-500', text: 'text-indigo-400', bg: 'bg-indigo-500/10', ring: 'ring-indigo-500/20' },
}

function CoverImage({ item, featured }) {
  const [failed, setFailed] = useState(false)
  const gradient = pickGradient(item.title || item.sourceId || '')
  const initials = (item.title || item.category || 'N').slice(0, 2).toUpperCase()

  if (!item.coverImage || failed) {
    return (
      <div className={`flex items-center justify-center ${featured ? 'absolute inset-0' : 'h-full w-full'}`}
        style={{ background: gradient }}>
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)'
          }} />
        <span className="relative text-3xl font-black text-white/15 select-none tracking-widest">{initials}</span>
      </div>
    )
  }

  return (
    <img
      src={item.coverImage}
      alt={item.title}
      className={`object-cover ${featured ? 'absolute inset-0 h-full w-full' : 'h-full w-full'}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

export default function NewsCard({ item, featured = false }) {
  const colors = sourceAccents[item.sourceId] || sourceAccents.weibo

  if (featured) {
    return (
      <Link
        href={`/news/${item.id}`}
        className="group relative flex h-72 md:h-80 overflow-hidden rounded-3xl bg-zinc-900 shadow-xl ring-1 ring-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-900/30 hover:-translate-y-1 hover:ring-white/10"
      >
        <CoverImage item={item} featured />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/60 via-transparent to-transparent" />
        <div className="relative z-10 mt-auto flex w-full flex-col p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/10 whitespace-nowrap">
              {item.sourceIcon} {item.source}
            </span>
            {item.category && (
              <span className="inline-flex rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white/80 whitespace-nowrap">
                {item.category}
              </span>
            )}
            {item.hotScore > 0 && (
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-rose-500/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-white whitespace-nowrap flex-shrink-0">
                {formatScore(item.hotScore)}
              </span>
            )}
          </div>
          <h3 className="text-xl md:text-2xl font-bold leading-snug text-white group-hover:text-rose-300 transition-colors line-clamp-2">
            {item.title}
          </h3>
          {item.summary && (
            <p className="mt-2 text-sm text-white/60 line-clamp-1 leading-relaxed">{item.summary}</p>
          )}
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/news/${item.id}`}
      className="group flex gap-4 rounded-2xl border border-zinc-200/60 bg-white p-4 transition-all duration-500 hover:border-zinc-300 hover:shadow-2xl hover:shadow-zinc-200/50 hover:-translate-y-1"
    >
      <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-zinc-200/50 group-hover:ring-zinc-300/50 transition-all">
        <CoverImage item={item} />
      </div>
      <div className="min-w-0 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-zinc-900 group-hover:text-rose-600 transition-colors line-clamp-2 leading-snug text-[15px]">
            {item.title}
          </h3>
          {item.summary && (
            <p className="mt-1.5 text-sm text-zinc-500 line-clamp-2 leading-relaxed">
              {item.summary}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 whitespace-nowrap">
            {item.sourceIcon} {item.source}
          </span>
          {item.category && (
            <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text} whitespace-nowrap`}>
              {item.category}
            </span>
          )}
          {item.hotScore > 0 && (
            <span className="ml-auto text-xs font-semibold text-rose-500 whitespace-nowrap flex-shrink-0">
              {formatScore(item.hotScore)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}