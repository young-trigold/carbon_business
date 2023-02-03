import { Record } from 'database';
import { Request, Response } from 'express';
import dayjs from 'dayjs';
import { CarbonBusiness, QueryKeyOfCarbonBusiness } from 'lib';

export const getRecords = async (req: Request, res: Response) => {
  const { query } = req;
  const agencies = (query?.checkedAgencies as string)?.split(',') ?? ['上海', '湖北', '深圳', '广州'];
  const key = (query?.key as QueryKeyOfCarbonBusiness) ?? 'averagePrice';
  try {
    const records = await Record.aggregate([
      {
        $match: {
          date: {
            $gte: query.startDate ?? "2016-11-04", 
            $lte: query.endDate ?? dayjs().format('YYYY-MM-DD'), 
          },
        },
      },
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
    let results = records.map((record) => {
      const result: any = { date: record.date };
      (record.records as CarbonBusiness[]).forEach((record) => {
        const agency = record.agency.slice(0, 2);
        if (agencies && agencies.length && agencies.includes(agency)) {
          result[agency] = record[key];
        } else {
          result[agency] = record[key];
        }
      });
      return result;
    });

    results = results.filter((result) =>
      Object.values(result)
        .slice(1)
        .some((value) => Boolean(value)),
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(502).json(error);
  }
};
