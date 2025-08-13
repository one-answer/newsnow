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
  const cookie = (await $fetch.raw("https://xueqiu.com/?md5__1038=2840ce7d37-aYX55duZaZSsUjYylbXSduLaaqeapwO3CucYl2sXdRXXuS5UXKdvUPvXsXxuF0XylLuasuIuvq0u8uubDuBKiwuAKSXvudZuDyUayBt05ZirucziDiUy3ul%2Fs3iydqzXwt0yPgUT0msi75VC5yVscAuDdAaCwA5Rl5yilSwu2FXbathyQzu")).headers.getSetCookie()
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
