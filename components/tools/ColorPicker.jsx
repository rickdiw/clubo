'use client'

import { useState, useRef, useCallback } from 'react'

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) / 6 : max === g ? ((b - r) / d + 2) / 6 : ((r - g) / d + 4) / 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export default function ColorPicker() {
  const [file, setFile] = useState(null)
  const [imgSrc, setImgSrc] = useState(null)
  const [colors, setColors] = useState([])
  const [activeColor, setActiveColor] = useState(null)
  const [copied, setCopied] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const imgRef = useRef(null)
  const canvasRef = useRef(null)

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) { setError('请选择图片文件'); return }
    setError(''); setColors([]); setActiveColor(null); setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => setImgSrc(e.target.result)
    reader.readAsDataURL(f)
  }, [])

  const getColor = useCallback((e) => {
    if (!imgRef.current || !canvasRef.current) return
    const img = imgRef.current, rect = img.getBoundingClientRect()
    const x = Math.round((e.clientX - rect.left) / rect.width * img.naturalWidth)
    const y = Math.round((e.clientY - rect.top) / rect.height * img.naturalHeight)
    const canvas = canvasRef.current
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data
    const hex = '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')
    const hsl = rgbToHsl(r, g, b)
    const color = { hex, rgb: `rgb(${r}, ${g}, ${b})`, hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, r, g, b }
    setActiveColor(color)
    setColors(prev => prev.find(c => c.hex === color.hex) ? prev : [color, ...prev].slice(0, 20))
  }, [])

  const copy = useCallback((text, label) => { navigator.clipboard.writeText(text); setCopied(label); setTimeout(() => setCopied(''), 1500) }, [])

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        {!imgSrc ? (
          <div onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }} onDragOver={(e) => e.preventDefault()} onClick={() => inputRef.current?.click()}
            className="group cursor-pointer rounded-3xl border-2 border-dashed border-zinc-200 p-12 text-center transition-all duration-300 hover:border-pink-400/50 hover:bg-pink-50/20 hover:shadow-xl cursor-pointer">
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400/10 to-rose-400/10 ring-1 ring-pink-200/50 text-2xl group-hover:scale-110 transition-transform">🎨</div>
            <p className="text-sm font-semibold text-zinc-700">拖放图片 或 点击上传</p>
            <p className="mt-1 text-xs text-zinc-400">点击图片任意位置取色</p>
          </div>
        ) : (
          <div className="rounded-3xl overflow-hidden border border-zinc-200/60 shadow-sm">
            <img ref={imgRef} src={imgSrc} alt="取色" onClick={getColor} className="w-full cursor-crosshair" />
          </div>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
        {imgSrc && (
          <button onClick={() => { setImgSrc(null); setFile(null); setColors([]); setActiveColor(null) }}
            className="w-full cursor-pointer rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-50 transition-colors">重新选择图片</button>
        )}
      </div>
      <div className="space-y-5">
        {activeColor && (
          <div className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-5 mb-5">
              <div className="h-20 w-20 rounded-2xl shadow-xl ring-1 ring-zinc-200/50 flex-shrink-0 transition-all" style={{ background: activeColor.hex }} />
              <div className="space-y-2 flex-1">
                {[{ label: 'HEX', value: activeColor.hex }, { label: 'RGB', value: activeColor.rgb }, { label: 'HSL', value: activeColor.hsl }].map(({ label, value }) => (
                  <button key={label} onClick={() => copy(value, label)}
                    className="flex cursor-pointer items-center gap-3 rounded-xl bg-zinc-50 px-4 py-2.5 text-sm hover:bg-zinc-100 transition-colors w-full text-left border border-zinc-100">
                    <span className="text-xs font-bold text-zinc-400 w-8">{label}</span>
                    <span className="font-mono text-sm text-zinc-800 flex-1">{value}</span>
                    <span className="text-xs text-zinc-400">{copied === label ? '已复制!' : '点击复制'}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {colors.length > 0 && (
          <div className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">颜色历史</h4>
              <span className="text-xs text-zinc-400">{colors.length}/20</span>
            </div>
            <div className="grid grid-cols-5 gap-2.5">
              {colors.map((c) => (
                <button key={c.hex} onClick={() => setActiveColor(c)} onDoubleClick={() => setColors(prev => prev.filter(x => x.hex !== c.hex))}
                  className="relative cursor-pointer group aspect-square rounded-xl shadow-sm ring-1 ring-zinc-200/50 hover:ring-2 hover:scale-110 transition-all"
                  style={{ background: c.hex }} title={`${c.hex} (双击删除)`}>
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 whitespace-nowrap">{c.hex}</span>
                </button>
              ))}
            </div>
            {colors.length > 0 && (
              <button onClick={() => setColors([])} className="mt-4 cursor-pointer text-xs text-zinc-400 hover:text-red-500 transition-colors">清除全部历史</button>
            )}
          </div>
        )}
        {!activeColor && !imgSrc && (
          <div className="rounded-3xl border border-zinc-200/60 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 text-zinc-300 text-lg">🎨</div>
            <p className="text-sm text-zinc-500">上传图片后点击取色</p>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}