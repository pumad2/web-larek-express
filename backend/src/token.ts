import jwt, { SignOptions } from 'jsonwebtoken';
import ms, { StringValue } from 'ms';
import { CookieOptions } from 'express';
import config from './config';

export type JwtPayload = {_id: string };

export const signAccessToken = (payload: JwtPayload): string => {
  const options: SignOptions = { expiresIn: config.AUTH_ACCESS_TOKEN_EXPIRY as SignOptions['expiresIn'] };

  return jwt.sign(payload, config.JWT_ACCESS_KEY, options);
};

export const signRefreshToken = (payload: JwtPayload): string => {
  const options: SignOptions = { expiresIn: config.AUTH_REFRESH_TOKEN_EXPIRY as SignOptions['expiresIn'] };
  return jwt.sign(payload, config.JWT_REFRESH_KEY, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  const payload = jwt.verify(token, config.JWT_ACCESS_KEY) as JwtPayload;
  return payload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  const payload = jwt.verify(token, config.JWT_REFRESH_KEY) as JwtPayload;
  return payload;
};

export const refreshCookie = {
  name: 'refreshToken',
  options: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: ms(config.AUTH_REFRESH_TOKEN_EXPIRY as StringValue),
    path: '/',
  } as CookieOptions,
};
