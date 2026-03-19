interface EastmoneyRankResponse {
  data?: Array<{
    sc?: string
    rk?: number
    rc?: number
    hisRc?: number
  }>
}

interface EastmoneyQuoteResponse {
  data?: {
    diff?: Array<{
      f3?: number
      f12?: string
      f13?: number
      f14?: string
    }>
  }
}

function toSecid(sourceCode: string) {
  if (sourceCode.startsWith("SZ")) return `0.${sourceCode.slice(2)}`
  if (sourceCode.startsWith("SH")) return `1.${sourceCode.slice(2)}`
  return ""
}

function toSymbol(sourceCode: string) {
  if (sourceCode.startsWith("SZ") || sourceCode.startsWith("SH")) return sourceCode
  return ""
}

const hotstock = defineSource(async () => {
  const rankRes = await $fetch<EastmoneyRankResponse>("https://emappdata.eastmoney.com/stockrank/getAllCurrentList", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      appId: "appId01",
      globalId: "786e4c21-70dc-435a-93bb-38",
      marketType: "",
      pageNo: 1,
      pageSize: 30,
    },
  })

  const ranked = Array.isArray(rankRes.data) ? rankRes.data.filter(item => item.sc).slice(0, 30) : []
  if (!ranked.length) return []

  const secids = ranked
    .map(item => toSecid(item.sc!))
    .filter(Boolean)
    .join(",")

  if (!secids) return []

  const quoteRes = await $fetch<EastmoneyQuoteResponse>(`https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f12,f13,f14,f3&secids=${secids}`)
  const quotes = Array.isArray(quoteRes.data?.diff) ? quoteRes.data.diff : []
  const quoteMap = new Map(quotes.map(item => [`${item.f13}.${item.f12}`, item]))

  return ranked.map((item) => {
    const secid = toSecid(item.sc!)
    const quote = quoteMap.get(secid)
    const symbol = toSymbol(item.sc!)

    return {
      id: item.sc!,
      url: symbol ? `https://xueqiu.com/S/${symbol}` : `https://xueqiu.com`,
      title: quote?.f14 || item.sc!,
      extra: {
        info: typeof quote?.f3 === "number" ? `${quote.f3}%` : undefined,
      },
    }
  })
})

export default defineSource({
  "xueqiu": hotstock,
  "xueqiu-hotstock": hotstock,
})
