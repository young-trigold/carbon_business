import { Record, connectDataBase } from 'database';
import dayjs from 'dayjs';
import { existsSync, mkdirSync } from 'fs';
import { readFile, readdir, unlink, writeFile } from 'fs/promises';
import { CarbonBusiness, getRandomNumber, sleep } from 'lib';
import puppeteer, { Browser, Page } from 'puppeteer-core';

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
    await connectDataBase('爬虫：record');
  }

  async #isSynced() {
    this.#time = dayjs().format('YYYY-MM-DD HH:mm');
    const getDateOfLatestDataInDatabase = async () => {
      const datesOfRecords = await Record.aggregate([
        { $match: { agency: { $ne: '全国' } } },
        { $group: { _id: '$date', records: { $push: '$$ROOT' }, count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
        {
          $project: {
            date: '$_id',
            _id: 0,
          },
        },
      ]);
      const date = datesOfRecords[0].date as string;
      this.#latestDateForDatabase = date;
      return date;
    };

    const getDateOfLatestDataInTargetWebsite = async () => {
      const url = `https://ets.sceex.com.cn/internal.htm?orderby=tradeTime%20desc&pageSize=14&k=guo_nei_xing_qing&url=mrhq_gn&pageIndex=1`;
      await this.#page!.goto(url, {
        waitUntil: 'domcontentloaded',
      });
      const tableRowSelector = '.tan_every_table tr';
      const date = await this.#page!.$$eval(tableRowSelector, (trElements) => {
        return trElements[1].children[0].textContent ?? dayjs().format('YYYY-DD-MM');
      });
      this.#latestDateForTargetWebsite = date;
      return date;
    };

    const dateStrings = await Promise.all([
      getDateOfLatestDataInDatabase(),
      getDateOfLatestDataInTargetWebsite(),
    ]);

    console.log('数据库数据最新日期:', dateStrings[0]);
    console.log('目标网站数据最新日期:', dateStrings[1]);
    const result = new Date(dateStrings[0]).getTime() >= new Date(dateStrings[1]).getTime();
    if (result) console.log(this.#time, '数据已经同步完成');
    else console.log(this.#time, '数据还未同步');
    return result;
  }

  async #fetchData() {
    const pathToData = './data';
    if (!existsSync(pathToData)) {
      console.log('保存数据文件夹不存在，正在创建');
      try {
        mkdirSync(pathToData, {
          recursive: true,
        });
        console.log('保存数据文件夹创建成功');
      } catch (error) {
        console.log('保存数据文件夹创建失败');
        console.log(error);
      }
    }

    const getDataByPageIndex = async (pageIndex: number) => {
      const url = `https://ets.sceex.com.cn/internal.htm?orderby=tradeTime%20desc&pageSize=14&k=guo_nei_xing_qing&url=mrhq_gn&pageIndex=${pageIndex}`;
      await this.#page?.goto(url, {
        waitUntil: 'domcontentloaded',
      });

      const tableRowSelector = '.tan_every_table tr';
      const carbonBusinessDataByPageIndex = await this.#page?.$$eval(
        tableRowSelector,
        (trElements) => {
          const trElementsWithoutThead = trElements.slice(1);
          const result = trElementsWithoutThead.map((trElement) => {
            const tdElements = [...trElement.children];
            const eachData: Omit<CarbonBusiness, 'id'> = {
              date: (tdElements[0].textContent ?? '').trim(),
              agency: (tdElements[1].textContent ?? '').trim(),
              type: (tdElements[2].textContent ?? '').trim(),
              startPrice: Number.parseFloat(tdElements[3].textContent ?? '0'),
              maxPrice: Number.parseFloat(tdElements[4].textContent ?? '0'),
              minPrice: Number.parseFloat(tdElements[5].textContent ?? '0'),
              averagePrice: Number.parseFloat(tdElements[6].textContent ?? '0'),
              endPrice: Number.parseFloat(tdElements[7].textContent ?? '0'),
              volume: Number.parseFloat(tdElements[8].textContent ?? '0'),
              amount: Number.parseFloat(tdElements[9].textContent ?? '0'),
            };
            return eachData;
          });
          return result;
        },
      );

      return carbonBusinessDataByPageIndex;
    };

    let pageIndex = 1;

    while (true) {
      console.log(`第 ${pageIndex} 次爬取开始`);
      const path = `./data/carbon_business_data_by_page_index_${String(pageIndex).padStart(
        4,
        '0',
      )}.json`;
      const start = performance.now();
      const carbonBusinessDataByPageIndex = await getDataByPageIndex(pageIndex);

      console.log(`第${pageIndex}页数据已爬取`);
      await writeFile(path, JSON.stringify(carbonBusinessDataByPageIndex));
      console.log(`第${pageIndex}页数据已存放到文件`);
      await sleep(getRandomNumber(600, 1200));
      console.log(`本次用时：${performance.now() - start} ms`);

      const finished = () =>
        !carbonBusinessDataByPageIndex ||
        carbonBusinessDataByPageIndex.length === 0 ||
        carbonBusinessDataByPageIndex.some(
          (record) =>
            new Date(record.date).getTime() <= new Date(this.#latestDateForDatabase).getTime(),
        );

      if (finished()) {
        console.log(`爬取完成，共爬取到 ${pageIndex} 页数据`);
        break;
      }

      pageIndex += 1;
    }
  }

  async #insertData() {
    const insertDataByFile = async (fileName: string) => {
      const readEachFile = async (fileName: string) => {
        const path = `./data/${fileName}`;
        const buffer = await readFile(path);
        const content = buffer.toString();
        const records = JSON.parse(content) as CarbonBusiness[];
        return records;
      };

      const records = await readEachFile(fileName);
      records
        .filter(
          (record) =>
            new Date(record.date).getTime() > new Date(this.#latestDateForDatabase).getTime(),
        )
        .forEach(async (record) => {
          const newRecord = new Record({
            ...record,
          });

          try {
            await newRecord.save();
          } catch (error) {
            console.error(error);
          }
        });
      console.log(`数据${fileName}已插入数据库`);
    };

    const fileNames = await readdir('./data');
    fileNames.forEach(insertDataByFile);
    console.log('所有数据插入完成');
    await Promise.all(fileNames.map((fileName) => unlink(`./data/${fileName}`)));
    console.log('数据文件已经全部清除');
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
