import { readFileSync, existsSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import { createHash } from 'crypto'

const DATA_DIR = resolve(process.cwd(), 'data/news')

const CATEGORY_IMAGES = {
  '科技': ['technology', 'tech', 'computer', 'digital'],
  '娱乐': ['entertainment', 'music', 'movie', 'concert'],
  '体育': ['sports', 'football', 'basketball', 'soccer'],
  '财经': ['business', 'finance', 'money', 'economy'],
  '社会': ['society', 'city', 'people', 'urban'],
  '教育': ['education', 'school', 'university', 'learning'],
  '生活': ['lifestyle', 'food', 'travel', 'nature'],
  '国际': ['world', 'global', 'international', 'politics'],
  '军事': ['military', 'defense', 'army'],
  '健康': ['health', 'medical', 'fitness', 'wellness'],
}

function generateId(item) {
  return createHash('md5').update(item.url || item.title).digest('hex').slice(0, 10)
}

function getCoverImage(item) {
  if (item.coverImage && item.coverImage.length > 10 && item.coverImage.startsWith('http')) {
    return item.coverImage
  }
  const seed = createHash('md5').update(item.title || item.url || '').digest('hex').slice(0, 12)
  const cat = item.category || '综合'
  const keywords = CATEGORY_IMAGES[cat] || ['news', 'media', 'article']
  const kw = keywords[Math.abs(parseInt(seed.slice(0, 4), 16)) % keywords.length]
  return `https://picsum.photos/seed/${seed}/800/450`
}

function findLatestNewsFiles(maxDays = 7) {
  const result = []
  const now = new Date()

  for (let i = 0; i < maxDays; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const year = d.getFullYear().toString()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const filePath = join(DATA_DIR, year, month, `${day}.json`)

    if (existsSync(filePath)) {
      result.push(filePath)
    }
  }

  return result
}

function flattenAllItems(files) {
  const allItems = []
  const seenUrls = new Set()

  for (const filePath of files) {
    try {
      const raw = readFileSync(filePath, 'utf-8')
      const data = JSON.parse(raw)
      if (data?.items) {
        for (const item of data.items) {
          if (!seenUrls.has(item.url)) {
            seenUrls.add(item.url)
            const enriched = { ...item, id: generateId(item) }
            enriched.coverImage = getCoverImage(enriched)
            allItems.push(enriched)
          }
        }
      }
    } catch {
      continue
    }
  }

  return allItems
}

export function getLatestNews(limit = 20) {
  const files = findLatestNewsFiles(7)
  const allItems = flattenAllItems(files)
  allItems.sort((a, b) => (b.hotScore || 0) - (a.hotScore || 0))
  return allItems.slice(0, limit)
}

export function getNewsById(id) {
  const files = findLatestNewsFiles(7)

  for (const filePath of files) {
    try {
      const raw = readFileSync(filePath, 'utf-8')
      const data = JSON.parse(raw)
      if (data?.items) {
        const found = data.items.find((item) => generateId(item) === id)
        if (found) {
          const enriched = { ...found, id: generateId(found) }
          enriched.coverImage = getCoverImage(enriched)
          return enriched
        }
      }
    } catch {
      continue
    }
  }

  return null
}

export function getAllNewsIds() {
  const files = findLatestNewsFiles(30)
  const allItems = flattenAllItems(files)
  return allItems.map((item) => ({ id: item.id }))
}

export function getNewsByDate(year, month, day) {
  const y = String(year).padStart(4, '0')
  const m = String(month).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  const filePath = join(DATA_DIR, y, m, `${d}.json`)

  try {
    const raw = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)
    if (data?.items) {
      data.items = data.items.map((item) => ({ ...item, id: generateId(item) }))
    }
    return data
  } catch {
    return null
  }
}

export function getNewsBySource(source, limit = 20) {
  const files = findLatestNewsFiles(7)
  const items = []

  for (const filePath of files) {
    try {
      const raw = readFileSync(filePath, 'utf-8')
      const data = JSON.parse(raw)
      if (data?.items) {
        for (const item of data.items) {
          if (item.source === source || item.sourceId === source) {
            const enriched = { ...item, id: generateId(item) }
            enriched.coverImage = getCoverImage(enriched)
            items.push(enriched)
          }
        }
      }
    } catch {
      continue
    }
  }

  items.sort((a, b) => (b.hotScore || 0) - (a.hotScore || 0))
  return items.slice(0, limit)
}

export function getAvailableDates() {
  const dates = []
  if (!existsSync(DATA_DIR)) return dates

  const years = readdirSync(DATA_DIR, { withFileTypes: true }).filter((d) => d.isDirectory())

  for (const yearDir of years) {
    const months = readdirSync(join(DATA_DIR, yearDir.name), { withFileTypes: true }).filter((d) => d.isDirectory())

    for (const monthDir of months) {
      const files = readdirSync(join(DATA_DIR, yearDir.name, monthDir.name)).filter((f) => f.endsWith('.json'))

      for (const file of files) {
        const day = file.replace('.json', '')
        dates.push({
          year: yearDir.name,
          month: monthDir.name,
          day,
          dateStr: `${yearDir.name}-${monthDir.name}-${day}`,
        })
      }
    }
  }

  dates.sort((a, b) => b.dateStr.localeCompare(a.dateStr))
  return dates
}