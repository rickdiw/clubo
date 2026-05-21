'use client'

import Link from 'next/link'
import h5Pages from '@/config/h5-pages'

const games = [
  {
    id: 'snake',
    title: '贪吃蛇',
    icon: '🐍',
    desc: '经典贪吃蛇游戏，用方向键控制蛇的移动，吃到食物变长，撞墙或撞到自己则游戏结束',
    gradient: 'from-emerald-400 via-teal-500 to-emerald-600',
    glow: 'shadow-emerald-500/20',
    glowColor: 'bg-emerald-400/30',
    accent: 'text-emerald-600',
    pattern: (
      <svg className="absolute inset-0 h-full w-full opacity-[0.08]" viewBox="0 0 200 200">
        {Array.from({ length: 10 }, (_, r) =>
          Array.from({ length: 10 }, (_, c) => (
            <rect key={`${r}-${c}`} x={c * 20 + 1} y={r * 20 + 1} width="18" height="18" rx="3" fill="currentColor" className="text-white" />
          ))
        )}
      </svg>
    ),
    decorShapes: (
      <>
        <circle cx="80" cy="40" r="8" className="fill-white/20" />
        <circle cx="150" cy="120" r="6" className="fill-white/15" />
        <circle cx="30" cy="130" r="10" className="fill-white/10" />
        <circle cx="170" cy="30" r="5" className="fill-white/20" />
      </>
    ),
  },
  {
    id: '2048',
    title: '2048',
    icon: '🧩',
    desc: '用方向键合并相同数字的方块，最终拼出 2048，挑战你的逻辑思维',
    gradient: 'from-amber-400 via-orange-500 to-yellow-500',
    glow: 'shadow-amber-500/20',
    glowColor: 'bg-amber-400/30',
    accent: 'text-amber-600',
    pattern: (
      <svg className="absolute inset-0 h-full w-full opacity-[0.08]" viewBox="0 0 200 200">
        {[0, 50, 100, 150].flatMap((x, i) =>
          [0, 50, 100, 150].map((y, j) => (
            <rect key={`${i}-${j}`} x={x + 4} y={y + 4} width="42" height="42" rx="8" fill="currentColor" className="text-white" />
          ))
        )}
      </svg>
    ),
    decorShapes: (
      <>
        <rect x="30" y="30" width="16" height="16" rx="4" className="fill-white/20" />
        <rect x="155" y="50" width="20" height="20" rx="5" className="fill-white/15" />
        <rect x="70" y="140" width="14" height="14" rx="3" className="fill-white/20" />
        <rect x="160" y="130" width="12" height="12" rx="3" className="fill-white/15" />
      </>
    ),
  },
  {
    id: 'minesweeper',
    title: '扫雷',
    icon: '💣',
    desc: '经典扫雷游戏，左键翻开格子，右键标记地雷，找出所有非雷格子即可获胜',
    gradient: 'from-sky-400 via-blue-500 to-indigo-500',
    glow: 'shadow-sky-500/20',
    glowColor: 'bg-sky-400/30',
    accent: 'text-sky-600',
    pattern: (
      <svg className="absolute inset-0 h-full w-full opacity-[0.08]" viewBox="0 0 200 200">
        {Array.from({ length: 8 }, (_, r) =>
          Array.from({ length: 8 }, (_, c) => (
            <rect key={`${r}-${c}`} x={c * 25 + 2} y={r * 25 + 2} width="21" height="21" rx="2" fill="currentColor" className="text-white" />
          ))
        )}
      </svg>
    ),
    decorShapes: (
      <>
        <text x="40" y="50" className="fill-white/20 text-xs" fontSize="14">🚩</text>
        <text x="140" y="80" className="fill-white/15 text-xs" fontSize="12">💣</text>
        <text x="60" y="145" className="fill-white/20 text-xs" fontSize="12">🚩</text>
        <text x="150" y="150" className="fill-white/15 text-xs" fontSize="10">1</text>
      </>
    ),
  },
]

const h5Games = h5Pages.filter(p => p.category === '游戏' || p.category === '休闲')

