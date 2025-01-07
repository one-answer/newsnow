import * as cheerio from "cheerio";

export default defineSource(async () => {
  const html: any = await $fetch("https://www.ifeng.com", {
    headers: {
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\""
    },
  })
  const $ = cheerio.load(html)
  // 提取window.$$data中的数据
  const $main = $("script")
  let data: any = null

  for (let i = 0; i < $main.length; i++) {
    const scriptContent = $($main[i]).text()
    if (scriptContent.includes("var allData")) {
      const match = scriptContent.split("var allData = ")[1].split('var adKeys =')[0]
      if (match) {
        // 将字符串转换为对象
        data = JSON.parse(match.replace(/;\n /g, ''))
      }
    }
  }
  if (!data) {
    throw new Error(html)
  }

  const threads = data.hotNews1;

  return threads.map((item: any) => {
    return {
      id: item.url,
      title: item.title,
      url: item.url
    }
  })
})
