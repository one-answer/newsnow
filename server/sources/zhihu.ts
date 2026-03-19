import * as cheerio from "cheerio"

export default defineSource(async () => {
  // Zhihu's old topstory API now returns 401 without a valid logged-in session.
  // Use a public mirror page instead of shipping an expiring cookie in the repo.
  const html = await $fetch<string>("https://www.xpaihang.com/platform/zhihu", {
    headers: {
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    },
    responseType: "text",
  })

  const $ = cheerio.load(html)
  const items: {
    id: string
    title: string
    url: string
  }[] = []
  const seen = new Set<string>()

  $("a[href^=\"https://www.zhihu.com/question/\"]").each((_, element) => {
    const url = $(element).attr("href")?.trim()
    const title = $(element).text().trim()

    if (!url || !title || seen.has(url)) return

    seen.add(url)
    items.push({
      id: url.split("/question/")[1],
      title,
      url,
    })
  })

  if (!items.length) throw new Error("Cannot fetch zhihu hot list")

  return items.slice(0, 20)
})
