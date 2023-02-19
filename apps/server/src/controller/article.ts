import { Article } from 'database';
import { Request, Response } from 'express';

export const getArticles = async (req: Request, res: Response) => {
  const { query } = req;

  const count = Number.parseInt((query.count as string) ?? '10', 10);

  try {
    const articles = await Article.find().limit(count);
    res.status(200).json(articles);
  } catch (error) {
    res.status(502).json(error);
  }
};
