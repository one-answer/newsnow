// import type { NewsItem } from "@shared/types"
// import * as cheerio from "cheerio"

// const trending = defineSource(async () => {
//   const baseURL = "https://tophub.today"
//   const html: any = await $fetch("https://tophub.today/n/L4MdA5ldxD")
//   const $ = cheerio.load(html)
//   const $main = $(".Zd-p-Sc > .cc-dc:nth-child(1) > .cc-dc-c > .jc > .jc-c > table > tbody > tr")
//   const news: NewsItem[] = []
//   $main.each((_, el) => {
//     const a = $(el).find(">.al a")
//     const title = a.text().replace(/\n+/g, "").trim()
//     const url = a.attr("href")
//     const hot = $(el).find(">td:nth-child(3)").text().replace(/\s+/g, "").trim()
//     if (url && title) {
//       news.push({
//         url: `${baseURL}${url}`,
//         title,
//         id: url,
//         extra: {
//           info: `${hot}热度`,
//         },
//       })
//     }
//   })
//   return news
// })

// export default defineSource({
//   xiaohongshu: trending,
// })
