import { connectDataBase } from './connect.js';
import { Record } from './index.js';

await connectDataBase('爬虫');
// - 海峡 /福建海峡 update 海峡
const records = await Record.find({ agency: { $regex: /海峡/ } });

const agencyToCountMap = records
  .map((record) => record.agency)
  .reduce(
    (result, agency) => result.set(agency, result.get(agency) ? result.get(agency)! + 1 : 1),
    new Map<string, number>(),
  );

console.log(agencyToCountMap);

for (const key of agencyToCountMap.keys()) {
  console.log(key);
  const records = await Record.find({ agency: key });
  const years = records.map((record) => record.date.slice(0, 4));
  const yearToCountMap = years.reduce(
    (result, year) => result.set(year, result.get(year) ? result.get(year)! + 1 : 1),
    new Map<string, number>(),
  );
  console.log(yearToCountMap);
}

// - 欧洲 remove
// await Record.remove({agency: {$regex: /欧洲/}});
// const records = await Record.find({agency: {$regex: /欧洲/}});
// console.log(records.length);
// console.log('完成!');