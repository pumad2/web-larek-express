import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { isCelebrateError } from 'celebrate';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof multer.MulterError) {
    const bad = new BadRequestError('Ошибка загрузки файла');
    return res.status(bad.statusCode).send({ message: bad.message });
  }

  if (err instanceof Error && err.message.includes('E11000')) {
    const conflict = new ConflictError('Конфликт уникального поля');
    return res.status(conflict.statusCode).send({ message: conflict.message });
  }

  if (isCelebrateError(err)) {
    const bad = new BadRequestError('Переданы некорректные данные');
    return res.status(bad.statusCode).send({ message: bad.message });
  }
  return res
    .status(err.statusCode || 500)
    .send({ message: err.message || 'Ошибка сервера' });
};

export default errorHandler;
