import { Router } from 'express';
import { multipleUpload, singleUpload } from '../middlewares/upload.js';

const uploadAPI = Router();

uploadAPI.post('/upload/single', singleUpload, (req, res) => {
	const { file, hostname} = req;
	const fileURL = `http://${hostname}/${file?.filename}`;
	res.status(200).json({ message: '上传成功!', fileURL });
});

uploadAPI.post('/upload/multiple', multipleUpload, (req, res) => {
  const { files, hostname } = req;
	const fileURLs = (files as Express.Multer.File[])?.map((file) => `http://${hostname}/${file?.filename}`);
	res.status(200).json({ message: '上传成功!', fileURLs });
});

export default uploadAPI;