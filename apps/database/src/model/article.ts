import mongoose from 'mongoose';

const { Schema } = mongoose;

const articleScheme = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    link: String,
    content: String,
    ownBySelf: {
      type: Boolean,
      required: true, 
    },
    subtitle: String,
    backgroundImgURL: String,
    tag: String,
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

export const Article = mongoose.model('Article', articleScheme);
