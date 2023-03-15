import { Record } from 'database';
import { Request, Response } from 'express';
import dayjs from 'dayjs';
import { CarbonBusiness, QueryKeyOfCarbonBusiness } from 'lib';

export const getRecords = async (req: Request, res: Response) => {
  const { query } = req;
  const agencies = (query?.checkedAgencies as string)?.split(',') ?? ['上海', '湖北', '深圳', '广州'];
  const key = (query?.key as QueryKeyOfCarbonBusiness) ?? 'averagePrice';
  try {
    const recordsByDate = await Record.aggregate([
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
    let results = recordsByDate.map((recordByDate) => {
      const result: any = { date: recordByDate.date };
      (recordByDate.records as CarbonBusiness[]).forEach((record) => {
        const rawAgencyOfRecord = record.agency.slice(0, 2);
        const agencyOfRecord = rawAgencyOfRecord === '福建' ? '海峡' : rawAgencyOfRecord;
        if (agencies && agencies.length && agencies.includes(agencyOfRecord)) {
          result[agencyOfRecord] = record[key];
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
