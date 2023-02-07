import mongoose from 'mongoose';

const { Schema } = mongoose;

const carouselScheme = new Schema(
  {
    slides: [
      {
        backgroundImgURL: String,
        description: String,
        title: String,
      }
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Carousel = mongoose.model('Carousel', carouselScheme);
