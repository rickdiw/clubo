'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const ROWS = 10
const COLS = 10
const MINES = 12

const DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]

function createBoard() {
  const board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 }))
  )
  let placed = 0
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    if (!board[r][c].mine) { board[r][c].mine = true; placed++ }
  }
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (!board[r][c].mine)
        board[r][c].adjacent = DIRS.filter(([dr, dc]) => {
          const nr = r + dr, nc = c + dc
          return nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].mine
        }).length
  return board
}

export default function MinesweeperPage() {
  const [board, setBoard] = useState(() => createBoard())
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [flagCount, setFlagCount] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [firstClick, setFirstClick] = useState(true)

  useEffect(() => {
    let timer
    if (startTime && !gameOver && !won) {
      timer = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    }
    return () => clearInterval(timer)
  }, [startTime, gameOver, won])

  const reveal = useCallback((board, r, c) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c].revealed || board[r][c].flagged) return
    board[r][c].revealed = true
    if (board[r][c].adjacent === 0 && !board[r][c].mine) {
      DIRS.forEach(([dr, dc]) => reveal(board, r + dr, c + dc))
    }
  }, [])

  const checkWin = useCallback((board) => {
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (!board[r][c].mine && !board[r][c].revealed) return false
    return true
  }, [])

  const handleClick = useCallback((r, c) => {
    if (gameOver || won || board[r][c].flagged) return
    const newBoard = board.map(row => row.map(cell => ({ ...cell })))

    if (firstClick && newBoard[r][c].mine) {
      newBoard[r][c].mine = false
      let placed = MINES
      while (placed > 0) {
        const rr = Math.floor(Math.random() * ROWS), cc = Math.floor(Math.random() * COLS)
        if (!newBoard[rr][cc].mine && (rr !== r || cc !== c)) { newBoard[rr][cc].mine = true; placed-- }
      }
      for (let rr = 0; rr < ROWS; rr++)
        for (let cc = 0; cc < COLS; cc++)
          if (!newBoard[rr][cc].mine)
            newBoard[rr][cc].adjacent = DIRS.filter(([dr, dc]) => {
              const nr = rr + dr, nc = cc + dc
              return nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newBoard[nr][nc].mine
            }).length
    }

    if (!startTime) setStartTime(Date.now())
    setFirstClick(false)

    if (newBoard[r][c].mine) {
      newBoard.forEach(row => row.forEach(cell => { if (cell.mine) cell.revealed = true }))
      setBoard(newBoard)
      setGameOver(true)
      return
    }

    reveal(newBoard, r, c)
    setBoard(newBoard)

    if (checkWin(newBoard)) setWon(true)
  }, [board, gameOver, won, startTime, firstClick, reveal, checkWin])

  const handleRightClick = useCallback((e, r, c) => {
    e.preventDefault()
    if (gameOver || won || board[r][c].revealed) return
    const newBoard = board.map(row => row.map(cell => ({ ...cell })))
    newBoard[r][c].flagged = !newBoard[r][c].flagged
    setBoard(newBoard)
    setFlagCount(newBoard.flat().filter(c => c.flagged).length)
  }, [board, gameOver, won])

  const reset = () => {
    setBoard(createBoard())
    setGameOver(false)
    setWon(false)
    setFlagCount(0)
    setStartTime(null)
    setElapsed(0)
    setFirstClick(true)
  }

  const numColors = ['', 'text-blue-500', 'text-emerald-500', 'text-red-500', 'text-indigo-600', 'text-amber-600', 'text-cyan-500', 'text-zinc-700', 'text-zinc-500']

  return (
    <div>
      <div className="bg-white border-b border-zinc-100 sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link href="/games" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            返回游戏
          </Link>
          <span className="text-xs text-zinc-400">💣 扫雷</span>
        </div>
      </div>

      <section className="relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 h-[300px] w-[300px] rounded-full bg-sky-500/15 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-[200px] w-[200px] rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_60%)]" />

        <div className="relative mx-auto max-w-5xl px-4 py-10 md:py-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 text-xl">💣</span>
            <div>
              <h1 className="text-2xl font-bold text-white md:text-3xl">扫雷</h1>
              <p className="text-sm text-zinc-400 mt-0.5">左键翻开 · 右键标记地雷 · 找出所有非雷格子</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 flex flex-col items-center">
        <div className="flex items-center gap-8 mb-6">
          <div className="rounded-xl bg-sky-50 border border-sky-200 px-5 py-2.5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-sky-500">剩余雷数</p>
            <p className="text-2xl font-black text-sky-600">{MINES - flagCount}</p>
          </div>
          <div className="rounded-xl bg-zinc-50 border border-zinc-200 px-5 py-2.5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">时间</p>
            <p className="text-2xl font-black text-zinc-500">{elapsed}s</p>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-zinc-200/60 bg-zinc-200/50 p-3 shadow-xl shadow-zinc-200/50">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, 42px)` }}>
              {board.flat().map((cell, i) => {
                const r = Math.floor(i / COLS), c = i % COLS
                return (
                  <button
                    key={i}
                    onClick={() => handleClick(r, c)}
                    onContextMenu={(e) => handleRightClick(e, r, c)}
                    className={`w-[42px] h-[42px] flex items-center justify-center rounded-lg text-sm font-bold transition-all duration-150 select-none cursor-pointer ${
                      cell.revealed
                        ? cell.mine
                          ? 'bg-red-500 text-white shadow-inner'
                          : 'bg-white text-zinc-600 shadow-inner'
                        : 'bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 shadow-sm hover:shadow'
                    } ${won ? 'opacity-80' : ''}`}
                  >
                    {cell.revealed ? (
                      cell.mine ? '💣' : cell.adjacent > 0 ? (
                        <span className={numColors[cell.adjacent]}>{cell.adjacent}</span>
                      ) : ''
                    ) : cell.flagged ? (
                      '🚩'
                    ) : ''}
                  </button>
                )
              })}
            </div>
          </div>

          {(gameOver || won) && (
            <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/60 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-3xl font-black text-white mb-2">{won ? '🎉 你赢了!' : '💥 踩雷了!'}</p>
                <p className="text-white/70 text-sm mb-4">用时: {elapsed}s</p>
                <button onClick={reset} className="cursor-pointer rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-zinc-800 hover:bg-zinc-100 transition-colors">
                  再来一局
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-xs text-zinc-400">
          左键翻开 · 右键标旗 · 
          <button onClick={reset} className="cursor-pointer text-sky-500 hover:text-sky-700 font-semibold ml-1">重新开始</button>
        </p>
      </div>
    </div>
  )
}