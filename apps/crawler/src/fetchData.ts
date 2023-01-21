import puppeteer from 'puppeteer-core';
import { writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';

export type CarbonBusiness = {
  date: string;
  agency: string;
  type: string;
  startPrice: number;
  endPrice: number;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  volume: number;
  amount: number;
};

const pathToData = './data';
if (!existsSync(pathToData)) {
  try {
    mkdirSync(pathToData, {
      recursive: true,
    });
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

const filedNameMap = new Map<keyof CarbonBusiness, string>([
  ['date', '交易日期'],
  ['agency', '交易机构'],
  ['type', '交易品种'],
  ['startPrice', '开盘价'],
  ['endPrice', '收盘价'],
  ['minPrice', '最低价'],
  ['maxPrice', '最高价'],
  ['averagePrice', '成交均价'],
  ['volume', '成交量'],
  ['amount', '成交金额'],
]);

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
  if (carbonBusinessDataByPageIndex.length === 0) {
    console.log(`爬取完成，共爬取到 ${pageIndex} 页数据`);
    break;
  }
  console.log(`第${pageIndex}页数据已爬取`);
  await writeFile(path, JSON.stringify(carbonBusinessDataByPageIndex));
  console.log(`第${pageIndex}页数据已存放到文件`);
  await sleep(getRandomNumber(600, 1200));
  console.log(`本次用时：${performance.now() - start} ms`);
  pageIndex += 1;
}

await browser.close();
