import { connectDataBase } from './connect.js';
import { Article, Record } from './index.js';
import {CarbonBusiness} from 'lib';

await connectDataBase('爬虫');
// - 海峡 /福建海峡 update 海峡
// const records = await Record.find({ agency: { $regex: /海峡/ } });

// const agencyToCountMap = records
//   .map((record) => record.agency)
//   .reduce(
//     (result, agency) => result.set(agency, result.get(agency) ? result.get(agency)! + 1 : 1),
//     new Map<string, number>(),
//   );

// console.log(agencyToCountMap);

// for (const key of agencyToCountMap.keys()) {
//   console.log(key);
//   const records = await Record.find({ agency: key });
//   const years = records.map((record) => record.date.slice(0, 4));
//   const yearToCountMap = years.reduce(
//     (result, year) => result.set(year, result.get(year) ? result.get(year)! + 1 : 1),
//     new Map<string, number>(),
//   );
//   console.log(yearToCountMap);
// }

// - 欧洲 remove
// await Record.remove({agency: {$regex: /欧洲/}});
// const records = await Record.find({agency: {$regex: /欧洲/}});
// console.log(records.length);
// console.log('完成!');
// const result = await Article.aggregate([
//   { $group: { _id: '$date', articles: { $push: '$$ROOT' }, count: { $sum: 1 } } },
//   {
//     $project: {
//       date: '$_id',
//       _id: 0,
//       articles: '$articles',
//       count: '$count',
//     },
//   },
//   { $sort: { date: -1 } },
// ]);

// const countByYear: Map<string, number> = result.reduce((map, articlesByDate) => {
//   const year = articlesByDate.date.slice(0, 4);
//   map.set(year, map.has(year) ? map.get(year) + 1 : 1);
//   return map;
// }, new Map<string, number>());

// console.log(countByYear);
// const countLowBy2017 = [...countByYear].reduce((result, [year, count]) => Number.parseInt(year) <= 2017 ? result + count : result, 0)
// console.log(countLowBy2017, [...countByYear.values()].reduce((a, b) => a+b, 0));
// const articles = await Article.deleteMany({date: { $lte: '2018-01-01'}});
// // console.log(articles.length);

// console.log('完成!');

// const articles = await Article.updateMany({ $set: { ownBySelf: false } });
// console.log('完成');
// const tags = ['market', 'finance', 'footage'];
// const getRandomTag= () => tags[~~(Math.random() * (2 - 0 + 1) + 0)];
// console.log(Array.from({length: 10}, getRandomTag));
// const articles = await Article.find({});
// await Promise.all(articles.map((article) => Article.findByIdAndUpdate(article.id, { $set: { tag: getRandomTag() } })));
// console.log('完成');

// const predictedRecords: Omit<CarbonBusiness, 'id'> = [].filter(() => {});
// await Record.insertMany([]);
// console.log('完成');
