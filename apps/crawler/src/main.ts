import { Record, connectDataBase } from 'database';
import dayjs from 'dayjs';
import puppeteer from 'puppeteer-core';
import { writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { CarbonBusiness } from 'lib';
import { readFile, readdir, unlink } from 'fs/promises';

class Crawler {
  latestDateForDatabase: string = dayjs().format('YYYY-MM-DD');
  latestDateForTargetWebsite: string = dayjs().format('YYYY-MM-DD');
  time = dayjs().format('YYYY-MM-DD HH:mm');

  constructor() {}

  async init() {
    await connectDataBase('爬虫');
  }

  async isSynced() {
    this.time = dayjs().format('YYYY-MM-DD HH:mm');
    const getDateOfLatestDataInDatabase = async () => {
      const datesOfRecords = await Record.aggregate([
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
      this.latestDateForDatabase = date;
      return date;
    };

    const getDateOfLatestDataInTargetWebsite = async () => {
      const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      });
      const page = await browser.newPage();
      const url = `https://ets.sceex.com.cn/internal.htm?orderby=tradeTime%20desc&pageSize=14&k=guo_nei_xing_qing&url=mrhq_gn&pageIndex=1`;
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });
      const tableRowSelector = '.tan_every_table tr';
      const date = await page.$$eval(tableRowSelector, (trElements) => {
        return trElements[1].children[0].textContent ?? dayjs().format('YYYY-DD-MM');
      });
      this.latestDateForTargetWebsite = date;
      await browser.close();
      return date;
    };

    const dateStrings = await Promise.all([
      getDateOfLatestDataInDatabase(),
      getDateOfLatestDataInTargetWebsite(),
    ]);

    console.log('数据库数据最新日期:', dateStrings[0]);
    console.log('目标网站数据最新日期:', dateStrings[1]);
    const result = new Date(dateStrings[0]).getTime() >= new Date(dateStrings[1]).getTime();
    if (result) console.log(this.time, '数据已经同步完成');
    else console.log(this.time, '数据还未同步');
    return result;
  }

  async fetchData() {
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

    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    });

    const page = await browser.newPage();

    const getDataByPageIndex = async (pageIndex: number) => {
      const url = `https://ets.sceex.com.cn/internal.htm?orderby=tradeTime%20desc&pageSize=14&k=guo_nei_xing_qing&url=mrhq_gn&pageIndex=${pageIndex}`;
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });

      const tableRowSelector = '.tan_every_table tr';
      const carbonBusinessDataByPageIndex = await page.$$eval(tableRowSelector, (trElements) => {
        const trElementsWithoutThead = trElements.slice(1);
        const result = trElementsWithoutThead.map((trElement) => {
          const tdElements = [...trElement.children];
          const eachData: CarbonBusiness = {
            date: tdElements[0].textContent ?? '',
            agency: tdElements[1].textContent ?? '',
            type: tdElements[2].textContent ?? '',
            startPrice: Number.parseFloat(tdElements[3].textContent ?? '0'),
            endPrice: Number.parseFloat(tdElements[4].textContent ?? '0'),
            minPrice: Number.parseFloat(tdElements[5].textContent ?? '0'),
            maxPrice: Number.parseFloat(tdElements[6].textContent ?? '0'),
            averagePrice: Number.parseFloat(tdElements[7].textContent ?? '0'),
            volume: Number.parseFloat(tdElements[8].textContent ?? '0'),
            amount: Number.parseFloat(tdElements[9].textContent ?? '0'),
          };
          return eachData;
        });
        return result;
      });

      return carbonBusinessDataByPageIndex;
    };

    const sleep = (time: number) =>
      new Promise((f) => {
        setTimeout(f, time);
      });

    const getRandomNumber = (start: number, end: number) => {
      return Math.floor(Math.random() * (end - start + 1) + start);
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
      if (
        carbonBusinessDataByPageIndex.length === 0 ||
        carbonBusinessDataByPageIndex.some(
          (record) =>
            new Date(record.date).getTime() <= new Date(this.latestDateForDatabase).getTime(),
        )
      ) {
        console.log(`爬取完成，共爬取到 ${pageIndex} 页数据`);
        break;
      }
      pageIndex += 1;
    }

    await browser.close();
  }

  async insertData() {
    const readEachFile = async (fileName: string) => {
      const path = `./data/${fileName}`;
      const buffer = await readFile(path);
      const content = buffer.toString();
      const records = JSON.parse(content) as CarbonBusiness[];
      return records;
    };

    const fileNames = await readdir('./data');

    fileNames.forEach(async (fileName) => {
      const records = await readEachFile(fileName);
      records
        .filter(
          (record) =>
            new Date(record.date).getTime() > new Date(this.latestDateForDatabase).getTime(),
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
    });

    console.log('所有数据插入完成');

    await Promise.all(fileNames.map((fileName) => unlink(`./data/${fileName}`)));
    console.log('数据文件已经全部清除');
    console.log(this.time, '本次同步完成');
  }

  async start() {
    const crawl = async () => {
      if (!(await this.isSynced())) {
        await this.fetchData();
        await this.insertData();
      }
    };
    await crawl();
    console.log('定时器已经开启，每 4 小时同步一次');
    global.setInterval(crawl, 4 * 60 * 60 * 1000);
  }
}

const crawler = new Crawler();
await crawler.init();
await crawler.start();
