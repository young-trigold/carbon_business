import { connectDataBase } from './connect.js';
import { Record } from './index.js';

await connectDataBase('爬虫');
await Record.updateMany({ date: { $ne: '2023-02-09' } }, [
  {
    $set: {
      endPrice: '$averagePrice',
      maxPrice: '$endPrice',
      averagePrice: '$maxPrice',
    },
  },
]);

console.log('更新完成');
