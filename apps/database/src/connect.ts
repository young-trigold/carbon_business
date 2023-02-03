import mongoose from 'mongoose';

export const connectDataBase = async (target: string) => {
  mongoose.set('strictQuery', true);
  const dbUrl = 'mongodb://127.0.0.1:27017';

  const options = {
    dbName: 'carbon_business',
  };

  try {
    mongoose.connect(dbUrl, options);
    console.log(`${target}: 数据库连接成功`);
  } catch (error) {
    console.error('数据库连接错误');
    console.error(error);
  }
};
