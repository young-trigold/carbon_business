import { Article } from 'database';
import { Request, Response } from 'express';

export const addArticle = async (req: Request, res: Response) => {
  const fileURL = `http://${req.hostname}/${req.file?.filename}`;

  try {
    const newArticle = new Article({ ...req.body, backgroundImgURL: fileURL });
    await newArticle.save();
    res.status(200).json({ message: '上传成功', newArticle });
  } catch (error) {
    res.status(502).json(error);
  }
};

export const getArticleById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const article = await Article.findById(id);
    if (!id) {
      res.status(404).json({ message: '未找到该文章!' });
    } else {
      res.status(200).json({ article });
    }
  } catch (error) {
    res.status(502).json(error);
  }
};

export const getArticles = async (req: Request, res: Response) => {
  const { query } = req;
  const sample = Number.parseInt((query.sample as string) ?? '0', 10);

  const curPage = Number.parseInt((query.curPage as string) ?? '1', 10);
  const pageSize = Number.parseInt((query.pageSize as string) ?? '10', 10);

  try {
    if (sample) {
      const articles = await Article.aggregate([
        { $sample: { size: sample } },
        {
          $project: {
            _id: false,
            id: '$_id',
            date: '$date',
            title: '$title',
            subtitle: '$subtitle',
            link: '$link',
            source: '$source',
            backgroundImgURL: '$backgroundImgURL',
          },
        },
      ]);
      res.status(200).json(articles);
    } else {
      const [articleCount, articles] = await Promise.all([
        Article.count(),
        Article.find({})
          .sort({ date: -1 })
          .skip(curPage * pageSize)
          .limit(pageSize),
      ]);

      res.status(200).json({ totalPageCount: Math.ceil(articleCount / pageSize), articles });
    }
  } catch (error) {
    res.status(502).json(error);
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const article = await Article.findByIdAndRemove(id);
    if (!article) res.status(404).json({ message: '找不到该文章!' });
    else res.status(200).json({ message: '删除成功!' });
  } catch (error) {
    res.status(502).json(error);
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const article = await Article.findByIdAndUpdate(id, data);
    res.status(200).json({ message: '删除成功', article });
  } catch (error) {
    res.status(502).json(error);
  }
};
