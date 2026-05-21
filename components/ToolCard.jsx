import Link from 'next/link'

const categoryConfig = {
  image: {
    gradient: 'from-sky-500 to-cyan-500',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    ring: 'ring-sky-500/10',
    badge: 'bg-sky-100 text-sky-700',
    glow: 'shadow-sky-500/20',
    iconBg: 'bg-gradient-to-br from-sky-400 to-cyan-500',
  },
  design: {
    gradient: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    ring: 'ring-violet-500/10',
    badge: 'bg-violet-100 text-violet-700',
    glow: 'shadow-violet-500/20',
    iconBg: 'bg-gradient-to-br from-violet-400 to-purple-500',
  },
  text: {
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-500/10',
    badge: 'bg-emerald-100 text-emerald-700',
    glow: 'shadow-emerald-500/20',
    iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
  },
  audio: {
    gradient: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    ring: 'ring-orange-500/10',
    badge: 'bg-orange-100 text-orange-700',
    glow: 'shadow-orange-500/20',
    iconBg: 'bg-gradient-to-br from-orange-400 to-amber-500',
  },
}

const categoryLabels = { image: '图片处理', design: '设计工具', text: '文本工具', audio: '音频工具' }

export default function ToolCard({ tool, compact = false }) {
  const cfg = categoryConfig[tool.category] || categoryConfig.image

  return (
    <Link
      href={`/tools/${tool.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-lg ring-1 ring-zinc-200/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-zinc-300/50 hover:ring-zinc-300"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-zinc-50 to-zinc-100 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-150" />

      <div className={`relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${cfg.iconBg} shadow-lg ${cfg.glow} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
        <span className="text-2xl">{tool.icon}</span>
      </div>

      <h3 className={`text-lg font-bold tracking-tight text-zinc-900 transition-colors duration-300 group-hover:bg-gradient-to-r group-hover:${cfg.gradient} group-hover:bg-clip-text group-hover:text-transparent`}>
        {tool.name}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">
        {tool.description}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.badge} whitespace-nowrap`}>
          {categoryLabels[tool.category] || tool.category}
        </span>
        <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-zinc-400 transition-all group-hover:text-zinc-700 group-hover:gap-2">
          立即使用
          <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
        </span>
      </div>
    </Link>
  )
}