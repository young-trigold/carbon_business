import { connectDataBase } from './connect.js';
import { Article, Slide } from './index.js';

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

// await Slide.insertMany([{
//   "backgroundImgURL": "imgs/carousel_01.jpg",
//   "description": "积极稳妥推进碳达峰碳中和，立足我国能源资源禀赋，坚持先立后破，有计划分步骤实施碳达峰行动，深入推进能源革命，加强煤炭清洁高效利用，",
//   "title": "张永生：二十大对实现“双碳”做了最新战略部署",
//   "link": "http://www.tanjiaoyi.com/article-41748-1.html"
// }, {
//   "backgroundImgURL": "imgs/carousel_02.jpg",
//   "description": "中共中央政治局1月24日下午就努力实现碳达峰碳中和目标进行第三十六次集体学习。中共中央总书记习近平在主持学习时强调，实现碳达峰碳中和",
//   "title": "习近平：深入分析推进碳达峰碳中和工作面临的形势任务",
//   "link": "http://www.tanjiaoyi.com/article-35988-1.html"
// }, {
//   "backgroundImgURL": "imgs/carousel_03.png",
//   "description": "韩正在碳达峰碳中和工作领导小组第一次全体会议上强调全面贯彻落实习近平生态文明思想确保如期实现碳达峰碳中和目标 新华社北京5月27日电",
//   "title": "韩正主持碳达峰碳中和工作领导小组第一次全体会议并讲",
//   "link": "http://www.tanjiaoyi.com/article-33539-1.html"
// }, {
//   "backgroundImgURL": "imgs/carousel_04.jpg",
//   "description": "2月26日至27日，生态环境部部长黄润秋赴湖北省、上海市调研碳市场建设工作。他强调，要把落实习近平总书记关于我国新的碳达峰目标与碳中和",
//   "title": "生态环境部部长黄润秋：确保6月底前启动上线全国碳交",
//   "link": "http://www.tanjiaoyi.com/article-33054-1.html"
// }, {
//   "backgroundImgURL": "imgs/carousel_05.jpg",
//   "description": "碳排放权交易管理办法（试行） 《碳排放权交易管理办法（试行）》已于2020年12月25日由生态环境部部务会议审议通过，现予公布，自2021年2月",
//   "title": "碳排放权交易管理办法（试行）正式发布",
//   "link": "http://www.tanjiaoyi.com/article-32611-1.html"
// }]);
// console.debug('完成');

// const slides = await Slide.find({});
// await Promise.all(
//   slides.map((slide) => {
//     const { id, backgroundImgURL } = slide;
//     const [, path] = backgroundImgURL.split('//');
//     const newBackgroundImgURL = `http://localhost/${path}`;
//     return Slide.findByIdAndUpdate(id, { $set: { backgroundImgURL: newBackgroundImgURL } });
//   }),
// );
// await Article.updateMany({$set: {readCount: 1}})
// console.debug('完成');
