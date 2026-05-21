'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

const RATIOS = [
  { label: '自由', w: 0, h: 0 }, { label: '1:1', w: 1, h: 1 }, { label: '4:3', w: 4, h: 3 },
  { label: '3:4', w: 3, h: 4 }, { label: '16:9', w: 16, h: 9 }, { label: '9:16', w: 9, h: 16 },
]

export default function CropImage() {
  const [file, setFile] = useState(null)
  const [imgSrc, setImgSrc] = useState(null)
  const [result, setResult] = useState(null)
  const [ratio, setRatio] = useState(RATIOS[0])
  const [crop, setCrop] = useState({ x: 50, y: 50, w: 200, h: 200 })
  const [dragging, setDragging] = useState(false)
  const [dragCorner, setDragCorner] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 })
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 })
  const inputRef = useRef(null)
  const canvasRef = useRef(null)
  const imgRef = useRef(null)
  const containerRef = useRef(null)
  const startPos = useRef({ x: 0, y: 0 })

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) { setError('请选择图片文件'); return }
    setError(''); setResult(null); setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => { setImgSrc(e.target.result); setCrop({ x: 50, y: 50, w: 200, h: 200 }) }
    reader.readAsDataURL(f)
  }, [])

  const onImgLoad = useCallback((e) => setImgNatural({ w: e.target.naturalWidth, h: e.target.naturalHeight }), [])

  useEffect(() => {
    if (containerRef.current && imgNatural.w) {
      const rect = containerRef.current.getBoundingClientRect()
      const scale = Math.min(rect.width / imgNatural.w, 400 / imgNatural.h, 1)
      const dw = imgNatural.w * scale, dh = imgNatural.h * scale
      setDisplaySize({ w: dw, h: dh })
      setCrop({ x: 20, y: 20, w: Math.min(dw - 40, 200), h: Math.min(dh - 40, 200) })
    }
  }, [imgNatural, imgSrc])

  const getMousePos = useCallback((e) => {
    if (!containerRef.current) return { x: 0, y: 0 }
    const rect = containerRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    const pos = getMousePos(e)
    const inRect = pos.x >= crop.x - 5 && pos.x <= crop.x + crop.w + 5 && pos.y >= crop.y - 5 && pos.y <= crop.y + crop.h + 5
    if (inRect) setDragCorner(pos.x < crop.x + 10 && pos.y < crop.y + 10 ? 'tl' : pos.x > crop.x + crop.w - 10 && pos.y > crop.y + crop.h - 10 ? 'br' : 'move')
    else { setDragCorner('new'); setCrop(prev => ({ ...prev, x: pos.x - 50, y: pos.y - 50 })) }
    startPos.current = pos; setDragging(true)
  }, [crop, getMousePos])

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return
    const pos = getMousePos(e), dx = pos.x - startPos.current.x, dy = pos.y - startPos.current.y
    startPos.current = pos
    setCrop((prev) => {
      let { x, y, w, h } = prev
      if (dragCorner === 'move') { x += dx; y += dy }
      else if (dragCorner === 'br' || dragCorner === 'new') { w += dx; h += dy }
      else if (dragCorner === 'tl') { x += dx; y += dy; w -= dx; h -= dy }
      x = Math.max(0, x); y = Math.max(0, y)
      if (ratio.w > 0) h = w * ratio.h / ratio.w
      w = Math.min(w, displaySize.w - x); h = Math.min(h, displaySize.h - y)
      return { x, y, w: Math.max(20, w), h: Math.max(20, h) }
    })
  }, [dragging, dragCorner, ratio, displaySize, getMousePos])

  const handleMouseUp = useCallback(() => { setDragging(false); setDragCorner(null) }, [])

  const applyCrop = useCallback(() => {
    if (!imgRef.current || !canvasRef.current) return
    setProcessing(true)
    const img = imgRef.current, canvas = canvasRef.current
    const sx = crop.x * imgNatural.w / displaySize.w, sy = crop.y * imgNatural.h / displaySize.h
    const sw = crop.w * imgNatural.w / displaySize.w, sh = crop.h * imgNatural.h / displaySize.h
    canvas.width = sw; canvas.height = sh
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh)
    canvas.toBlob((blob) => { if (blob) setResult({ url: URL.createObjectURL(blob), blob, size: blob.size, w: Math.round(sw), h: Math.round(sh) }); setProcessing(false) }, file.type || 'image/png')
  }, [crop, imgNatural, displaySize, file])

  const download = useCallback(() => {
    if (!result) return
    const a = document.createElement('a'); a.href = result.url; a.download = file.name.replace(/\.[^.]+$/, '') + '_cropped.' + file.name.split('.').pop(); a.click()
  }, [result, file])

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-5">
        {!imgSrc ? (
          <div onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }} onDragOver={(e) => e.preventDefault()} onClick={() => inputRef.current?.click()}
            className="group cursor-pointer rounded-3xl border-2 border-dashed border-zinc-200 p-12 text-center transition-all duration-300 hover:border-amber-400/50 hover:bg-amber-50/20 hover:shadow-xl cursor-pointer">
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/10 to-orange-400/10 ring-1 ring-amber-200/50 text-2xl group-hover:scale-110 transition-transform">✂️</div>
            <p className="text-sm font-semibold text-zinc-700">拖放图片 或 点击上传</p>
          </div>
        ) : (
          <div ref={containerRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
            className="relative select-none rounded-3xl border border-zinc-200/60 bg-white p-2 overflow-hidden shadow-sm">
            <img ref={imgRef} src={imgSrc} onLoad={onImgLoad} alt="裁剪" className="block max-w-full max-h-[500px] object-contain mx-auto" style={{ width: displaySize.w, height: displaySize.h }} />
            {imgSrc && <>
              <div className="absolute inset-0 bg-black/40" style={{ clipPath: `polygon(0% 0%, 0% 100%, ${crop.x}px 100%, ${crop.x}px ${crop.y}px, ${crop.x + crop.w}px ${crop.y}px, ${crop.x + crop.w}px ${crop.y + crop.h}px, ${crop.x}px ${crop.y + crop.h}px, ${crop.x}px 100%, 100% 100%, 100% 0%)` }} />
              <div className="absolute border-2 border-amber-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h }} />
            </>}
          </div>
        )}
        {imgSrc && (
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">裁剪比例</label>
            <div className="flex flex-wrap gap-1.5">
              {RATIOS.map((r) => (
                <button key={r.label} type="button" onClick={() => setRatio(r)}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ${ratio.label === r.label ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' : 'bg-zinc-50 border border-zinc-100 text-zinc-600 hover:border-amber-200'}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {imgSrc && (
          <button onClick={applyCrop} disabled={processing}
            className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] disabled:opacity-40 active:scale-[0.98]">
            {processing ? '⏳ 裁剪中...' : '✂️ 确认裁剪'}
          </button>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
      <div className="lg:col-span-2 space-y-5">
        <div className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm min-h-[250px] flex items-center justify-center">
          {result ? (
            <div className="text-center">
              <img src={result.url} alt="裁剪结果" className="mx-auto max-h-60 rounded-2xl object-contain shadow-lg" />
              <p className="mt-3 text-xs text-zinc-500">{result.w} × {result.h} px</p>
            </div>
          ) : <p className="text-sm text-zinc-400">裁剪结果预览</p>}
        </div>
        {result && (
          <button onClick={download} className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 py-3 text-sm font-bold text-white shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
            下载裁剪图片
          </button>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}