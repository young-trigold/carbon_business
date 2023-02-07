import { Router } from 'express';
import { getCarousel } from '../controller/carousel.js';

export const carouselAPI = Router();
carouselAPI.route('/carousel').get(getCarousel);
