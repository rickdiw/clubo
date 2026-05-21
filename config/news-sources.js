const NEWS_SOURCES = [
  {
    id: 'weibo',
    name: '微博热搜',
    icon: '🔥',
    type: 'json',
    url: 'https://weibo.com/ajax/side/hotSearch',
    referer: 'https://weibo.com/',
    origin: 'https://weibo.com',
    host: 'weibo.com',
    maxRetries: 2,
    timeout: 12000,
    parse: (data) => {
      if (!data?.data?.realtime) return []
      return data.data.realtime.slice(0, 30).map((item) => ({
        title: item.word || item.note || '',
        url: `https://s.weibo.com/weibo?q=${encodeURIComponent(item.word || item.note || '')}`,
        hotScore: item.num || item.raw_hot || 0,
        category: item.category || '热搜',
        coverImage: item.pic || item.pic_url || item.image || '',
      }))
    },
  },

  {
    id: 'zhihu',
    name: '知乎热榜',
    icon: '💡',
    type: 'html',
    url: 'https://tophub.today/n/mproPpoq6O',
    referer: 'https://tophub.today/',
    origin: 'https://tophub.today',
    host: 'tophub.today',
    maxRetries: 3,
    timeout: 15000,
    parse: ($) => {
      const items = []
      $('table tr').each((_, el) => {
        const $el = $(el)
        const tds = $el.find('td')
        if (tds.length < 3) return

        const titleEl = $(tds[2]).find('a').first()
        const title = titleEl.text().trim()
        const url = titleEl.attr('href') || ''
        const scoreText = $(tds[2]).find('.item-desc').text().trim()

        const imgEl = $(tds[1]).find('img').first()
        const coverImage = imgEl.attr('src') || ''

        if (title && title.length > 1) {
          items.push({
            title,
            url: url || `https://www.zhihu.com/search?type=content&q=${encodeURIComponent(title)}`,
            hotScore: parseHotNumber(scoreText),
            category: '热搜',
            coverImage,
          })
        }
      })
      return items.slice(0, 30)
    },
  },

  {
    id: 'baidu',
    name: '百度热搜',
    icon: '🔍',
    type: 'html',
    url: 'https://top.baidu.com/board?tab=realtime',
    referer: 'https://top.baidu.com/',
    origin: 'https://top.baidu.com',
    host: 'top.baidu.com',
    maxRetries: 2,
    timeout: 15000,
    parse: ($) => {
      const items = []
      $('.category-wrap_iQLoo .content_1YWBm').each((_, el) => {
        const $el = $(el)
        const title = $el.find('.c-single-text-ellipsis').text().trim()
        const hotScore = $el.find('.hot-index_1Bl1a').text().trim()
        const desc = $el.find('.desc_3CTjT').text().trim()

        if (title) {
          items.push({
            title: title,
            url: `https://www.baidu.com/s?wd=${encodeURIComponent(title)}`,
            hotScore: parseHotNumber(hotScore),
            summary: desc,
            category: '热搜',
          })
        }
      })
      return items.slice(0, 30)
    },
  },

  {
    id: 'toutiao',
    name: '今日头条',
    icon: '📰',
    type: 'json',
    url: 'https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc',
    referer: 'https://www.toutiao.com/',
    origin: 'https://www.toutiao.com',
    host: 'www.toutiao.com',
    maxRetries: 3,
    timeout: 15000,
    parse: (data) => {
      if (!data?.data) return []
      const list = Array.isArray(data.data) ? data.data : (data.data.news || data.data.list || [])
      return list.slice(0, 30).map((item) => ({
        title: item.Title || item.title || item.name || '',
        url: item.Url || item.url || `https://www.toutiao.com/trending/${item.ClusterId || ''}`,
        hotScore: parseInt(item.HotValue || item.hot || item.Heat || '0', 10) || 0,
        summary: item.Abstract || item.Label || item.desc || '',
        coverImage: item.Image || item.image || item.ImageUrl || item.image_url || item.cover || item.pic || item.img || item.thumbnail || '',
      }))
    },
  },

  {
    id: 'tencent',
    name: '腾讯新闻',
    icon: '📋',
    type: 'json',
    url: 'https://r.inews.qq.com/gw/event/hot_ranking_list?page_size=50',
    referer: 'https://news.qq.com/',
    origin: 'https://news.qq.com',
    host: 'r.inews.qq.com',
    maxRetries: 3,
    timeout: 15000,
    parse: (data) => {
      if (!data?.idlist) return []
      const allItems = data.idlist.flatMap((group) => group.newslist || [])
      return allItems
        .filter((item) => item.articletype !== '560' && item.title && item.title.length > 1)
        .slice(0, 30)
        .map((item) => {
          const thumbArr = item.thumbnails_qqnews_photo || item.thumbnails_qqnews || item.thumbnails_big || item.bigImage || item.thumbnails || []
          const coverImage = Array.isArray(thumbArr) && thumbArr.length > 0 ? thumbArr[0] : (item.miniProShareImage || '')
          const hotScore = item.hotEvent?.hotScore || parseInt(item.readCount || '0', 10) || 0
          return {
            title: item.title || '',
            url: item.url || item.surl || `https://view.inews.qq.com/a/${item.id || ''}`,
            hotScore,
            summary: item.abstract || item.desc || item.nlpAbstract || '',
            category: item.chlname || item.cateName || item.channel || '',
            coverImage,
          }
        })
    },
  },

  {
    id: 'thepaper',
    name: '澎湃新闻',
    icon: '📰',
    type: 'json',
    url: 'https://cache.thepaper.cn/contentapi/wwwIndex/rightSidebar',
    referer: 'https://www.thepaper.cn/',
    origin: 'https://www.thepaper.cn',
    host: 'cache.thepaper.cn',
    maxRetries: 2,
    timeout: 15000,
    parse: (data) => {
      if (!data?.data?.hotNews) return []
      return data.data.hotNews.slice(0, 30).map((item) => ({
        title: item.name || item.title || '',
        url: item.contId ? `https://www.thepaper.cn/newsDetail_forward_${item.contId}` : (item.link || ''),
        hotScore: parseInt(item.interactionNum || item.praiseTimes || '0', 10) || 0,
        summary: item.brief || item.summary || '',
        category: item.tag || '综合',
        coverImage: item.smallPic || item.pic || item.img || item.image || '',
      }))
    },
  },
]

function parseHotNumber(str) {
  if (!str) return 0
  const match = str.match(/[\d.]+/)
  if (!match) return 0
  let num = parseFloat(match[0])
  if (str.includes('万')) num *= 10000
  return Math.round(num)
}

export default NEWS_SOURCES