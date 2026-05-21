'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const SIZE = 4

function emptyGrid() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
}

function addRandom(grid) {
  const empty = []
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (grid[r][c] === 0) empty.push([r, c])
  if (!empty.length) return grid
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]
  const newGrid = grid.map(row => [...row])
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4
  return newGrid
}

function slide(row) {
  const arr = row.filter(v => v)
  for (let i = 0; i < arr.length - 1; i++)
    if (arr[i] === arr[i + 1]) { arr[i] *= 2; arr.splice(i + 1, 1) }
  while (arr.length < SIZE) arr.push(0)
  return arr
}

function moveGrid(grid, dir) {
  let newGrid = grid.map(row => [...row])
  if (dir === 'left') newGrid = newGrid.map(slide)
  else if (dir === 'right') newGrid = newGrid.map(row => slide([...row].reverse()).reverse())
  else if (dir === 'up') {
    for (let c = 0; c < SIZE; c++) {
      const col = slide(newGrid.map(r => r[c]))
      for (let r = 0; r < SIZE; r++) newGrid[r][c] = col[r]
    }
  } else if (dir === 'down') {
    for (let c = 0; c < SIZE; c++) {
      const col = slide(newGrid.map(r => r[c]).reverse()).reverse()
      for (let r = 0; r < SIZE; r++) newGrid[r][c] = col[r]
    }
  }
  return newGrid
}

function isSame(a, b) {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (a[r][c] !== b[r][c]) return false
  return true
}

function canMove(grid) {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return true
      if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true
      if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true
    }
  return false
}

const tileColors = {
  2: 'bg-zinc-100 text-zinc-700',
  4: 'bg-amber-50 text-amber-700',
  8: 'bg-amber-100 text-amber-800',
  16: 'bg-orange-100 text-orange-800',
  32: 'bg-orange-200 text-orange-900',
  64: 'bg-red-200 text-red-800',
  128: 'bg-yellow-200 text-yellow-800',
  256: 'bg-yellow-300 text-yellow-900',
  512: 'bg-amber-300 text-amber-900',
  1024: 'bg-orange-300 text-orange-900',
  2048: 'bg-red-400 text-white',
}

function tileStyle(v) {
  if (v <= 2048) return tileColors[v] || 'bg-red-500 text-white'
  return 'bg-red-600 text-white'
}

export default function Game2048Page() {
  const [grid, setGrid] = useState(() => addRandom(addRandom(emptyGrid())))
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('2048_best')
    if (saved) setBest(parseInt(saved))
  }, [])

  useEffect(() => {
    if (score > best) { setBest(score); localStorage.setItem('2048_best', score.toString()) }
  }, [score, best])

  const handleMove = useCallback((dir) => {
    if (gameOver) return
    const newGrid = moveGrid(grid, dir)
    if (isSame(grid, newGrid)) return

    let gained = 0
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++)
        if (newGrid[r][c] !== grid[r][c] && newGrid[r][c] > 0)
          gained += newGrid[r][c] * 0.5

    const added = addRandom(newGrid)
    setGrid(added)
    setScore((s) => s + gained)

    if (!canMove(added)) setGameOver(true)
    if (added.some(row => row.some(v => v >= 2048)) && !won) setWon(true)
  }, [grid, gameOver, won])

  useEffect(() => {
    const handleKey = (e) => {
      const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }
      if (map[e.key]) { e.preventDefault(); handleMove(map[e.key]) }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleMove])

  const reset = () => {
    setGrid(addRandom(addRandom(emptyGrid())))
    setScore(0)
    setGameOver(false)
    setWon(false)
  }

  return (
    <div>
      <div className="bg-white border-b border-zinc-100 sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link href="/games" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            返回游戏
          </Link>
          <span className="text-xs text-zinc-400">🧩 2048</span>
        </div>
      </div>

      <section className="relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 h-[300px] w-[300px] rounded-full bg-amber-500/15 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-[200px] w-[200px] rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_60%)]" />

        <div className="relative mx-auto max-w-5xl px-4 py-10 md:py-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 text-xl">🧩</span>
            <div>
              <h1 className="text-2xl font-bold text-white md:text-3xl">2048</h1>
              <p className="text-sm text-zinc-400 mt-0.5">方向键合并方块 · 拼出 2048 即胜利</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 flex flex-col items-center">
        <div className="flex items-center gap-8 mb-6">
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-5 py-2.5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">得分</p>
            <p className="text-2xl font-black text-amber-600">{score}</p>
          </div>
          <div className="rounded-xl bg-zinc-50 border border-zinc-200 px-5 py-2.5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">最佳</p>
            <p className="text-2xl font-black text-zinc-500">{best}</p>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl bg-zinc-200/50 p-4 shadow-xl shadow-zinc-200/50">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${SIZE}, 80px)` }}>
              {grid.flat().map((v, i) => (
                <div key={i} className={`flex items-center justify-center rounded-2xl h-20 text-2xl font-black transition-all duration-200 ${v ? tileStyle(v) : 'bg-zinc-300/40'}`}>
                  {v || ''}
                </div>
              ))}
            </div>
          </div>

          {(gameOver || won) && (
            <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/60 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-3xl font-black text-white mb-2">{won ? '🎉 你赢了!' : '游戏结束'}</p>
                <p className="text-white/70 text-sm mb-4">得分: {score}</p>
                <button onClick={reset} className="cursor-pointer rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-zinc-800 hover:bg-zinc-100 transition-colors">
                  再来一局
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-xs text-zinc-400">
          ↑↓←→ 移动方块 · 
          <button onClick={reset} className="cursor-pointer text-amber-500 hover:text-amber-700 font-semibold ml-1">重新开始</button>
        </p>
      </div>
    </div>
  )
}