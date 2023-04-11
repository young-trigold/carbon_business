import mongoose from 'mongoose';

const { Schema } = mongoose;

const slideScheme = new Schema(
  {
    backgroundImgURL: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    id: true,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

export const Slide = mongoose.model('Slide', slideScheme);
