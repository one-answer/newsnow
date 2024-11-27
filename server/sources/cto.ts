import type { NewsItem } from "@shared/types";
import * as cheerio from "cheerio";

export default defineSource(async () => {
  const html: any = await $fetch('https://www.51cto.com', {
    headers: {
      "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "cookie": "www51cto=92915BF4B693AE1328100ADC29F129D9rLun; tfstk=fR2j1Dxg-PeyrDrSSjIrd8BU1Fk18r6e5hiTxlp2XxHvfPazRfdxMZmT54aiujkYg5i_8oUssi0ZWVaaXSSPL9r0mADT5wWFLh-fqYyjWFktbJ1Whw7FLT5v2A_f85lWjckSj4nvHjnAVUnsyddYWqhJyDinBVUtBgG-bc-xXdhv2UnpPfvj4igucgah4VAvSVqxPpEzFmhDio3WQdy7SjgL5499B8ibqMgF4KBIySPT3YeAyeD8x7zxVv66f0NQ2xnbS9vmHkE86jw1_H0gNuFEN7xVm0wbARiIwUIjS-zbCj2d8L0YN82s377XLVcTa-c33apjpWqq35URXd3_wcIP0puI6oO6VXvtV2S5VCAajCPFzWeyIocxq07NVgOUjjnoV0j5VCVxM0mktgsWtAf..; __tst_status=1723479049#; _ourplusFirstTime=124-11-21-14-33-23; Hm_lvt_110fc9b2e1cae4d110b7959ee4f27e3b=1732170807; HMACCOUNT=2B2F4545B434FE53; _bl_uid=gqmp4314q6yxhnrwzxw50vvetLp5; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22190a7c8e5cb783-0b23e3b767db48-19525637-1296000-190a7c8e5cc273b%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22%24device_id%22%3A%22190a7c8e5cb783-0b23e3b767db48-19525637-1296000-190a7c8e5cc273b%22%7D; _ourplusReturnCount=43; _ourplusReturnTime=124-11-27-17-12-39; wwwtoken=QVFCU1ZBOENBd0ZUQ1ZZRUlHVjlHeVo3YWxNT1dGWQ; wwwtoken_time=1732702359; Hm_lpvt_110fc9b2e1cae4d110b7959ee4f27e3b=1732698759"
    },
  });
  const $ = cheerio.load(html);
  const $main = $(".list_details > .link-every");
  const news: NewsItem[] = [];
  $main.each((_, el) => {
    const a = $(el).find(".every_item>a");
    const title = a.text().replace(/\n+/g, "").trim();
    const url = a.attr("href");
    if (url && title) {
      news.push({
        url,
        title,
        id: url,
      });
    }
  });
  return news;
});
