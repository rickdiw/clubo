import Link from 'next/link'

const navItems = [
  { href: '/', label: '首页', icon: '🏠' },
  { href: '/news', label: '热门资讯', icon: '🔥' },
  { href: '/tools', label: 'AI 工具', icon: '🛠️' },
  { href: '/games', label: '热门游戏', icon: '🎮' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-zinc-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 text-sm text-white">
            C
          </span>
          <span>ClubO</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}