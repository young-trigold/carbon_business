import { Article, connectDataBase } from 'database';
import dayjs from 'dayjs';
import { Article as ArticleType, getRandomNumber, sleep } from 'lib';
import puppeteer from 'puppeteer-core';

await connectDataBase('爬虫：article');

const origin = 'www.sceex.com.cn';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
});

const page = await browser.newPage();

const getArticlesByPageIndex = async (pageIndex: number) => {
  const path = `/go.htm?k=xin_wen_zi_xun&url=news_center&pageIndex=${pageIndex}`;
  const targetURL = `https://${origin}${path}`;
  await page.goto(targetURL, {
    waitUntil: 'domcontentloaded',
  });

  const articles = await page.$$eval(
    '.sx_content3_content_left > .sx_content3_content_left_ul1 > li > a',
    (linkElements) => {
      const result: Omit<ArticleType, 'id'>[] = linkElements.map((linkElement) => {
        console.debug(linkElement.querySelector('p.wz_desc')?.textContent);
        return {
          title: linkElement.title.trim(),
          subtitle: linkElement.querySelector('p.wz_desc')?.textContent?.trim() ?? '',
          link: linkElement.href,
          backgroundImgURL: linkElement.querySelector('img')?.src ?? '',
          date:
            linkElement.querySelectorAll('p.wz_time > span')[1]?.textContent?.slice(3) ??
            dayjs().format('YYYY-MM-DD'),
          source:
            linkElement.querySelectorAll('p.wz_time > span')[0]?.textContent ?? '四川联合交易所',
        };
      });
      return result;
    },
  );

  return articles;
};

let pageIndex = 1;
const maxPageIndex = 644;

while (pageIndex <= maxPageIndex) {
  const articlesByPageIndex = await getArticlesByPageIndex(pageIndex);
  console.debug(`第 ${pageIndex} 页数据已经获取完成`);
  await Article.insertMany(articlesByPageIndex);
  console.debug(`第 ${pageIndex} 页数据已经插入数据库`);
  await sleep(getRandomNumber(600, 1200));
  pageIndex += 1;
}

await browser.close();
