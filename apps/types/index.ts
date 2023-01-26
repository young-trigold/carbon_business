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