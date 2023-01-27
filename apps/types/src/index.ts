export type CarbonBusiness = {
  date: string;
  agency: string;
  type: string;
  startPrice: number;
  endPrice: number;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  volume: number;
  amount: number;
};

export const carbonBusinessKeys = new Map<keyof CarbonBusiness, string>([
  ['date', '交易日期'],
  ['agency', '交易机构'],
  ['type', '交易品种'],
  ['startPrice', '开盘价'],
  ['endPrice', '收盘价'],
  ['minPrice', '最低价'],
  ['maxPrice', '最高价'],
  ['averagePrice', '成交均价'],
  ['volume', '成交量'],
  ['amount', '成交金额'],
]);

export const queryKeys = [
  'startPrice',
  'endPrice',
  'minPrice',
  'maxPrice',
  'averagePrice',
  'volume',
  'amount',
] as const;

export const startDate = '2016-11-04';
export const agencies = ['上海', '湖北', '深圳', '广州', '北京', '海峡', '天津', '重庆'] as const;

export type AgenciesOfCarbonBusiness = typeof agencies[number];
export type QueryKeyOfCarbonBusiness = typeof queryKeys[number];

export const formatNumber = (number: number) => {
  const numAsString = String(number);  // 数字大小
  const [integerString] = numAsString.split('.');

  const { length } = integerString;
  if (length >= 9) return `${number / 10 ** 8}亿`;
  if (length >= 5) return `${number / 10 ** 4}万`;
  return number.toString();
};
