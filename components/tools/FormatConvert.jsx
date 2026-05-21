'use client'

import { useState, useRef, useCallback } from 'react'

function formatSize(bytes) {
  if (!bytes) return '0 KB'
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

const FORMATS = [
  { value: 'image/png', label: 'PNG', ext: 'png' }, { value: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' }, { value: 'image/bmp', label: 'BMP', ext: 'bmp' },
]

export default function FormatConvert() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [targetFormat, setTargetFormat] = useState(FORMATS[0])
  const [quality, setQuality] = useState(90)
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

  const convert = useCallback(() => {
    if (!preview || !canvasRef.current) return
    setProcessing(true); setError('')
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      canvas.toBlob((blob) => { if (blob) setResult({ url: URL.createObjectURL(blob), blob, size: blob.size }); setProcessing(false) }, targetFormat.value, quality / 100)
    }
    img.onerror = () => { setError('图片加载失败'); setProcessing(false) }
    img.src = preview
  }, [preview, targetFormat, quality])

  const download = useCallback(() => {
    if (!result) return
    const a = document.createElement('a'); a.href = result.url; a.download = file.name.replace(/\.[^.]+$/, '') + '_converted.' + targetFormat.ext; a.click()
  }, [result, file, targetFormat])

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <div onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }} onDragOver={(e) => e.preventDefault()} onClick={() => inputRef.current?.click()}
          className="group cursor-pointer rounded-3xl border-2 border-dashed border-zinc-200 p-10 text-center transition-all duration-300 hover:border-emerald-400/50 hover:bg-emerald-50/20 hover:shadow-xl cursor-pointer">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          {preview ? <img src={preview} alt="原图" className="mx-auto max-h-52 rounded-2xl object-contain shadow-md" /> : (
            <div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/10 to-teal-400/10 ring-1 ring-emerald-200/50 text-2xl group-hover:scale-110 transition-transform">🔄</div>
              <p className="text-sm font-semibold text-zinc-700">拖放图片 或 点击上传</p>
            </div>
          )}
        </div>
        {file && (
          <div className="flex items-center gap-2 rounded-2xl bg-zinc-50 px-4 py-2.5 text-xs text-zinc-600">
            <span className="font-semibold text-zinc-800">{file.name}</span>
            <span className="text-zinc-300">·</span><span>{file.type}</span><span className="text-zinc-300">·</span><span>{formatSize(file.size)}</span>
          </div>
        )}
        <div className="space-y-3 rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">目标格式</label>
          <div className="flex gap-2">
            {FORMATS.map((f) => (
              <button key={f.value} type="button" onClick={() => setTargetFormat(f)}
                className={`cursor-pointer flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${targetFormat.value === f.value ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-zinc-50 border border-zinc-100 text-zinc-600 hover:border-emerald-200'}`}>
                {f.label}
              </button>
            ))}
          </div>
          {targetFormat.value !== 'image/bmp' && (
            <div>
              <div className="flex items-center justify-between"><label className="text-[11px] font-semibold text-zinc-500">质量</label><span className="text-sm font-bold text-emerald-600">{quality}%</span></div>
              <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(+e.target.value)} className="mt-1 w-full accent-emerald-500" />
            </div>
          )}
        </div>
        <button onClick={convert} disabled={!preview || processing}
          className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]">
          {processing ? '⏳ 转换中...' : `🔄 转换为 ${targetFormat.label}`}
        </button>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
      <div className="space-y-5">
        <div className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm min-h-[300px] flex items-center justify-center">
          {result ? <img src={result.url} alt="转换结果" className="max-h-72 max-w-full rounded-2xl object-contain shadow-lg" />
            : <div className="text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 text-zinc-300 text-lg mb-3">🔄</div><p className="text-sm text-zinc-400">转换结果预览</p></div>}
        </div>
        {result && (
          <div className="space-y-3 rounded-3xl bg-emerald-50/50 border border-emerald-100 p-5 shadow-sm">
            <div className="text-center"><span className="font-bold text-emerald-700">{targetFormat.label}</span><span className="text-zinc-400 text-sm"> · {formatSize(result.size)}</span></div>
            <button onClick={download} className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
              下载 {targetFormat.label} 图片
            </button>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}