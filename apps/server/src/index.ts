import path from 'path';
import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import * as url from 'url';
import { connectDataBase } from 'database';
import { recordAPI } from './api/record.js';
import { slideAPI } from './api/slides.js';
import { articleAPI } from './api/article.js';
import { userApi } from './api/user.js';
import uploadAPI from './api/upload.js';

dotenv.config();

const { log } = console;
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
 
const server = express();
server.use(morgan('dev'));
server.use(compression());
server.use(express.urlencoded({ extended: true, limit: '50mb' }));
server.use(express.json({ limit: '50mb' }));
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.static(path.join(__dirname, 'static')));
server.use('/api', recordAPI);
server.use('/api', slideAPI);
server.use('/api', articleAPI);
server.use('/api', userApi);
server.use('/api', uploadAPI);
server.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT;

connectDataBase('服务器');
server.listen(port, () => log(`web 服务器进程已经监听在 localhost:${port}`));
