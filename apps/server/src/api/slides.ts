import { Router } from 'express';
import { addSlide, deleteSlide, getSlides, updateSlide } from '../controller/slide.js';
import { singleUpload } from '../middlewares/upload.js';

export const slideAPI = Router();
slideAPI.route('/slides').get(getSlides).post(singleUpload, addSlide);
slideAPI.route('/slides/:id').delete(deleteSlide).put(singleUpload, updateSlide);
