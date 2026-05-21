const categoryColors = {
  '游戏': 'bg-green-50 text-green-600',
  '休闲': 'bg-yellow-50 text-yellow-600',
  '工具': 'bg-blue-50 text-blue-600',
  '设计': 'bg-purple-50 text-purple-600',
  '音乐': 'bg-pink-50 text-pink-600',
  '生活': 'bg-orange-50 text-orange-600',
}

export default function H5Card({ page: h5, compact = false }) {
  const catColor = categoryColors[h5.category] || 'bg-zinc-50 text-zinc-600'

  return compact ? (
    <a
      href={h5.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 transition-all hover:border-rose-200 hover:shadow-sm"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-50 text-lg">
        {h5.category === '游戏' ? '🎮' : h5.category === '休闲' ? '🎯' : h5.category === '工具' ? '🔧' : h5.category === '设计' ? '🎨' : h5.category === '音乐' ? '🎵' : '🌟'}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-medium text-zinc-900 truncate">{h5.title}</h4>
        <p className="text-xs text-zinc-400 truncate">{h5.description}</p>
      </div>
      <span className={`flex-shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${catColor}`}>
        {h5.category}
      </span>
    </a>
  ) : (
    <a
      href={h5.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex cursor-pointer flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-rose-200 hover:shadow-md"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 text-2xl group-hover:scale-110 transition-transform">
        {h5.category === '游戏' ? '🎮' : h5.category === '休闲' ? '🎯' : h5.category === '工具' ? '🔧' : h5.category === '设计' ? '🎨' : h5.category === '音乐' ? '🎵' : '🌟'}
      </div>

      <h3 className="text-base font-semibold text-zinc-900 group-hover:text-rose-600 transition-colors">
        {h5.title}
      </h3>

      <p className="mt-1 flex-1 text-sm text-zinc-500 line-clamp-2">
        {h5.description}
      </p>

      {h5.featured && (
        <div className="mt-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-600">
            ⭐ 推荐
          </span>
        </div>
      )}

      <div className="mt-2">
        <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${catColor}`}>
          {h5.category}
        </span>
      </div>
    </a>
  )
}