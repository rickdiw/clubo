import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './globals.css'

export const metadata = {
  title: 'ClubO - 发现精彩内容',
  description: '热门资讯、AI 工具、H5 网页一站式社区平台',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className="flex min-h-screen flex-col bg-zinc-50 font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}