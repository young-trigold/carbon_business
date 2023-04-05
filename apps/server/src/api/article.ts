import { Router } from 'express';
import {
  addArticle,
  deleteArticle,
  getArticleById,
  getArticles,
  updateArticle,
} from '../controller/article.js';
import { auth } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/upload.js';

export const articleAPI = Router();
articleAPI.route('/articles').get(getArticles).post(singleUpload, addArticle);
articleAPI
  .route('/articles/:id')
  .get(getArticleById)
  .delete(auth, deleteArticle)
  .put(auth, updateArticle);
