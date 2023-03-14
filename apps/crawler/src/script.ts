import { Record, connectDataBase } from 'database';

await connectDataBase('爬虫-全国record');

try {
  await Record.remove({ agency: '全国' });
} catch (error) {
  console.error(error);
}
