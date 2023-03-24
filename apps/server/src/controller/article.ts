import { Article } from 'database';
import { Request, Response } from 'express';

export const getArticles = async (req: Request, res: Response) => {
  const { query } = req;
  const sample = Number.parseInt((query.sample as string) ?? '0', 10);

  const curPage = Number.parseInt((query.curPage as string) ?? '10', 10);
  const pageSize = Number.parseInt((query.pageSize as string) ?? '10', 10);

  console.log(curPage, pageSize);

  try {
    if (sample) {
      const articles = await Article.aggregate([{ $sample: { size: sample } }]);
      res.status(200).json(articles);
    } else {
      const [[{total}], articles] = await Promise.all([
        Article.aggregate([{ $sort: { date: -1 } }, { $count: 'total' }]),
        Article.aggregate([
          { $sort: { date: -1 } },
          { $skip: curPage * pageSize },
          { $limit: pageSize },
        ]),
      ]);
      res.status(200).json({ totalPageCount: Math.ceil(total / pageSize), articles });
    }
  } catch (error) {
    res.status(502).json(error);
  }
};
