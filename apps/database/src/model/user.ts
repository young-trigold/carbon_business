import mongoose from 'mongoose';

const { Schema } = mongoose;

const userScheme = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    avatarURL: {
      type: String,
      default: 'https://www.trigold.tech/',
    },
    permission: {
      type: String,
      default: 'visitor',
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

export const User = mongoose.model('User', userScheme);
