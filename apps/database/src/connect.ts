import mongoose from 'mongoose';

const { log } = console;

export const connectDataBase = () => {
  const dbUrl = 'mongodb://127.0.0.1:27017';

  const options = {
    dbName: 'carbon_business',
  };

  mongoose
    .connect(dbUrl, options)
    .then(() => log('数据库连接成功!'))
    .catch(() => log('数据库连接错误!'));
};
