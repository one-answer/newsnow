interface Res {
  data: {
     card_id: string;
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
        cookie: '_xsrf=HB9RKyAZj0m3yrWACodvL3Vf4NHKj59L; _zap=8d95ee68-6890-4fdf-8de6-4f94913ac626; d_c0=YPGT_2YobRqPTu1WrGsgGp681qtx3-yWlx0=|1746782056; __snaker__id=SPLGpw90pueEe3uv; q_c1=21915f10593f4dc2afe6a56b69144640|1746782400000|1746782400000; __zse_ck=004_QvXRL4z0nPmnyHcg28av3Joxi07PXlxXKGNpAOycRelnNii9/A3=SQvXPESTGGvB=l=x4dKpNIBZWkPn47/=U9qPHKXKkazwdgOru0/lzCBpMJztH974J0YxmIOB2Yc/-UwyU4rP57ZNZ6G8w0SycXcTKSww5WVgEAX3xhnuha+VbQ9sxTCOf8KdtndCePrXrkpKR3ezUzK5EJEQK3qhbyQQfQZyZBlhDbJQo+Q4hUlOuMjjSR7vmWLF5ZQ6dkEQI; Hm_lvt_98beee57fd2ef70ccdd5ca52b9740c49=1749550222; HMACCOUNT=4DE1B3FD35C36848; z_c0=2|1:0|10:1749550222|4:z_c0|80:MS4xaDJNMEx3QUFBQUFtQUFBQVlBSlZUWTVTTldtMUwwWHlTSVFNdEdNUDl2NWNlRnhYQXFKZHZBPT0=|f89677d5fc6ff4196ac7aabcaf164ea5a8dad37d5d3e74ea2e4d3ba122b58299; SESSIONID=SOUkwDaTdBZe4aO0PsBqXj3Z26vQCTOMMP6GCIxy7qw; JOID=V1sdAULUUSB9xg6LRpu-fqsVOexRgRV_Hb1M4Ri8FXES-WPCfep9eBLMA4pHYzzWrtcROJRmPFyWKRooe3mbbQU=; osd=UlwWC0rRVit3zguMTZG2e6weM-RUhh51FbhL6hK0EHYZ82vHeuF3cBfLCIBPZjvdpN8UP59sNFmRIhAgfn6QZw0=; tst=h; Hm_lpvt_98beee57fd2ef70ccdd5ca52b9740c49=1750675040; BEC=f7bc18b707cd87fca0d61511d015686f; unlock_ticket=AcDeBhGMSxMmAAAAYAJVTWg1WWgNeBzuupFzCdpevfIBzYvh-B9gWQ=='
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
          url: `https://www.zhihu.com/question/${k.card_id.split('_')[1]}`,
        }
      })
  },
})
