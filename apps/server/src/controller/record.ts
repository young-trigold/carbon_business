import { Record } from 'database';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { CarbonBusiness, QueryKeyOfCarbonBusiness } from 'lib';

export const getRecords = async (req: Request, res: Response) => {
  const { query } = req;
  const agencies = (query?.checkedAgencies as string)?.split(',') ?? [
    '上海',
    '湖北',
    '深圳',
    '广州',
  ];
  const key = (query?.key as QueryKeyOfCarbonBusiness) ?? 'averagePrice';
  const paged = Boolean(Number.parseInt(query.paged as string, 10));
  const curPage = Number.parseInt((query.curPage as string) ?? '1', 10);
  const pageSize = Number.parseInt((query.pageSize as string) ?? '10', 10);

  if (paged) {
    try {
      const [recordCount, records] = await Promise.all([
        Record.count(),
        Record.find({})
          .sort({ date: -1 })
          .skip(curPage * pageSize)
          .limit(pageSize),
      ]);

      res.json({
        totalPageCount: Math.ceil(recordCount / pageSize),
        records,
      });
    } catch (error) {
      res.status(502).json(error);
    }
  } else {
    try {
      const recordsByDate = await Record.aggregate([
        {
          $match: {
            date: {
              $gte: query.startDate ?? '2016-11-04',
              $lte: query.endDate ?? dayjs().format('YYYY-MM-DD'),
            },
          },
        },
        { $group: { _id: '$date', records: { $push: '$$ROOT' }, count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
        {
          $project: {
            date: '$_id',
            _id: false,
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
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const record = await Record.findByIdAndRemove(id);
    if (!record) res.status(404).json({ message: '找不到该数据!' });
    else res.status(200).json({ message: '删除成功!' });
  } catch (error) {
    res.status(502).json(error);
  }
};

export const updateRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const record = await Record.findByIdAndUpdate(id, data);
    res.status(200).json({ message: '删除成功', record });
  } catch (error) {
    res.status(502).json(error);
  }
};

export const addRecord = async (req: Request, res: Response) => {
  try {
    const newRecord = new Record({ ...req.body });
    await newRecord.save();
    res.status(200).json({ message: '上传成功', newRecord });
  } catch (error) {
    res.status(502).json(error);
  }
};
