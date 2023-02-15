import { connectDataBase, Record } from 'database';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { CarbonBusiness, carbonBusinessKeys } from 'lib';

XLSX.set_fs(fs);

await connectDataBase('excel');

let records = await Record.aggregate([
  {
    $project: {
      _id: false,
      __v: false,
      createdAt: false,
      updatedAt: false,
    },
  },
]) as CarbonBusiness[];

records = records.map((record) => {
  const obj = {} as any;
  Object.entries(record).forEach(([key, value]) => {
    obj[carbonBusinessKeys.get(key as keyof CarbonBusiness)!] = value;
  });
  return obj;
});

const worksheet = XLSX.utils.json_to_sheet(records);
console.debug(records.slice(0, 3));
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Records');
XLSX.writeFile(workbook, 'records1.xlsx');
