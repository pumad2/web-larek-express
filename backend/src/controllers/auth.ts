import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import BadRequestError from '../errors/bad-request-error';
import UnauthorizedError from '../errors/unauthorized-error';
import NotFoundError from '../errors/not-found-error';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  refreshCookie,
  JwtPayload,
} from '../token';

interface AuthRequest extends Request {
  user?: JwtPayload;
}

const authResponse = (user: { email: string, name: string }, accessToken: string) => ({
  user,
  success: true,
  accessToken,
});

export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    return res.status(200).send({
      user: { email: user.email, name: user.name },
      success: true,
    });
  } catch (err) {
    return next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      throw new UnauthorizedError('Неверные почта или пароль');
    }

    const authPassword = await bcrypt.compare(password, user.password);
    if (!authPassword) {
      throw new UnauthorizedError('Неверные почта или пароль');
    }

    const payload = { _id: user._id.toString() };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await User.findByIdAndUpdate(user._id, { $push: { tokens: { token: refreshToken } } });

    res.cookie(refreshCookie.name, refreshToken, refreshCookie.options);

    return res.status(200).send(authResponse({ email: user.email, name: user.name }, accessToken));
  } catch (err) {
    return next(err);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || password.length < 6) {
      throw new BadRequestError('Переданы некорректные данные');
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      tokens: [],
    });

    const payload = { _id: user._id.toString() };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await User.findByIdAndUpdate(user._id, { $push: { tokens: { token: refreshToken } } });

    res.cookie(refreshCookie.name, refreshToken, refreshCookie.options);

    return res.status(200).send(authResponse({ email: user.email, name: user.name }, accessToken));
  } catch (err) {
    return next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookieToken = req.cookies?.refreshToken;
    if (!cookieToken) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    const payload = verifyRefreshToken(cookieToken);

    const user = await User.findById(payload._id).select('+tokens');
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    user.tokens = user.tokens.filter((t) => t.token !== cookieToken);
    await user.save();

    res.cookie(refreshCookie.name, '', { ...refreshCookie.options, maxAge: 0 });

    return res.status(200).send({ success: true });
  } catch (err) {
    return next(err);
  }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookieToken = req.cookies?.refreshToken;
    if (!cookieToken) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    const payload = verifyRefreshToken(cookieToken);

    const user = await User.findById(payload._id).select('+tokens');
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    const exists = user.tokens?.find((t) => t.token === cookieToken);
    if (!exists) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    const newAccessToken = signAccessToken({ _id: payload._id });
    const newRefreshToken = signRefreshToken({ _id: payload._id });

    await User.findByIdAndUpdate(payload._id, { $pull: { tokens: { token: cookieToken } } });
    await User.findByIdAndUpdate(payload._id, { $push: { tokens: { token: newRefreshToken } } });

    res.cookie(refreshCookie.name, newRefreshToken, refreshCookie.options);

    return res.status(200).send(
      authResponse({ email: user.email, name: user.name }, newAccessToken),
    );
  } catch (err) {
    return next(err);
  }
};
