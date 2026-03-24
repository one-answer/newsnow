import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

function parsePubDate(href: string, timeText: string) {
  const match = href.match(/story(\d{4})(\d{2})(\d{2})-\d+/)
  if (!match) return undefined

  const [, year, month, day] = match
  const time = timeText.trim()
  if (!/^\d{2}:\d{2}$/.test(time)) return undefined

  return new Date(`${year}-${month}-${day}T${time}:00+08:00`).valueOf()
}

export default defineSource(async () => {
  const html = await $fetch<string>("https://www.zaobao.com/realtime", {
    responseType: "text",
  })

  const $ = cheerio.load(html)
  const news: NewsItem[] = []
  const seen = new Set<string>()

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href")?.trim()
    const text = $(el).text().replace(/\s+/g, " ").trim()
    if (!href || seen.has(href)) return
    if (!/^\/(?:news|finance)\/.+\/story\d{8}-\d+/.test(href)) return

    const time = text.slice(0, 5)
    const title = text.slice(5).trim()
    if (!/^\d{2}:\d{2}$/.test(time)) return
    if (!title) return

    seen.add(href)
    news.push({
      id: href,
      title,
      url: `https://www.zaobao.com${href}`,
      pubDate: parsePubDate(href, time),
    })
  })

  return news.sort((a, b) => (b.pubDate ?? 0) - (a.pubDate ?? 0))
})
