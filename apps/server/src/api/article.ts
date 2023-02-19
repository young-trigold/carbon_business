import { Router } from 'express';
import { getArticles } from '../controller/article.js';

export const articleAPI = Router();
articleAPI.route('/articles').get(getArticles);