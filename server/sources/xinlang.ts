import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const baseURL = "https://www.sina.com.cn/"
  const html: any = await $fetch(baseURL, {
    headers: {
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\""
    },
  })
  const $ = cheerio.load(html)
  const $main = $("div[blktitle=娱乐] li")
  const news: NewsItem[] = []
  $main.each((_, el) => {
    const a = $(el).find("a").first()
    const url = a.attr("href")
    const title = a.text()
    if (url && title) {
      news.push({
        url,
        title,
        id: url,
      })
    }
  })
  return news
})
