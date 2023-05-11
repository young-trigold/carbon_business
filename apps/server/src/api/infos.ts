import { Article } from 'database';
import { Request, Response, Router } from 'express';

export const getInfos = async (req: Request, res: Response) => {
  const { query } = req;
  const sortBy = query.sortBy ?? 'date';
  const limit = Number.parseInt((query.limit as string) ?? '10', 10);

  try {
    const articlesSorted = await Article.find()
      .sort({ [`${sortBy}`]: -1 })
      .limit(limit);
    res.status(200).json(articlesSorted);
  } catch (error) {
    res.status(502).json(error);
  }
};

export const infosAPI = Router();
infosAPI.get('/infos', getInfos);
