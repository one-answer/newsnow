export default defineSource(async () => {
  const url = "https://www.newrank.cn/_next/data/QAEFxhZtUhJFXHbJ3vkQa/rankfans/xiaohongshu.json?slug=xiaohongshu"
  const res: any = await $fetch(url)
  return res.pageProps.rankData.list
    .map((k: any) => {
      return {
        id: k.userid,
        title: k.nickName,
        extra: {
          icon: k.headUrl,
        },
        url: `https://www.newrank.cn/profile/xiaohongshu/${k.userid}?from=ranklist`,
      }
    })
})
