import type { NewsItem } from "@shared/types"
import * as cheerio from "cheerio"

export default defineSource(async () => {
  const baseURL = "https://weread.qq.com/web/category/hot_search"
  const html: any = await $fetch("https://weread.qq.com/web/category/hot_search", {
    headers: {
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    },
  })
  const $ = cheerio.load(html)
  const $main = $("script")
  let obj: any = {}
  const news: NewsItem[] = []

  for (let i = 0; i < $main.length; i++) {
    const scriptContent = $($main[i]).text()
    if (scriptContent.includes("window.__INITIAL_STATE__")) {
      // 使用正则表达式提取对象内容
      const regex = ";(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());"
      const match = scriptContent.split(regex)[0].split("window.__INITIAL_STATE__=")[1]
      if (match) {
        // 将字符串转换为对象
        obj = JSON.parse(match)
      }
    }
  }
  obj.categoryStoreModule?.categoryBookList.forEach((v: any) => {
    news.push({
      url: encodeURIComponent(baseURL),
      title: v.bookInfo.title,
      id: v.bookInfo.bookId,
      extra: {
        icon: {
          url: `/api/proxy?img=${encodeURIComponent(`https://weread-1258476243.file.myqcloud.com/miniprogram/assets/reader/newRatings_${Math.floor(v.bookInfo.newRating / 100) * 100}.png`)}`,
          scale: 1,
        },
      },
    })
  })
  return news
})
