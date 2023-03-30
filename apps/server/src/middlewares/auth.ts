import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer'))
      res.status(401).json({ message: '未授权!' });
    else {
      const token = req.headers.authorization.split(' ')[1];
      const decodedUser = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decodedUser as any;
      next();
    }
  } catch (error) {
    if (error instanceof Error)
      res.status(403).json({ message: '请重新登录!', stack: error.stack });
  }
};
