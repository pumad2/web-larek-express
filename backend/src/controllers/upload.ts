import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../errors/bad-request-error';
import config from '../config';

export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new BadRequestError('Файл не передан');
    }

    res.status(201).send({
      fileName: `/${config.UPLOAD_PATH}/${req.file.filename}`,
      originalName: req.file.originalname,
    });
  } catch (err) {
    next(err);
  }
};

export default uploadFile;
