interface Res {
  data: {
    card_id: string;
    card_label?: {
      icon: string;
      night_icon: string;
    };
    target: {
      id: number;
      title: string;
      url: string;
      created: number;
      answer_count: number;
      follower_count: number;
      bound_topic_ids: number[];
      comment_count: number;
      is_following: boolean;
      excerpt: string;
    };
  }[];
}

export default defineSource({
  zhihu: async () => {
    const url = "https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=20&desktop=true";
    const res: Res = await $fetch(url, {
      headers: {
        cookie: '_xsrf=HB9RKyAZj0m3yrWACodvL3Vf4NHKj59L; _zap=8d95ee68-6890-4fdf-8de6-4f94913ac626; d_c0=YPGT_2YobRqPTu1WrGsgGp681qtx3-yWlx0=|1746782056; __snaker__id=SPLGpw90pueEe3uv; q_c1=21915f10593f4dc2afe6a56b69144640|1746782400000|1746782400000; z_c0=2|1:0|10:1752648200|4:z_c0|80:MS4xaDJNMEx3QUFBQUFtQUFBQVlBSlZUUWlZWkduX2h3OFJSdEh5WDIydGpaUEk0OFF2YWJKOTNBPT0=|247c0baf9e9fa20796f72075a41ae03a37140ac01eac3c224c304ae4908e35fe; __zse_ck=004_TCa35nT3wseU9WKOir7mxteD71ATk/mTXytY3y99j3Gd/1OH9YCBoDKWRTgT/bxfOXNcLChP7BLnl2GwS6h3xGVJNj34up9FwFCjzIrYE0b=37pwkrB0WJ0SmMoXpKNk-Lj3d2WYqgYt1PhJPEUQyTGnw+D3XZUUzv3saIgwFylMt9tZyKFMJSM8I2xVam+ImkMG1Blv43nd6JxaxxeRhKxN0vi0ORYa4JhvWqg5hronOeZhQ0yYz6/a9LTzL37NL; BEC=8b4a1b0a664dd5d88434ef53342ae417; unlock_ticket=AcDeBhGMSxMmAAAAYAJVTWxTnGietAbt3ZgD_fCqUh59oCjnkojHgA==; Hm_lvt_98beee57fd2ef70ccdd5ca52b9740c49=1752648200,1753859738,1754016040,1755073637; Hm_lpvt_98beee57fd2ef70ccdd5ca52b9740c49=1755073637; HMACCOUNT=4DE1B3FD35C36848; SESSIONID=1LO7OHsyzHiBqPTy48QPzgxZXky8sBKdt9P3SwLeykd; JOID=VFkWCkjgehurU17UBaedTXSBYbsa1jRelhkRpXafNXDjKAuHfoA-h8xRW9wF5n-ty7TiWyKLd2YJl3uBrrqV4gk=; osd=U1gVB07neximVVnVBqqbSnWCbL0d1zdTkB4QpnuZMnHgJQ2Af4MzgctQWNED4X6uxrLlWiGGcWEIlHaHqbuW7w8=; tst=h'
      }
    });
    return res.data
      .map((k) => {
        return {
          id: k.target.id,
          title: k.target.title,
          extra: {
            icon: k.card_label?.night_icon && `/api/proxy?img=${encodeURIComponent(k.card_label?.night_icon)}`,
          },
          url: `https://www.zhihu.com/question/${k.card_id.split('_')[1]}`,
        };
      });
  },
});
