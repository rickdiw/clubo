'use client'

import { useState, useRef, useCallback } from 'react'

const POSITIONS = [
  { label: '左上', x: 20, y: 40 }, { label: '中上', x: 0.5, y: 40 }, { label: '右上', x: -20, y: 40 },
  { label: '正中', x: 0.5, y: 0.5 }, { label: '左下', x: 20, y: -40 }, { label: '中下', x: 0.5, y: -40 },
  { label: '右下', x: -20, y: -40 }, { label: '平铺', x: 'tile', y: 'tile' },
]

function parsePosition(pos, imgW, imgH, textW, textH) {
  if (pos.x === 'tile') return { x: 0, y: 0, tile: true }
  let x = pos.x === 0.5 ? (imgW - textW) / 2 : pos.x < 0 ? imgW + pos.x - textW : pos.x
  let y = pos.y === 0.5 ? (imgH - textH) / 2 : pos.y < 0 ? imgH + pos.y - textH : pos.y
  return { x, y, tile: false }
}

export default function Watermark() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [text, setText] = useState('Watermark')
  const [fontSize, setFontSize] = useState(48)
  const [opacity, setOpacity] = useState(30)
  const [rotation, setRotation] = useState(-30)
  const [color, setColor] = useState('#ffffff')
  const [position, setPosition] = useState(POSITIONS[6])
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const canvasRef = useRef(null)

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) { setError('请选择图片文件'); return }
    setError(''); setResult(null); setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }, [])

  const applyWatermark = useCallback(() => {
    if (!preview || !canvasRef.current || !text) return
    setProcessing(true); setError('')
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      ctx.font = `${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`
      ctx.fillStyle = `${color}${Math.round(opacity / 100 * 255).toString(16).padStart(2, '0')}`
      ctx.textBaseline = 'top'
      const metrics = ctx.measureText(text)
      const textW = metrics.width; const textH = fontSize * 1.2
      const { x, y, tile } = parsePosition(position, canvas.width, canvas.height, textW, textH)
      if (tile) {
        const sp = 200
        for (let row = -2; row < (canvas.height / sp) + 2; row++)
          for (let col = -2; col < (canvas.width / sp) + 2; col++) {
            ctx.save(); ctx.translate(col * sp + (row % 2 ? sp / 2 : 0), row * sp); ctx.rotate(rotation * Math.PI / 180); ctx.fillText(text, 0, 0); ctx.restore()
          }
      } else {
        ctx.save(); ctx.translate(x + textW / 2, y + textH / 2); ctx.rotate(rotation * Math.PI / 180); ctx.fillText(text, -textW / 2, -textH / 2); ctx.restore()
      }
      canvas.toBlob((blob) => { if (blob) setResult({ url: URL.createObjectURL(blob), blob, size: blob.size }); setProcessing(false) }, file.type || 'image/png')
    }
    img.onerror = () => { setError('图片加载失败'); setProcessing(false) }
    img.src = preview
  }, [preview, text, fontSize, opacity, rotation, color, position, file])

  const download = useCallback(() => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result.url; a.download = file.name.replace(/\.[^.]+$/, '') + '_watermarked.' + file.name.split('.').pop()
    a.click()
  }, [result, file])

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <div onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }} onDragOver={(e) => e.preventDefault()} onClick={() => inputRef.current?.click()}
          className="group cursor-pointer rounded-3xl border-2 border-dashed border-zinc-200 p-10 text-center transition-all duration-300 hover:border-indigo-400/50 hover:bg-indigo-50/20 hover:shadow-xl cursor-pointer">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          {preview ? <img src={preview} alt="原图" className="mx-auto max-h-52 rounded-2xl object-contain shadow-md" /> : (
            <div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400/10 to-purple-400/10 ring-1 ring-indigo-200/50 text-2xl group-hover:scale-110 transition-transform">💧</div>
              <p className="text-sm font-semibold text-zinc-700">拖放图片 或 点击上传</p>
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">水印文字</label>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[11px] font-semibold text-zinc-500">字号 {fontSize}px</label><input type="range" min="12" max="120" value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className="mt-1 w-full accent-indigo-500" /></div>
            <div><label className="text-[11px] font-semibold text-zinc-500">透明度 {opacity}%</label><input type="range" min="5" max="100" value={opacity} onChange={(e) => setOpacity(+e.target.value)} className="mt-1 w-full accent-indigo-500" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[11px] font-semibold text-zinc-500">旋转 {rotation}°</label><input type="range" min="-90" max="90" value={rotation} onChange={(e) => setRotation(+e.target.value)} className="mt-1 w-full accent-indigo-500" /></div>
            <div><label className="text-[11px] font-semibold text-zinc-500">颜色</label><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-zinc-200 cursor-pointer" /></div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-zinc-500 mb-2 block">水印位置</label>
            <div className="flex flex-wrap gap-1.5">
              {POSITIONS.map((p) => (
                <button key={p.label} type="button" onClick={() => setPosition(p)}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ${position.label === p.label ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' : 'bg-zinc-50 border border-zinc-100 text-zinc-600 hover:border-indigo-200'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={applyWatermark} disabled={!preview || processing}
          className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]">
          {processing ? '⏳ 处理中...' : '💎 添加水印'}
        </button>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <div className="space-y-5">
        <div className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm min-h-[300px] flex items-center justify-center">
          {result ? <img src={result.url} alt="水印结果" className="max-h-72 max-w-full rounded-2xl object-contain shadow-lg" />
            : <div className="text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 text-zinc-300 text-lg mb-3">💧</div><p className="text-sm text-zinc-400">水印结果预览</p></div>}
        </div>
        {result && (
          <button onClick={download} className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
            下载加水印图片
          </button>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}