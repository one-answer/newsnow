import * as cheerio from "cheerio"

interface NewrankPageData {
  props?: {
    pageProps?: {
      rankData?: {
        list?: Array<{
          userid?: string
          nickName?: string
          headUrl?: string
        }>
      }
    }
  }
}

export default defineSource(async () => {
  const html = await $fetch<string>("https://www.newrank.cn/rankfans/xiaohongshu", {
    responseType: "text",
  })
  const $ = cheerio.load(html)
  const nextData = $("#__NEXT_DATA__").text().trim()

  if (!nextData) return []

  const parsed = JSON.parse(nextData) as NewrankPageData
  const list = parsed.props?.pageProps?.rankData?.list ?? []

  return list
    .filter(k => k.userid && k.nickName)
    .map(k => ({
      id: k.userid!,
      title: k.nickName!,
      extra: {
        icon: k.headUrl,
      },
      url: `https://www.newrank.cn/profile/xiaohongshu/${k.userid}?from=ranklist`,
    }))
})
