import { Slide } from 'database';
import { Request, Response } from 'express';

export const getSlides = async (req: Request, res: Response) => {
  try {
    const slides = await Slide.find({});
    res.status(200).json(slides);
  } catch (error) {
    res.status(502).json(error);
  }
};

export const addSlide = async (req: Request, res: Response) => {
  const fileURL = `http://${req.hostname}/${req.file?.filename}`;

  try {
    const newSlide = new Slide({ ...req.body, backgroundImgURL: fileURL });
    await newSlide.save();
    res.status(200).json({ message: '上传成功', newSlide });
  } catch (error) {
    res.status(502).json(error);
  }
};

export const updateSlide = async (req: Request, res: Response) => {
  const { id } = req.params;
  const fileURL = `http://${req.hostname}/${req.file?.filename}`;

  try {
    const updatedSlide = await Slide.findByIdAndUpdate(id, {
      ...req.body,
      backgroundImgURL: fileURL,
    });
    res.status(200).json({ message: '上传成功', updatedSlide });
  } catch (error) {
    res.status(502).json(error);
  }
};

export const deleteSlide = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedSlide = await Slide.findByIdAndDelete(id);
    res.status(200).json({ message: '上传成功', deletedSlide });
  } catch (error) {
    res.status(502).json(error);
  }
};
