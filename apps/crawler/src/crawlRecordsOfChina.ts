import { Record, connectDataBase } from 'database';
import dayjs from 'dayjs';
import { existsSync, mkdirSync } from 'fs';
import { readFile, readdir, unlink, writeFile } from 'fs/promises';
import { CarbonBusiness, getRandomNumber, sleep } from 'lib';
import puppeteer, { Browser, Page } from 'puppeteer-core';

const { log, } = console;

await connectDataBase('爬虫-全国record');
const res = await fetch('https://www.cneeex.com/sshqt/jsonData/hiskline.json');
const json = (await res.json()) as [string, string, string, string, string, string][];
const records: CarbonBusiness[] = json.map((item) => ({
  date: item[0],
  startPrice: Number.parseFloat(item[1]),
  endPrice: Number.parseFloat(item[2]),
  minPrice: Number.parseFloat(item[3]),
  maxPrice: Number.parseFloat(item[4]),
  volume: Number.parseFloat(item[5]),
  agency: '全国',
  type: 'CEA',
}));
// log(records[records.length - 1]);
// 开盘 收盘 最低 最高 成交量
try {
  await Record.insertMany(records);
} catch (error) {
  console.error(error);
}
