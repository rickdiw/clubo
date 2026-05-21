'use client'

import { useState, useRef, useCallback } from 'react'

export default function SvgToPng() {
  const [svgContent, setSvgContent] = useState('')
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [scale, setScale] = useState(2)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [mode, setMode] = useState('paste')
  const [fileName, setFileName] = useState('')
  const canvasRef = useRef(null)
  const fileRef = useRef(null)

  const handleFileUpload = useCallback((e) => {
    const f = e.target.files[0]
    if (!f) return
    if (!f.name.endsWith('.svg')) { setError('请选择 SVG 文件'); return }
    setError(''); setFileName(f.name)
    const reader = new FileReader()
    reader.onload = (ev) => { setSvgContent(ev.target.result); setMode('file') }
    reader.readAsText(f)
  }, [])

  const convert = useCallback(() => {
    if (!svgContent.trim() || !canvasRef.current) return
    setError(''); setResult(null)
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      const outputW = Math.round(width * scale), outputH = Math.round(height * scale)
      canvas.width = outputW; canvas.height = outputH
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, outputW, outputH)
      ctx.drawImage(img, 0, 0, outputW, outputH)
      canvas.toBlob((blob) => { URL.revokeObjectURL(url); if (blob) setResult({ url: URL.createObjectURL(blob), blob, size: blob.size, w: outputW, h: outputH }) }, 'image/png')
    }
    img.onerror = () => { setError('SVG 解析失败，请检查内容是否正确'); URL.revokeObjectURL(url) }
    img.src = url
  }, [svgContent, width, height, scale])

  const download = useCallback(() => {
    if (!result) return
    const a = document.createElement('a'); a.href = result.url; a.download = fileName ? fileName.replace('.svg', '.png') : 'output.png'; a.click()
  }, [result, fileName])

  const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
  <rect width="300" height="200" fill="#f0f4ff" rx="16"/>
  <circle cx="150" cy="80" r="45" fill="#6366f1"/>
  <rect x="90" y="140" width="120" height="14" rx="7" fill="#818cf8"/>
  <text x="150" y="174" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6366f1">SVG → PNG</text>
</svg>`

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="flex items-center gap-1 rounded-2xl bg-zinc-50 p-1 border border-zinc-100">
          <button onClick={() => { setMode('paste'); setFileName('') }}
            className={`flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-semibold transition-all ${mode === 'paste' ? 'bg-white shadow-sm ring-1 ring-zinc-200/60 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}>粘贴代码</button>
          <button onClick={() => { setMode('file'); fileRef.current?.click() }}
            className={`flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-semibold transition-all ${mode === 'file' ? 'bg-white shadow-sm ring-1 ring-zinc-200/60 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}>上传 SVG</button>
          <input ref={fileRef} type="file" accept=".svg" className="hidden" onChange={handleFileUpload} />
        </div>

        {mode === 'paste' && (
          <div>
            <textarea value={svgContent} onChange={(e) => setSvgContent(e.target.value)} placeholder={sampleSvg}
              className="w-full h-48 rounded-2xl border border-zinc-200 p-4 font-mono text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:outline-none resize-none shadow-sm" spellCheck={false} />
            {!svgContent && (
              <button onClick={() => setSvgContent(sampleSvg)} className="mt-2 cursor-pointer text-xs text-violet-500 hover:text-violet-700 transition-colors font-medium">⬆ 填充示例代码</button>
            )}
          </div>
        )}

        {mode === 'file' && (
          <div onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.name.endsWith('.svg')) { const r = new FileReader(); r.onload = (ev) => setSvgContent(ev.target.result); r.readAsText(f); setFileName(f.name) } }} onDragOver={(e) => e.preventDefault()}
            className="group cursor-pointer rounded-3xl border-2 border-dashed border-zinc-200 p-10 text-center transition-all duration-300 hover:border-violet-400/50 hover:bg-violet-50/20 hover:shadow-xl cursor-pointer">
            {fileName ? (
              <div>
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400/10 to-purple-400/10 ring-1 ring-violet-200/50 text-2xl">📄</div>
                <p className="text-sm font-semibold text-zinc-700">{fileName}</p>
                <p className="text-xs text-zinc-400 mt-1">拖放新文件替换</p>
              </div>
            ) : (
              <div>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400/10 to-purple-400/10 ring-1 ring-violet-200/50 text-2xl group-hover:scale-110 transition-transform">📐</div>
                <p className="text-sm font-semibold text-zinc-700">拖放 SVG 文件到此处</p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4 rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[11px] font-semibold text-zinc-500">画布宽度</label><input type="number" value={width} onChange={e => setWidth(+e.target.value || 1)} min="1" max="4096" className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none transition-all" /></div>
            <div><label className="text-[11px] font-semibold text-zinc-500">画布高度</label><input type="number" value={height} onChange={e => setHeight(+e.target.value || 1)} min="1" max="4096" className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none transition-all" /></div>
          </div>
          <div>
            <div className="flex items-center justify-between"><label className="text-[11px] font-semibold text-zinc-500">输出倍率</label><span className="text-sm font-bold text-violet-600">{scale}x → {Math.round(width * scale)}×{Math.round(height * scale)} px</span></div>
            <input type="range" min="1" max="4" step="0.5" value={scale} onChange={e => setScale(+e.target.value)} className="mt-1 w-full accent-violet-500" />
          </div>
        </div>

        <button onClick={convert} disabled={!svgContent.trim()}
          className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-500/25 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]">
          转换为 PNG
        </button>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <div className="space-y-5">
        <div className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm min-h-[300px] flex items-center justify-center" style={{ background: 'repeating-conic-gradient(#f4f4f5 0% 25%, #fff 0% 50%) 50% / 20px 20px' }}>
          {result ? (
            <img src={result.url} alt="PNG 结果" className="max-h-80 max-w-full rounded-2xl object-contain shadow-lg" />
          ) : svgContent ? (
            <div className="text-center">
              <div dangerouslySetInnerHTML={{ __html: svgContent }} className="max-w-full max-h-64 inline-block" />
              <p className="mt-2 text-xs text-zinc-400">SVG 原始预览</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 text-zinc-300 text-lg">📐</div>
              <p className="text-sm text-zinc-400">粘贴 SVG 代码或上传文件后转换</p>
            </div>
          )}
        </div>
        {result && (
          <button onClick={download}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 py-3 text-sm font-bold text-white shadow-xl shadow-violet-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
            下载 PNG ({result.w} × {result.h} px)
          </button>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}