import * as cheerio from "cheerio";
export default defineSource(async () => {
  const html: any = await $fetch("https://bbs.hupu.com/all-gambia", {
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
    if (scriptContent.includes("window.$$data")) {
      const match = scriptContent.split("window.$$data=")[1]
      if (match) {
        // 将字符串转换为对象
        data = JSON.parse(match)
      }
    }
  }
  if (!data) {
    throw new Error('错误')
  }

  const threads = data.pageData.threads;

  return threads.map((item: any) => {
    return {
      id: item.tid,
      title: item.title,
      url: `https://bbs.hupu.com${item.url}`
    }
  })
})
