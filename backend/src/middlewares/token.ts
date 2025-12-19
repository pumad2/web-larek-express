import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-error';
import { JwtPayload, verifyAccessToken } from '../token';

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const tokenMiddleware = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new UnauthorizedError('Токен отсутствует'));
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;

    return next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Токен просрочен или отсутствует'));
    }

    return next(err);
  }
};

export default tokenMiddleware;
