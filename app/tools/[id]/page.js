import Link from 'next/link'
import { notFound } from 'next/navigation'
import tools from '@/config/tools'
import ImageCompress from '@/components/tools/ImageCompress'
import Watermark from '@/components/tools/Watermark'
import FormatConvert from '@/components/tools/FormatConvert'
import CropImage from '@/components/tools/CropImage'
import ColorPicker from '@/components/tools/ColorPicker'
import SvgToPng from '@/components/tools/SvgToPng'

const toolComponents = {
  'compress-image': ImageCompress,
  'watermark': Watermark,
  'format-convert': FormatConvert,
  'crop-image': CropImage,
  'color-picker': ColorPicker,
  'svg-to-png': SvgToPng,
}

const toolThemes = {
  'compress-image': { bar: 'from-rose-500 to-rose-600', glow: 'bg-rose-500/15', accent: 'text-rose-400', border: 'ring-rose-500/20', desc: '在线压缩 PNG/JPEG/WebP 图片体积，支持调整质量与尺寸' },
  'watermark': { bar: 'from-indigo-500 to-purple-600', glow: 'bg-indigo-500/15', accent: 'text-indigo-400', border: 'ring-indigo-500/20', desc: '为图片添加文字水印，支持位置、透明度和旋转角度调节' },
  'format-convert': { bar: 'from-emerald-500 to-teal-600', glow: 'bg-emerald-500/15', accent: 'text-emerald-400', border: 'ring-emerald-500/20', desc: 'PNG / JPEG / WebP / BMP 图片格式在线互转' },
  'crop-image': { bar: 'from-amber-500 to-orange-600', glow: 'bg-amber-500/15', accent: 'text-amber-400', border: 'ring-amber-500/20', desc: '自由裁剪或按固定比例裁剪图片，支持实时预览' },
  'color-picker': { bar: 'from-pink-500 to-rose-600', glow: 'bg-pink-500/15', accent: 'text-pink-400', border: 'ring-pink-500/20', desc: '从图片任意位置提取颜色，获取 HEX / RGB / HSL 值' },
  'svg-to-png': { bar: 'from-violet-500 to-purple-600', glow: 'bg-violet-500/15', accent: 'text-violet-400', border: 'ring-violet-500/20', desc: '将 SVG 矢量代码转换为 PNG 位图，支持自定义尺寸' },
}

export function generateStaticParams() {
  return tools.map((tool) => ({ id: tool.id }))
}

export default async function ToolPage({ params }) {
  const { id } = await params
  const tool = tools.find((t) => t.id === id)
  if (!tool || !toolComponents[id]) notFound()

  const ToolComponent = toolComponents[id]
  const theme = toolThemes[id] || toolThemes['compress-image']

  return (
    <div>
      {/* Nav */}
      <div className="bg-white border-b border-zinc-100 sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            返回工具箱
          </Link>
          <span className="text-xs text-zinc-400">{tool.icon} {tool.name}</span>
        </div>
      </div>

      {/* Tool Hero Header */}
      <section className="relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0">
          <div className={`absolute -top-20 -right-20 h-[300px] w-[300px] rounded-full ${theme.glow} blur-3xl`} />
          <div className="absolute -bottom-10 -left-10 h-[200px] w-[200px] rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_60%)]" />

        <div className="relative mx-auto max-w-5xl px-4 py-10 md:py-14">
          <div className="flex items-center gap-3 mb-4">
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 text-xl`}>
              {tool.icon}
            </span>
            <div>
              <h1 className="text-2xl font-bold text-white md:text-3xl">{tool.name}</h1>
              <p className="text-sm text-zinc-400 mt-0.5">{theme.desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className={`inline-flex items-center gap-1 rounded-full bg-white/5 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-white/10`}>
              <span className="relative flex h-1.5 w-1.5">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${theme.accent.replace('text-', 'bg-')} opacity-75`} />
                <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${theme.accent.replace('text-', 'bg-')}`} />
              </span>
              浏览器本地运行，安全可靠
            </span>
          </div>
        </div>
      </section>

      {/* Tool Content */}
      <div className="mx-auto max-w-5xl px-4 py-10">
        <ToolComponent />
      </div>
    </div>
  )
}