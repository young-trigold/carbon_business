import { Router } from 'express';
import { addArticle, deleteArticle, getArticles, updateArticle } from '../controller/article.js';
import { auth } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/upload.js';

export const articleAPI = Router();
articleAPI.route('/articles').get(getArticles).post(singleUpload, addArticle);
articleAPI.route('/articles/:id').delete(auth, deleteArticle).put(auth, updateArticle);
