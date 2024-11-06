import type { NewsItem } from "@shared/types"
import * as cheerio from "cheerio"

export default defineSource(async () => {
  const baseURL = "https://weread.qq.com"
  const html: any = await $fetch("https://weread.qq.com/web/category/hot_search", {
    headers: {
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
      "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
    },
  })
  const $ = cheerio.load(html)
  const $main = $(".ranking_content_bookList > .wr_bookList_item")
  const news: NewsItem[] = []
  $main.each((_, el) => {
    const a = $(el).find(">a")
    const title = $(el).find(">.wr_bookList_item_container .wr_bookList_item_title").text().replace(/\n+/g, "").trim()
    const url = a.attr("href")
    const icon = $(el).find(">.wr_bookList_item_container .book_rating_item_label_number_image")
    const iconUrl = icon.attr("src")
    if (url && title) {
      news.push({
        url: `${baseURL}${url}`,
        title,
        id: url,
        extra: {
          icon: iconUrl && `/api/proxy?img=${encodeURIComponent(iconUrl)}`,
        },
      })
    }
  })
  return news
})
