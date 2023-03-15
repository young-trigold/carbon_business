import { Router } from 'express';
import { getUserInfo, login, register } from '../controller/user.js';
import { auth } from '../middlewares/auth.js';

export const userApi = Router();
userApi.post('/register', register);
userApi.post('/login', login);
userApi.get('/auth', auth, getUserInfo);