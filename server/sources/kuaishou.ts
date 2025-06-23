interface KuaishouRes {
  defaultClient: {
    ROOT_QUERY: {
      "visionHotRank({\"page\":\"home\"})": {
        type: string;
        id: string;
        typename: string;
      };
      [key: string]: any;
    };
    [key: string]: any;
  };
}

interface HotRankData {
  result: number;
  pcursor: string;
  webPageArea: string;
  items: {
    type: string;
    generated: boolean;
    id: string;
    typename: string;
  }[];
}

export default defineSource(async () => {
  // 获取快手首页HTML
  const html = await $fetch("https://www.kuaishou.com/?isHome=1", {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
      'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': "macOS"
    },
  });
  // 提取window.__APOLLO_STATE__中的数据
  const matches = (html as string).match(/window\.__APOLLO_STATE__\s*=\s*(\{.+?\});/);
  if (!matches) {
    throw new Error("无法获取快手热榜数据");
  }

  // 解析JSON数据
  const data: KuaishouRes = JSON.parse(matches[1]);

  // 获取热榜数据ID
  const hotRankId = data.defaultClient.ROOT_QUERY["visionHotRank({\"page\":\"home\"})"].id;

  // 获取热榜列表数据
  const hotRankData = data.defaultClient[hotRankId] as HotRankData;
  // 转换数据格式
  return hotRankData.items.filter(k => data.defaultClient[k.id].tagType !== "置顶").map((item) => {
    // 从id中提取实际的热搜词
    const hotSearchWord = item.id.replace("VisionHotRankItem:", "");

    // 获取具体的热榜项数据
    const hotItem = data.defaultClient[item.id];

    return {
      id: hotSearchWord,
      title: hotItem.name,
      url: `https://www.kuaishou.com/search/video?searchKey=${encodeURIComponent(hotItem.name)}`,
      extra: hotItem.iconUrl
        ? {
          icon: `/api/proxy?img=${encodeURIComponent(hotItem.iconUrl)}`,
        }
        : {},
    };
  });
});
