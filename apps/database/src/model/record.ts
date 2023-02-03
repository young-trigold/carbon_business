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
    startPrice: Number,
    endPrice: Number,
    minPrice: Number,
    maxPrice: Number,
    averagePrice: Number,
    volume: Number,
    amount: Number,
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
