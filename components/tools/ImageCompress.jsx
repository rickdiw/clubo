'use client'

import { useState, useRef, useCallback } from 'react'

function formatSize(bytes) {
  if (!bytes) return '0 KB'
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

const FORMATS = [
  { value: 'image/webp', label: 'WebP', desc: '体积最小', ext: 'webp' },
  { value: 'image/jpeg', label: 'JPEG', desc: '兼容性好', ext: 'jpg' },
]

export default function ImageCompress() {
  const [files, setFiles] = useState([])
  const [quality, setQuality] = useState(75)
  const [maxWidth, setMaxWidth] = useState(0)
  const [maxHeight, setMaxHeight] = useState(0)
  const [keepSize, setKeepSize] = useState(true)
  const [format, setFormat] = useState(FORMATS[0])
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState(null)
  const inputRef = useRef(null)
  const canvasRef = useRef(null)

  const handleFiles = useCallback((newFiles) => {
    const valid = Array.from(newFiles).filter(f => f.type.startsWith('image/'))
    if (!valid.length) { setError('请选择图片文件'); return }
    setError('')

    const readers = valid.map(f => new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => resolve({ file: f, preview: e.target.result, width: img.naturalWidth, height: img.naturalHeight, result: null })
        img.src = e.target.result
      }
      reader.readAsDataURL(f)
    }))

    Promise.all(readers).then(newItems => {
      setFiles(prev => [...prev, ...newItems].slice(0, 20))
      setActiveTab(newItems[0]?.file.name)
    })
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const removeItem = useCallback((name) => {
    setFiles(prev => {
      const next = prev.filter(f => f.file.name !== name)
      if (activeTab === name && next.length) setActiveTab(next[0].file.name)
      return next
    })
  }, [activeTab])

  const totalOriginSize = files.reduce((s, f) => s + f.file.size, 0)
  const totalCompressedSize = files.reduce((s, f) => s + (f.result?.size || 0), 0)
  const activeItem = files.find(f => f.file.name === activeTab)

  const compressOne = useCallback((item) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        let w = img.naturalWidth, h = img.naturalHeight
        if (!keepSize) {
          if (maxWidth > 0 && w > maxWidth) { h = Math.round((maxWidth / w) * h); w = maxWidth }
          if (maxHeight > 0 && h > maxHeight) { w = Math.round((maxHeight / h) * w); h = maxHeight }
        }
        canvas.width = w; canvas.height = h
        const ctx = canvas.getContext('2d')
        if (item.file.type === 'image/png') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h) }
        ctx.drawImage(img, 0, 0, w, h)
        canvas.toBlob((blob) => {
          if (blob) resolve({ ...item, result: { url: URL.createObjectURL(blob), size: blob.size, width: w, height: h, blob } })
          else resolve({ ...item, result: null })
        }, format.value, quality / 100)
      }
      img.onerror = () => resolve({ ...item, result: null })
      img.src = item.preview
    })
  }, [quality, maxWidth, maxHeight, keepSize, format])

  const compressAll = useCallback(async () => {
    if (!files.length) return
    setProcessing(true)
    setError('')
    const results = []
    for (const item of files) {
      if (item.result) { results.push(item); continue }
      const r = await compressOne(item)
      results.push(r)
    }
    setFiles(results)
    setProcessing(false)
  }, [files, compressOne])

  const downloadOne = useCallback((item) => {
    if (!item?.result?.blob) return
    const a = document.createElement('a')
    a.href = item.result.url
    a.download = item.file.name.replace(/\.[^.]+$/, '') + '_compressed.' + format.ext
    a.click()
  }, [format])

  const downloadAll = useCallback(async () => {
    const compressed = files.filter(f => f.result?.blob)
    if (!compressed.length) return
    const JSZip = (await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js')).default
    if (!JSZip) {
      compressed.forEach(f => downloadOne(f))
      return
    }
    const zip = new JSZip()
    compressed.forEach(f => {
      zip.file(f.file.name.replace(/\.[^.]+$/, '') + '_compressed.' + format.ext, f.result.blob)
    })
    const blob = await zip.generateAsync({ type: 'blob' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'compressed_images.zip'
    a.click()
  }, [files, format, downloadOne])

  const clearAll = () => { setFiles([]); setActiveTab(null) }

  if (!canvasRef.current) canvasRef.current = document.createElement('canvas')

  return (
    <div>
      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="group cursor-pointer rounded-3xl border-2 border-dashed border-zinc-200 p-8 text-center transition-all duration-300 hover:border-rose-400/50 hover:bg-rose-50/20 hover:shadow-xl hover:shadow-rose-100/30 mb-6"
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400/10 to-rose-500/10 ring-1 ring-rose-200/50 text-2xl group-hover:scale-110 transition-transform">
          📁
        </div>
        <p className="text-sm font-semibold text-zinc-700">拖放多张图片到此处 或 点击批量选择</p>
        <p className="mt-1 text-xs text-zinc-400">支持 PNG / JPEG / WebP · 最多 20 张</p>
      </div>

      {files.length > 0 && (
        <>
          {/* File Tabs */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {files.map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(item.file.name)}
                className={`cursor-pointer flex-shrink-0 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeTab === item.file.name
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                    : 'bg-zinc-50 border border-zinc-100 text-zinc-600 hover:border-rose-200 hover:bg-rose-50'
                }`}
              >
                <span className="max-w-[100px] truncate">{item.file.name}</span>
                {item.result && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.result.size < item.file.size ? 'bg-emerald-400/20' : 'bg-amber-400/20'}`}>
                    {item.result.size < item.file.size ? '✅' : '⚠️'}
                  </span>
                )}
                <span onClick={(e) => { e.stopPropagation(); removeItem(item.file.name) }}
                  className="cursor-pointer ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-[10px] transition-colors">✕</span>
              </button>
            ))}
            {files.length > 0 && (
              <button onClick={clearAll} className="cursor-pointer flex-shrink-0 rounded-2xl px-3 py-2.5 text-xs text-zinc-400 hover:text-red-500 transition-colors whitespace-nowrap">
                清除全部
              </button>
            )}
          </div>

          {/* Active Preview + Settings */}
          {activeItem && (
            <div className="grid gap-6 lg:grid-cols-2 mb-6">
              <div>
                <div className="rounded-3xl border border-zinc-200/60 bg-white p-4 shadow-sm min-h-[200px] flex items-center justify-center">
                  <img src={activeItem.preview} alt="原图" className="max-h-52 rounded-2xl object-contain" />
                </div>
                <div className="mt-2 flex items-center gap-2 rounded-2xl bg-zinc-50 px-4 py-2.5 text-xs text-zinc-600">
                  <span className="font-semibold text-zinc-800 truncate max-w-[150px]">{activeItem.file.name}</span>
                  <span className="text-zinc-300">·</span>
                  <span>{formatSize(activeItem.file.size)}</span>
                  <span className="text-zinc-300">·</span>
                  <span>{activeItem.width}×{activeItem.height}px</span>
                </div>
              </div>

              {activeItem.result ? (
                <div className="rounded-3xl border border-zinc-200/60 bg-white p-4 shadow-sm min-h-[200px] flex items-center justify-center">
                  <img src={activeItem.result.url} alt="压缩结果" className="max-h-52 rounded-2xl object-contain" />
                </div>
              ) : (
                <div className="rounded-3xl border border-zinc-200/60 bg-white p-4 shadow-sm min-h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 text-zinc-300 text-lg mb-3">📦</div>
                    <p className="text-sm text-zinc-400">点击压缩后查看结果</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Settings */}
          <div className="space-y-4 rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm mb-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">压缩质量</label>
                <span className="text-sm font-bold text-rose-500">{quality}%</span>
              </div>
              <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(+e.target.value)} className="w-full h-2 rounded-full accent-rose-500 cursor-pointer" />
              <div className="flex justify-between mt-1"><span className="text-[10px] text-zinc-400">小文件</span><span className="text-[10px] text-zinc-400">高品质</span></div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">输出格式</label>
              <div className="flex gap-2">
                {FORMATS.map((f) => (
                  <button key={f.value} type="button" onClick={() => setFormat(f)}
                    className={`cursor-pointer flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${format.value === f.value ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/20' : 'bg-zinc-50 border border-zinc-100 text-zinc-600 hover:border-rose-200'}`}>
                    <div>{f.label}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">保持原图尺寸</label>
              <button type="button" onClick={() => setKeepSize(!keepSize)}
                className={`cursor-pointer relative inline-flex h-6 w-10 items-center rounded-full transition-colors duration-300 ${keepSize ? 'bg-rose-500' : 'bg-zinc-300'}`}>
                <span className={`inline-block h-[18px] w-[18px] rounded-full bg-white shadow transition-transform duration-300 ${keepSize ? 'translate-x-[20px]' : 'translate-x-[3px]'}`} />
              </button>
            </div>

            {!keepSize && (
              <div className="grid grid-cols-2 gap-3 animate-in">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-500">最大宽度</label>
                  <input type="number" value={maxWidth} onChange={(e) => setMaxWidth(+e.target.value)} placeholder="px"
                    className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-500">最大高度</label>
                  <input type="number" value={maxHeight} onChange={(e) => setMaxHeight(+e.target.value)} placeholder="px"
                    className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all" />
                </div>
              </div>
            )}
          </div>

          {/* Batch Actions */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={compressAll} disabled={processing}
              className="cursor-pointer flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-rose-500/25 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-rose-500/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-[0.98]">
              {processing ? '⏳ 压缩中...' : `🚀 批量压缩 (${files.filter(f => !f.result).length} 张)`}
            </button>

            {files.some(f => f.result) && (
              <button onClick={downloadAll}
                className="cursor-pointer rounded-2xl border border-rose-200 bg-rose-50 px-6 py-3.5 text-sm font-bold text-rose-600 transition-all hover:bg-rose-100 hover:scale-[1.02] active:scale-[0.98]">
                📦 打包下载
              </button>
            )}
          </div>

          {/* Results Summary */}
          {files.some(f => f.result) && (
            <div className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">压缩结果</h4>
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div className="rounded-2xl bg-zinc-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">文件数</p>
                  <p className="text-xl font-bold text-zinc-800 mt-1">{files.length}</p>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">原始大小</p>
                  <p className="text-xl font-bold text-zinc-800 mt-1">{formatSize(totalOriginSize)}</p>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">压缩后</p>
                  <p className="text-xl font-bold text-emerald-600 mt-1">{formatSize(totalCompressedSize)}</p>
                </div>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {files.filter(f => f.result).map((item, i) => {
                  const isSmaller = item.result.size < item.file.size
                  const pct = ((1 - item.result.size / item.file.size) * 100)
                  return (
                    <div key={i} className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-3 text-xs">
                      <img src={item.preview} alt="" className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-zinc-800 truncate">{item.file.name}</p>
                        <p className="text-zinc-400">{formatSize(item.file.size)} → {formatSize(item.result.size)}</p>
                      </div>
                      <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${isSmaller ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {isSmaller ? `-${pct.toFixed(0)}%` : `+${Math.abs(pct).toFixed(0)}%`}
                      </span>
                      <button onClick={() => downloadOne(item)}
                        className="cursor-pointer flex-shrink-0 rounded-lg bg-rose-500 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-rose-600 transition-colors">
                        下载
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
        </>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}