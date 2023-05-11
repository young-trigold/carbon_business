import { Article, connectDataBase } from 'database';
import dayjs from 'dayjs';
import { existsSync, mkdirSync } from 'fs';
import { readFile, readdir, unlink, writeFile } from 'fs/promises';
import { Article as ArticleType, getRandomNumber, sleep } from 'lib';
import puppeteer, { Browser, Page } from 'puppeteer-core';

const origin = 'www.sceex.com.cn';

class Crawler {
  #latestDateForDatabase: string = dayjs().format('YYYY-MM-DD');
  #latestDateForTargetWebsite: string = dayjs().format('YYYY-MM-DD');
  #time = dayjs().format('YYYY-MM-DD HH:mm');
  #browser: Browser | null = null;
  #page: Page | null = null;

  async init() {
    this.#browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    });
    this.#page = await this.#browser.newPage();
    await connectDataBase('爬虫：article');
  }

  async #isSynced() {
    this.#time = dayjs().format('YYYY-MM-DD HH:mm');
    const getDateOfLatestDataInDatabase = async () => {
      const articles = await Article.find({ ownBySelf: false }).sort({ date: -1 });
      const date = articles[0].date as string;
      this.#latestDateForDatabase = date;
      return date;
    };

    const getDateOfLatestDataInTargetWebsite = async () => {
      const path = `/go.htm?k=xin_wen_zi_xun&url=news_center&pageIndex=1`;
      const targetURL = `https://${origin}${path}`;
      await this.#page!.goto(targetURL, {
        waitUntil: 'domcontentloaded',
      });
      const articles = await this.#page!.$$eval(
        '.sx_content3_content_left > .sx_content3_content_left_ul1 > li > a',
        (linkElements) => {
          const result: Omit<ArticleType, 'id'>[] = linkElements.map((linkElement) => {
            console.debug(linkElement.querySelector('p.wz_desc')?.textContent);
            return {
              ownBySelf: false,
              title: linkElement.title.trim(),
              subtitle: linkElement.querySelector('p.wz_desc')?.textContent?.trim() ?? '',
              link: linkElement.href,
              backgroundImgURL: linkElement.querySelector('img')?.src ?? '',
              date:
                linkElement.querySelectorAll('p.wz_time > span')[1]?.textContent?.slice(3) ??
                dayjs().format('YYYY-MM-DD'),
              source:
                linkElement.querySelectorAll('p.wz_time > span')[0]?.textContent ??
                '四川联合交易所',
            };
          });
          return result;
        },
      );
      this.#latestDateForTargetWebsite = articles[0].date;
      return articles[0].date;
    };

    const dateStrings = await Promise.all([
      getDateOfLatestDataInDatabase(),
      getDateOfLatestDataInTargetWebsite(),
    ]);

    console.log('数据库文章最新日期:', dateStrings[0]);
    console.log('目标网站文章最新日期:', dateStrings[1]);
    const result = new Date(dateStrings[0]).getTime() >= new Date(dateStrings[1]).getTime();
    if (result) console.log(this.#time, '文章已经同步完成');
    else console.log(this.#time, '文章还未同步');
    return result;
  }

  async #fetchData() {
    const pathToArticles = './articles';
    if (!existsSync(pathToArticles)) {
      console.log('保存文章文件夹不存在，正在创建');
      try {
        mkdirSync(pathToArticles, {
          recursive: true,
        });
        console.log('保存文章文件夹创建成功');
      } catch (error) {
        console.log('保存文章文件夹创建失败');
        console.log(error);
      }
    }

    const getDataByPageIndex = async (pageIndex: number) => {
      const path = `/go.htm?k=xin_wen_zi_xun&url=news_center&pageIndex=${pageIndex}`;
      const targetURL = `https://${origin}${path}`;
      await this.#page?.goto(targetURL, {
        waitUntil: 'domcontentloaded',
      });

      const articles = await this.#page!.$$eval(
        '.sx_content3_content_left > .sx_content3_content_left_ul1 > li > a',
        (linkElements) => {
          const result: Omit<ArticleType, 'id'>[] = linkElements?.map((linkElement) => {
            console.debug(linkElement.querySelector('p.wz_desc')?.textContent);
            return {
              ownBySelf: false,
              title: linkElement.title.trim(),
              subtitle: linkElement.querySelector('p.wz_desc')?.textContent?.trim() ?? '',
              link: linkElement.href,
              backgroundImgURL: linkElement.querySelector('img')?.src ?? '',
              date:
                linkElement.querySelectorAll('p.wz_time > span')[1]?.textContent?.slice(3) ??
                dayjs().format('YYYY-MM-DD'),
              source:
                linkElement.querySelectorAll('p.wz_time > span')[0]?.textContent ??
                '四川联合交易所',
            };
          });
          return result;
        },
      );

      return articles;
    };

    let pageIndex = 1;

    while (true) {
      console.log(`第 ${pageIndex} 次爬取开始`);
      const path = `./articles/carbon_business_article_by_page_index_${String(pageIndex).padStart(
        4,
        '0',
      )}.json`;
      const start = performance.now();
      const carbonBusinessArticlesByPageIndex = await getDataByPageIndex(pageIndex);
      console.debug(carbonBusinessArticlesByPageIndex);
      console.log(`第${pageIndex}页文章已爬取`);
      await writeFile(path, JSON.stringify(carbonBusinessArticlesByPageIndex));
      console.log(`第${pageIndex}页文章已存放到文件`);
      await sleep(getRandomNumber(600, 1200));
      console.log(`本次用时：${performance.now() - start} ms`);

      const finished = () =>
        !carbonBusinessArticlesByPageIndex ||
        carbonBusinessArticlesByPageIndex.length === 0 ||
        carbonBusinessArticlesByPageIndex.some(
          (article) =>
            new Date(article.date).getTime() <= new Date(this.#latestDateForDatabase).getTime(),
        );

      if (finished()) {
        console.log(`爬取完成，共爬取到 ${pageIndex} 页文章`);
        break;
      }

      pageIndex += 1;
    }
  }

  async #insertData() {
    const insertDataByFile = async (fileName: string) => {
      const readEachFile = async (fileName: string) => {
        const path = `./articles/${fileName}`;
        const buffer = await readFile(path);
        const content = buffer.toString();
        const articles = JSON.parse(content) as ArticleType[];
        return articles;
      };

      const articles = await readEachFile(fileName);
      articles
        .filter(
          (article) =>
            new Date(article.date).getTime() > new Date(this.#latestDateForDatabase).getTime(),
        )
        .forEach(async (article) => {
          const newArticle = new Article({
            ...article,
          });

          try {
            await newArticle.save();
          } catch (error) {
            console.error(error);
          }
        });
      console.log(`文章${fileName}已插入数据库`);
    };

    const fileNames = await readdir('./articles');
    fileNames.forEach(insertDataByFile);
    console.log('所有文章插入完成');
    await Promise.all(fileNames.map((fileName) => unlink(`./articles/${fileName}`)));
    console.log('文章文件已经全部清除');
    console.log(this.#time, '本次同步完成');
  }

  async work() {
    const crawl = async () => {
      if (!(await this.#isSynced())) {
        await this.#fetchData();
        await this.#insertData();
        await this.#browser?.close();
      }
    };
    await crawl();
    console.log('定时器已经开启，每 4 小时同步一次');
    global.setInterval(crawl, 4 * 60 * 60 * 1000);
  }
}

const crawler = new Crawler();
await crawler.init();
await crawler.work();
