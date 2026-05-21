import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import * as cheerio from 'cheerio'
import NEWS_SOURCES from '../config/news-sources.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(__dirname, '..', 'data', 'news')

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:125.0) Gecko/20100101 Firefox/125.0',
]

const ACCEPT_LANGUAGES = [
  'zh-CN,zh;q=0.9,en;q=0.8',
  'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
  'zh-CN,zh;q=0.9',
]

const DEFAULT_HEADERS = {
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Dnt': '1',
}

function getRandomUA() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
}

function getRandomAcceptLang() {
  return ACCEPT_LANGUAGES[Math.floor(Math.random() * ACCEPT_LANGUAGES.length)]
}

function jitter(baseMs, pct = 30) {
  const variance = baseMs * (pct / 100)
  return baseMs + (Math.random() * 2 - 1) * variance
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildHeaders(sourceConfig) {
  const ua = sourceConfig.userAgent || getRandomUA()
  const acceptLang = sourceConfig.acceptLanguage || getRandomAcceptLang()

  const headers = {
    ...DEFAULT_HEADERS,
    'User-Agent': ua,
    'Accept-Language': acceptLang,
  }

  if (sourceConfig.referer) {
    headers['Referer'] = sourceConfig.referer
  }

  if (sourceConfig.origin) {
    headers['Origin'] = sourceConfig.origin
  }

  if (sourceConfig.host) {
    headers['Host'] = sourceConfig.host
  }

  if (sourceConfig.extraHeaders) {
    Object.assign(headers, sourceConfig.extraHeaders)
  }

  return headers
}

async function fetchWithRetry(url, sourceConfig) {
  const maxRetries = sourceConfig.maxRetries ?? 2
  const timeoutMs = sourceConfig.timeout ?? 15000
  let lastError = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const headers = buildHeaders(sourceConfig)

      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal,
        redirect: 'follow',
      })

      clearTimeout(timeout)

      if (response.status === 403 || response.status === 401) {
        throw new Error(`HTTP ${response.status} — 平台拒绝访问，可能需要更新 Cookie 或请求头`)
      }

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || 30
        const waitSec = parseInt(retryAfter, 10) || 30
        console.warn(`  ⚠️ 触发限流 (429)，等待 ${waitSec} 秒...`)
        if (attempt < maxRetries) {
          await sleep(waitSec * 1000)
          continue
        }
        throw new Error(`HTTP 429 — 请求过于频繁，已达最大重试次数`)
      }

      if (response.status >= 500) {
        throw new Error(`HTTP ${response.status} — 服务器错误`)
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const contentType = response.headers.get('content-type') || ''

      if (contentType.includes('application/json')) {
        const text = await response.text()
        if (!text || text.trim().length < 10) {
          throw new Error('响应体为空或过短')
        }
        try {
          return { type: 'json', data: JSON.parse(text) }
        } catch {
          throw new Error('JSON 解析失败')
        }
      }

      const text = await response.text()
      if (!text || text.trim().length < 50) {
        throw new Error('HTML 响应体为空或过短')
      }

      if (text.includes('访问验证') || text.includes('请输入验证码') || text.includes('人机验证')) {
        throw new Error('触发了平台验证码')
      }

      return { type: 'html', data: text }
    } catch (err) {
      clearTimeout(timeout)

      if (err.name === 'AbortError') {
        lastError = new Error(`请求超时 (${timeoutMs}ms)`)
      } else {
        lastError = err
      }

      if (attempt === maxRetries) break

      const backoffMs = Math.min(jitter(2000 * Math.pow(2, attempt)), 30000)
      console.warn(`  重试 ${attempt + 1}/${maxRetries} (${Math.round(backoffMs)}ms): ${lastError.message}`)
      await sleep(backoffMs)
    }
  }

  throw lastError || new Error('未知错误')
}

function normalizeItem(rawItem, sourceConfig) {
  let coverImage = rawItem.coverImage || ''

  return {
    title: (rawItem.title || '').trim(),
    summary: (rawItem.summary || '').trim().slice(0, 200),
    url: rawItem.url || '',
    source: sourceConfig.name,
    sourceId: sourceConfig.id,
    sourceIcon: sourceConfig.icon,
    coverImage,
    category: rawItem.category || '综合',
    hotScore: rawItem.hotScore || 0,
    fetchedAt: new Date().toISOString(),
  }
}

