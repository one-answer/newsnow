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
        cookie: '_xsrf=HB9RKyAZj0m3yrWACodvL3Vf4NHKj59L; _zap=8d95ee68-6890-4fdf-8de6-4f94913ac626; d_c0=YPGT_2YobRqPTu1WrGsgGp681qtx3-yWlx0=|1746782056; __snaker__id=SPLGpw90pueEe3uv; q_c1=21915f10593f4dc2afe6a56b69144640|1746782400000|1746782400000; __zse_ck=004_kC3ldrRDhHJbNWs6Gn7tvC/USVXaLmkogGlPVdbX2Huq=OTjcqseCvZ5Ref6JsNkkzJkApoFQQBu7JeE2WAa6B3H7Yy8FNaOjSYmso26VStXiDBWc=sNukRG12gRt5tS-yYOUh9pyFh+vAKBT9cFt6x9TsNACx1VUQlQ+mmrXN7f0mR/UR5+7FVSCFkHEk8Nbr2pCI+SjGNkgegsLYd/2XtMbwauM90nkV1Bxk3LZEcNbrGV6Dkis4h1+gGfkbojS; Hm_lvt_98beee57fd2ef70ccdd5ca52b9740c49=1753859738,1754016040,1755073637,1755495387; HMACCOUNT=4DE1B3FD35C36848; z_c0=2|1:0|10:1755495387|4:z_c0|80:MS4xaDJNMEx3QUFBQUFtQUFBQVlBSlZUZHNKa0duRUx6Sm83Q3NUMlB5S0RKVk9nc0JGajNGSGN3PT0=|db45f138dfe01a6159cfed45a60f2a5ae9e829a1a331c4c0e4d1bec15bc3728c; tst=h; SESSIONID=lGaG4tRHLSmS3NiRUcFcOUOrMEov7H4rtSZhvFpOFcE; JOID=U1oXBUixGGy-FnKjEf78PG3FRc8I3l8J_CAF8V3_SAHpID7JQ5kexdEXcacQJQPo2ojueigETp8bGBh5NlTUlic=; osd=UlAdB0OwEma8HXOpG_z3PWfPR8QJ1FUL9yEP-1_0SQvjIjXISZMcztAde6UbJAni2IPvcCIGRZ4REhpyN17elCw=; Hm_lpvt_98beee57fd2ef70ccdd5ca52b9740c49=1755841082; BEC=69a31c4b51f80d1feefe6d6caeac6056; unlock_ticket=AcDeBhGMSxMmAAAAYAJVTUIJqGjBN0y2se1_jx4Nb3T8gqZr6VUc9Q=='
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
