interface Res {
  data: {
    card_label?: {
      icon: string
      night_icon: string
    }
    target: {
      id: number
      title: string
      url: string
      created: number
      answer_count: number
      follower_count: number
      bound_topic_ids: number[]
      comment_count: number
      is_following: boolean
      excerpt: string
    }
  }[]
}

export default defineSource({
  zhihu: async () => {
    const url = "https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=20&desktop=true"
    const res: Res = await $fetch(url, {
      headers: {
        cookie: 'token=8C47CFB63ABAEC983908E6DA520F41D0; atoken=8C47CFB63ABAEC983908E6DA520F41D0; atoken_expired_in=5184000; client_id=BA2470AAA385FBE183BA905DE8371991; captcha_session_v2=2|1:0|10:1746783627|18:captcha_session_v2|88:M3JyMUZpcDVITm5TYk85akc1N05oNkVDZ1g0d1dPZ21yMEFJeVRhaHNWNEVoR3lkSFBZOUxsWDVzWklYb1RzSg==|83bc909131f09f3d7be00c409661ebd0ce2a11dc155fd230cbf780b755a001de; z_c0=2|1:0|10:1746783641|4:z_c0|92:Mi4xaDJNMEx3QUFBQUJnOFpQX1ppaHRHaGNBQUFCZ0FsVk5seHNMYVFDOUZqLWpHbFA0RnFJTzBoSlEta3dVNG5mck13|044f8381d67fec89aa03e8ba57813580d35913e8a6e02add20a83cc23b438a27; unlock_ticket=AcDeBhGMSxMXAAAAYAJVTaLUHWijMgx6mHkHsmt3SVzr4u7U3MMsgw==; Hm_lpvt_98beee57fd2ef70ccdd5ca52b9740c49=1746783648; BEC=b7b0f394f3fd074c6bdd2ebbdd598b4e; tst=r'
      }
    })
    return res.data
      .map((k) => {
        return {
          id: k.target.id,
          title: k.target.title,
          extra: {
            icon: k.card_label?.night_icon && `/api/proxy?img=${encodeURIComponent(k.card_label?.night_icon)}`,
          },
          url: `https://www.zhihu.com/question/${k.target.id}`,
        }
      })
  },
})
