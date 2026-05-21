'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

const GRID = 20
const CELL = 24
const W = 20
const H = 20
const INITIAL_LEN = 4

const DIR = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }
const OPP = { ArrowUp: 'ArrowDown', ArrowDown: 'ArrowUp', ArrowLeft: 'ArrowRight', ArrowRight: 'ArrowLeft' }

function randomFood(snake) {
  const set = new Set(snake.map(([x, y]) => `${x},${y}`))
  const free = []
  for (let x = 0; x < W; x++)
    for (let y = 0; y < H; y++)
      if (!set.has(`${x},${y}`)) free.push([x, y])
  return free.length ? free[Math.floor(Math.random() * free.length)] : null
}

export default function SnakePage() {
  const canvasRef = useRef(null)
  const [snake, setSnake] = useState(() => {
    const s = []
    for (let i = 0; i < INITIAL_LEN; i++) s.push([Math.floor(W / 2) - i, Math.floor(H / 2)])
    return s
  })
  const [food, setFood] = useState(() => randomFood(snake))
  const [dir, setDir] = useState('ArrowRight')
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [started, setStarted] = useState(false)
  const [speed, setSpeed] = useState(120)
  const dirRef = useRef(dir)
  const snakeRef = useRef(snake)
  const overRef = useRef(false)

  useEffect(() => { snakeRef.current = snake }, [snake])
  useEffect(() => { dirRef.current = dir }, [dir])
  useEffect(() => { overRef.current = gameOver }, [gameOver])

  useEffect(() => {
    const handleKey = (e) => {
      if (!DIR[e.key]) return
      e.preventDefault()
      if (!started) {
        setStarted(true)
        setDir(e.key)
        return
      }
      if (overRef.current) return
      setDir((prev) => (OPP[e.key] === prev ? prev : e.key))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [started])

  useEffect(() => {
    if (!started || gameOver) return
    const interval = setInterval(() => {
      const currentDir = dirRef.current
      const [dx, dy] = DIR[currentDir]
      setSnake((prev) => {
        const head = prev[prev.length - 1]
        const nx = head[0] + dx
        const ny = head[1] + dy
        if (nx < 0 || nx >= W || ny < 0 || ny >= H || prev.some(([x, y]) => x === nx && y === ny)) {
          setGameOver(true)
          return prev
        }
        const next = [...prev, [nx, ny]]
        if (nx === food[0] && ny === food[1]) {
          const newFood = randomFood(next)
          if (newFood) setFood(newFood)
          else { setGameOver(true); setScore((s) => s + 10) }
          setScore((s) => s + 10)
          return next
        }
        next.shift()
        return next
      })
    }, speed)
    return () => clearInterval(interval)
  }, [started, gameOver, food, speed])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fafafa'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const currentSnake = snakeRef.current
    currentSnake.forEach(([x, y], i) => {
      ctx.fillStyle = i === currentSnake.length - 1 ? '#059669' : '#10b981'
      ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2)
      if (i === currentSnake.length - 1) {
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(x * CELL + CELL / 2 - 4, y * CELL + CELL / 2 - 2, 2.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x * CELL + CELL / 2 + 4, y * CELL + CELL / 2 - 2, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    if (food) {
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(food[0] * CELL + CELL / 2, food[1] * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2)
      ctx.fill()
    }

    if (gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 24px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('游戏结束', W * CELL / 2, H * CELL / 2 - 10)
      ctx.font = '14px sans-serif'
      ctx.fillText(`得分: ${score}`, W * CELL / 2, H * CELL / 2 + 20)
    } else if (!started) {
      ctx.fillStyle = 'rgba(0,0,0,0.4)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 20px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('按方向键开始', W * CELL / 2, H * CELL / 2)
    }
  }, [snake, food, gameOver, started, score])

  const reset = () => {
    const s = []
    for (let i = 0; i < INITIAL_LEN; i++) s.push([Math.floor(W / 2) - i, Math.floor(H / 2)])
    setSnake(s)
    setFood(randomFood(s))
    setDir('ArrowRight')
    setGameOver(false)
    setScore(0)
    setStarted(false)
  }

  return (
    <div>
      <div className="bg-white border-b border-zinc-100 sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link href="/games" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            返回游戏
          </Link>
          <span className="text-xs text-zinc-400">🐍 贪吃蛇</span>
        </div>
      </div>

      <section className="relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 h-[300px] w-[300px] rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-[200px] w-[200px] rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_60%)]" />

        <div className="relative mx-auto max-w-5xl px-4 py-10 md:py-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 text-xl">🐍</span>
            <div>
              <h1 className="text-2xl font-bold text-white md:text-3xl">贪吃蛇</h1>
              <p className="text-sm text-zinc-400 mt-0.5">方向键控制移动 · 吃到食物得分 · 别撞墙和自己</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 flex flex-col items-center">
        <div className="flex items-center gap-8 mb-6">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-2.5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">得分</p>
            <p className="text-2xl font-black text-emerald-600">{score}</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-zinc-500">速度</label>
            <button onClick={() => setSpeed((s) => Math.max(60, s - 20))} className="cursor-pointer rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-semibold hover:bg-zinc-200 transition-colors">﹣</button>
            <span className="text-sm font-bold text-zinc-700 min-w-[40px] text-center">{['快','较快','中','较慢','慢'][Math.min(4, Math.floor((speed - 60) / 30))]}</span>
            <button onClick={() => setSpeed((s) => Math.min(240, s + 20))} className="cursor-pointer rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-semibold hover:bg-zinc-200 transition-colors">﹢</button>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200/60 bg-white p-4 shadow-xl shadow-zinc-200/50">
          <canvas ref={canvasRef} width={W * CELL} height={H * CELL} className="rounded-2xl shadow-inner" />
        </div>

        <p className="mt-6 text-xs text-zinc-400">
          ↑↓←→ 控制方向 · 
          <button onClick={reset} className="cursor-pointer text-emerald-500 hover:text-emerald-700 font-semibold ml-1">重新开始</button>
        </p>
      </div>
    </div>
  )
}