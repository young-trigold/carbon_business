import { readFile, readdir } from 'fs/promises';
import { CarbonBusiness } from './fetchData.js';
import { connectDataBase } from 'database';
import { Record } from 'database/src/model/record.js';

connectDataBase();

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
  records.forEach(async (record) => {
    const newRecord = new Record({
      ...record,
    });

    try {
      await newRecord.save();
      console.log(`数据${fileName}已插入数据库`);
    } catch (error) {
      console.error(error);
    }
  });
});

console.log('\n所有数据插入完成');