function deduplicate(items) {
  const seen = new Set()
  return items.filter((item) => {
    const key = normalizeUrl(item.url) || item.title
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function normalizeUrl(url) {
  try {
    const u = new URL(url)
    u.searchParams.delete('utm_source')
    u.searchParams.delete('utm_medium')
    u.searchParams.delete('utm_campaign')
    u.searchParams.delete('ref')
    u.searchParams.delete('source')
    u.searchParams.delete('from')
    u.searchParams.delete('spm')
    return `${u.hostname}${u.pathname}${u.search}`
  } catch {
    return url
  }
}

function validateItems(items, sourceConfig) {
  if (items.length === 0) return false

  const validTitles = items.filter((item) => {
    const t = item.title || ''
    return t.length >= 2 && t.length <= 200 && !/^[\s\d,，。.]+$/.test(t)
  })

  if (validTitles.length < items.length * 0.5) {
    console.warn(`  ⚠️ 超过一半数据无效 (${validTitles.length}/${items.length})，可能解析规则失效`)
    return false
  }

  return true
}

async function fetchSource(sourceConfig) {
  console.log(`📥 正在抓取: ${sourceConfig.icon} ${sourceConfig.name}`)

  try {
    const result = await fetchWithRetry(sourceConfig.url, sourceConfig)

    let rawItems = []

    if (result.type === 'json') {
      rawItems = sourceConfig.parse(result.data)
    } else {
      const $ = cheerio.load(result.data)
      rawItems = sourceConfig.parse($)
    }

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      console.warn(`  ⚠️ 解析结果为空，可能接口结构已变更`)
      return []
    }

    const items = rawItems
      .map((item) => normalizeItem(item, sourceConfig))
      .filter((item) => item.title.length > 0)

    if (!validateItems(items, sourceConfig)) {
      return []
    }

    console.log(`  ✅ 获取到 ${items.length} 条`)
    return items
  } catch (err) {
    console.error(`  ❌ 抓取失败: ${err.message}`)
    return []
  }
}

function getDatePath() {
  const now = new Date()
  const year = now.getFullYear().toString()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return { year, month, day }
}

async function main() {
  console.log('🚀 开始抓取热门资讯...')
  console.log(`📅 日期: ${new Date().toISOString()}\n`)

  const allItems = []
  const sourceStats = {}
  let successCount = 0

  for (let i = 0; i < NEWS_SOURCES.length; i++) {
    const source = NEWS_SOURCES[i]
    const items = await fetchSource(source)
    sourceStats[source.id] = {
      name: source.name,
      count: items.length,
    }
    allItems.push(...items)
    if (items.length > 0) successCount++

    if (i < NEWS_SOURCES.length - 1) {
      const delay = jitter(2000, 50)
      await sleep(delay)
    }
  }

  const uniqueItems = deduplicate(allItems)
  uniqueItems.sort((a, b) => b.hotScore - a.hotScore)

  const { year, month, day } = getDatePath()
  const outputDir = resolve(DATA_DIR, year, month)
  const outputPath = resolve(outputDir, `${day}.json`)

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  const outputData = {
    date: `${year}-${month}-${day}`,
    updatedAt: new Date().toISOString(),
    totalCount: uniqueItems.length,
    stats: sourceStats,
    items: uniqueItems,
  }

  writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf-8')

  console.log(`\n📊 汇总统计:`)
  console.log(`  成功平台: ${successCount}/${NEWS_SOURCES.length}`)
  console.log(`  去重前: ${allItems.length} 条`)
  console.log(`  去重后: ${uniqueItems.length} 条`)
  for (const [key, stat] of Object.entries(sourceStats)) {
    const status = stat.count > 0 ? '✅' : '❌'
    console.log(`  ${status} ${key}: ${stat.count} 条`)
  }
  console.log(`\n💾 已保存到: ${outputPath}`)
  console.log('✅ 抓取完成!')
}

main().catch((err) => {
  console.error('💥 抓取过程出错:', err)
  process.exit(1)
})