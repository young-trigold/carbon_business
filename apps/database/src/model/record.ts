import mongoose from 'mongoose';

const { Schema } = mongoose;

const recordScheme = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    agency: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    startPrice: {
      type: Number,
      required: true,
    },
    endPrice: {
      type: Number,
      required: true,
    },
    minPrice: {
      type: Number,
      required: true,
    },
    maxPrice: {
      type: Number,
      required: true,
    },
    averagePrice: {
      type: Number,
      required: true,
    },
    volume: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
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

export const Record = mongoose.model('Record', recordScheme);