const h5CategoryStyle = {
  '游戏': { gradient: 'from-green-500 to-emerald-600', glow: 'shadow-green-500/20', badge: 'bg-green-100 text-green-700', badgeText: 'text-green-700', icon: '🎮' },
  '休闲': { gradient: 'from-yellow-500 to-amber-600', glow: 'shadow-yellow-500/20', badge: 'bg-yellow-100 text-yellow-700', badgeText: 'text-yellow-700', icon: '🎯' },
}

export default function GamesPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-500/15 to-orange-500/5 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-emerald-600/15 to-teal-500/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_60%)]" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 text-sm text-white/70 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            纯前端运行 · 即点即玩
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
            热门
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 bg-clip-text text-transparent"> 游戏</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-400">
            经典 H5 小游戏，全部在浏览器本地运行，无需下载安装，休闲娱乐好选择
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game, index) => (
            <div key={game.id} className="animate-in" style={{ animationDelay: `${index * 100}ms` }}>
              <Link
                href={`/games/${game.id}`}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-zinc-200/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-zinc-300/50 hover:ring-zinc-300"
              >
                {/* Cover Area */}
                <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${game.gradient}`}>
                  {/* Background Pattern */}
                  {game.pattern}

                  {/* Animated Glow Orb */}
                  <div className={`absolute -bottom-10 -right-10 h-32 w-32 rounded-full ${game.glowColor} blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-60`} />
                  <div className={`absolute -top-8 -left-8 h-24 w-24 rounded-full ${game.glowColor} blur-xl opacity-40 transition-all duration-700 group-hover:scale-125`} />

                  {/* Decorative Shapes */}
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 200">
                    {game.decorShapes}
                  </svg>

                  {/* Central Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Outer ring */}
                      <div className="absolute -inset-6 rounded-full bg-white/10 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-white/20" />
                      {/* Inner ring pulse */}
                      <div className="absolute -inset-3 rounded-full border-2 border-white/20 animate-ping [animation-duration:3s] transition-all group-hover:border-white/40" />
                      {/* Icon */}
                      <span className="relative text-6xl transition-all duration-500 group-hover:scale-125 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                        {game.icon}
                      </span>
                    </div>
                  </div>

                  {/* Top gradient overlay */}
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/10 to-transparent" />
                </div>

                {/* Card Body */}
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="text-lg font-bold tracking-tight text-zinc-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-500 transition-all duration-300">
                    {game.title}
                  </h3>

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">
                    {game.desc}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 border border-zinc-100 px-2.5 py-1 text-[10px] font-bold text-zinc-500">
                      本地运行
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-zinc-400 transition-all group-hover:text-emerald-600 group-hover:gap-2">
                      开始游戏
                      <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
      </div>

      {/* H5 热门游戏 */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 ring-1 ring-rose-500/20">
              <svg className="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">Online H5</span>
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">热门 H5 游戏</h2>
          <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed max-w-md">精选优质在线 H5 小游戏，点击即可跳转体验，无需下载</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {h5Games.map((game, index) => {
            const style = h5CategoryStyle[game.category] || h5CategoryStyle['休闲']
            return (
              <a
                key={game.id}
                href={game.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-zinc-200/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-zinc-300/50 hover:ring-zinc-300"
              >
                {/* Cover Thumbnail */}
                <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${style.gradient}`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
                  <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl transition-transform duration-500 group-hover:scale-125">{style.icon}</span>
                  </div>
                  {/* Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur-md bg-white/80 ${style.badgeText}`}>
                      {game.category}
                    </span>
                  </div>
                  {game.featured && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-rose-600">
                        ⭐ 推荐
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-base font-bold tracking-tight text-zinc-900 transition-colors duration-300 group-hover:text-rose-600">
                    {game.title}
                  </h3>

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500 line-clamp-2">
                    {game.description}
                  </p>

                  <div className="mt-4 flex items-center">
                    <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-zinc-400 transition-all group-hover:text-rose-600 group-hover:gap-2">
                      立即体验
                      <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </div>
              </a>
            )
          })}
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