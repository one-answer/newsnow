interface FreeJkDouyinResponse {
  updateTime?: string
  data?: Array<{
    id?: string | number
    title?: string
    url?: string
    mobileUrl?: string
    hot?: string | number
    timestamp?: string | number
  }>
}

export default defineSource(async () => {
  const res = await $fetch<FreeJkDouyinResponse>("https://api.freejk.com/shuju/hotlist/douyin")
  const items = Array.isArray(res.data) ? res.data : []

  return items
    .filter(item => item.id && item.title)
    .map(item => ({
      id: String(item.id),
      title: item.title!,
      url: item.url || item.mobileUrl || `https://www.douyin.com/hot/${item.id}`,
      extra: {
        hot: item.hot,
        timestamp: item.timestamp,
      },
    }))
})
