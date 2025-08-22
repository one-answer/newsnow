interface StockRes {
  data: {
    items:
    {
      code: string
      name: string
      percent: number
      exchange: string
      // 1
      ad: number
    }[]

  }
}

const hotstock = defineSource(async () => {
  const url = "https://stock.xueqiu.com/v5/stock/hot_stock/list.json?size=30&_type=10&type=10"
  const cookie = (await $fetch.raw("https://xueqiu.com/?md5__1038=28178cb220-kS861Td6gTw0elSUixTppTtxSUk%2F6pTZIbXdiHSTOkT26MSJx72JXppGW8SY%2F2TJrTI6T4Tv6HM%2FT2UPITPUJBT7UPziTliTdT1iJnh37M%3DP6t3TWTlSTsTicTtTTRTTi6J0TD6HeTlIKlThZ63kHvTOUJRTMczgIcC07iS07UlOpp%2FmISlJgZvGQry0gyGmsyviT")).headers.getSetCookie()
  const res: StockRes = await $fetch(url, {
    headers: {
      cookie: cookie.join("; "),
    },
  })
  return res.data.items.filter(k => !k.ad).map(k => ({
    id: k.code,
    url: `https://xueqiu.com/s/${k.code}`,
    title: k.name,
    extra: {
      info: `${k.percent}% ${k.exchange}`,
    },
  }))
})

export default defineSource({
  "xueqiu": hotstock,
  "xueqiu-hotstock": hotstock,
})
