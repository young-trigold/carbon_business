import { Record, connectDataBase } from 'database';
import { CarbonBusiness } from 'lib';

const { log } = console;

class Crawler {
  #latestDateOfDatabase: string = '';
  #latestDateOfTarget: string = '';

  async init() {
    await connectDataBase('爬虫-全国record');
  }

  async #isAsync() {
    const getLatestDateOfDatabase = async () => {
      const records = await Record.aggregate([
        {
          $match: {
            agency: '全国',
          },
        },
        {
          $sort: {
            date: -1,
          },
        },
      ]);
      const latestDate = (records[0]?.date as string) || '2021-07-16';
      this.#latestDateOfDatabase = latestDate;
      console.log(`数据库最新数据日期为 ${latestDate}`);
      return latestDate;
    };

    const getLatestDateOfTarget = async () => {
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
      const latestDate = records[records.length - 1].date;
      this.#latestDateOfTarget = latestDate;
      console.log(`目标网站最新数据日期为 ${latestDate}`);
      return records[records.length - 1].date;
    };

    const isAsync = async () => {
      const [a, b] = await Promise.all([getLatestDateOfDatabase(), getLatestDateOfTarget()]);
      const result = new Date(a).getTime() >= new Date(b).getTime();
      if (result) console.log('数据已经同步完成');
      else console.log('数据还未同步');
      return result;
    };

    return await isAsync();
  }

  async #crawl() {
    if (await this.#isAsync()) return;
    console.log('正在同步数据...');
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

    const newRecords = records.filter(
      (record) => new Date(record.date).getTime() > new Date(this.#latestDateOfDatabase).getTime(),
    );

    try {
      await Record.insertMany(newRecords);
      console.log('数据已经同步完成!');
    } catch (error) {
      console.error(error);
    }
  }

  async work() {
    await this.#crawl();
    console.log('定时器已经开启，每 4 小时同步一次');
    global.setInterval(this.#crawl, 4 * 60 * 60 * 1000);
  }
}

const crawler = new Crawler();
await crawler.init();
await crawler.work();
