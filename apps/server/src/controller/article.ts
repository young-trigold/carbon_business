import { Article } from 'database';
import { Request, Response } from 'express';

export const getArticles = async (req: Request, res: Response) => {
  const { query } = req;

  const count = Number.parseInt((query.count as string) ?? '10', 10);
  const sample = Number.parseInt((query.sample as string) ?? '0', 10);
  try {
    if (sample) {
      const articles = await Article.aggregate([{ $sample: { size: sample } }]);
      res.status(200).json(articles);
      
    } else {
      const articles = await Article.aggregate([{ $sort: { date: -1 } }, { $limit: count }]);
      res.status(200).json(articles);
    }
  } catch (error) {
    res.status(502).json(error);
  }
};
