export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-rose-500 to-orange-500 text-xs text-white">
              C
            </span>
            <span>ClubO 社区 — 发现精彩内容</span>
          </div>
          <p className="text-xs text-zinc-400">
            &copy; {new Date().getFullYear()} ClubO. 内容来源于各大平台，仅供学习交流。
          </p>
        </div>
      </div>
    </footer>
  )
}