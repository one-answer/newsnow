
export default defineSource(async () => {
  const res: any = await $fetch('https://odin.sohu.com/odin/api/blockdata', {
    headers: {
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
    },
    method: 'POST',
    body: {
      "pvId": "1732691505561_HzO5zxa",
      "pageId": "1732691505644_24071223195_WWD",
      "mainContent": {
        "productType": "13",
        "productId": "327",
        "secureScore": "50",
        "categoryId": "47",
        "adTags": "11111111",
        "authorId": 121135924
      },
      "resourceList": [
        {
          "tplCompKey": "MasonryEjs_4_0_pc",
          "isServerRender": true,
          "isSingleAd": false,
          "content": {
            "spm": "smpc.channel_173.block5_217_LbD31Z_data1_fd",
            "productType": "13",
            "productId": "327",
            "page": 1,
            "size": 20,
            "pro": "0,1",
            "innerTag": "channel",
            "feedType": "XTOPIC_SYNTHETICAL",
            "view": "dynamicFeedMode",
            "requestId": "1732691505597v1zD8GE_327"
          },
          "adInfo": {
            "posCode": 10193,
            "rule": 2,
            "begin": 6,
            "turn": 6,
            "number": 1
          },
          "context": {}
        }
      ]
    }
  });
  return res.data.MasonryEjs_4_0_pc.list.map((v: any) => ({
    id: `https://www.sohu.com${v.url}`,
    title: v.title,
    url: `https://www.sohu.com${v.url}`,
  }));
});
