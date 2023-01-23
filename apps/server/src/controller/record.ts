import { Record } from 'database';
import { Request, Response } from 'express';

export const getRecords = async (req: Request, res: Response) => {
  try {
    const records = await Record.find();
    res.status(200).json(records.slice(0, 100));
  } catch (error) {
    res.status(502).json(error);
  }
};
