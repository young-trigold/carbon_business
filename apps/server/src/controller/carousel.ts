import { Carousel } from 'database';
import { Request, Response } from 'express';

export const getCarousel = async (req: Request, res: Response) => {
  try {
    const results = await Carousel.findOne();
    res.status(200).json(results);
  } catch (error) {
    res.status(502).json(error);
  }
};
