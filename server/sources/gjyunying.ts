import type { NewsItem } from "@shared/types";
import * as cheerio from "cheerio";

export default defineSource(async () => {
  const html: any = await $fetch('https://www.gjyunying.com/front/cs/03', {
    headers: {
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
    },
  });
  const $ = cheerio.load(html);
  const $main = $(".k-polular-list > li");
  const news: NewsItem[] = [];
  $main.each((_, el) => {
    const a = $(el).find("a");
    const title = $(a).find('p').text().replace(/\n+/g, "").trim();
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
