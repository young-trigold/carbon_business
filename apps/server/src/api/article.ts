import { Router } from 'express';
import { deleteArticle, getArticles, updateArticle } from '../controller/article.js';
import { auth } from '../middlewares/auth.js';

export const articleAPI = Router();
articleAPI.route('/articles').get(getArticles);
articleAPI
  .route('/articles/:id')
  .delete(auth, deleteArticle)
  .put(auth, updateArticle);