const hotstock = defineSource(async () => {
  const url = "https://i.news.qq.com/gw/event/pc_hot_ranking_list?ids_hash=&offset=0&page_size=51&appver=15.5_qqnews_7.1.60&rank_id=hot"
  const res: any = await $fetch(url)
  return res.idlist[0].newslist.filter((k: any) => k.commentid).map((k: any) => ({
    id: k.id,
    url: k.url,
    title: k.title
  }))
})

export default defineSource({
  "tengxun": hotstock,
})
