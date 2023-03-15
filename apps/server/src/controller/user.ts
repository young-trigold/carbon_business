import bcrypt from 'bcryptjs';
import { User } from 'database';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  const { name, password } = req.body;

  try {
    const userWithSameName = await User.findOne({ name });

    if (userWithSameName) {
      res.status(409).json({ message: '该用户已经存在!' });
    } else {
      const cypheredPwd = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        password: cypheredPwd,
        permission: 'visitor',
      });

      await newUser.save();
      res.status(200).json({ message: '注册成功!' });
    }
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: '服务器错误!', stack: error.stack });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });

    if (user) {
      const isPass = await bcrypt.compare(password, user.password!);

      if (isPass) {
        const { name, permission, avatarURL } = user;
        res.status(200).json({
          token: jwt.sign({ name, permission, avatarURL }, process.env.JWT_SECRET!, {
            expiresIn: '7d',
          }),
        });
      } else {
        res.status(401).json({ message: '密码不匹配!' });
      }
    } else {
      res.status(404).json({ message: '不存在该用户!' });
    }
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: '服务器错误!', stack: error.stack });
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  const { user } = req;
  res.status(200).json(user);
};

declare global {
  namespace Express {
    interface Request {
      user: {
        name: string;
        permission: string;
        avatarURL: string;
      } | null;
    }
  }
}
