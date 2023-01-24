import { Record } from 'database';
import { Request, Response } from 'express';
import { CarbonBusiness } from 'types';

export const getRecords = async (req: Request, res: Response) => {
  try {
    const records = await Record.aggregate([
      { $group: { _id: '$date', records: { $push: '$$ROOT' }, count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
      {
        $project: {
          date: '$_id',
          _id: 0,
          records: '$records',
        },
      },
    ]);
   const results = records.map((record) => {
      const result: any = { date: record.date };
      (record.records as CarbonBusiness[]).forEach((record) => {
        result[record.agency.slice(0, 2)] = record.averagePrice;
      });
      return result;
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(502).json(error);
  }
};
