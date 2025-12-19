import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/product';
import moveImage from '../move-image';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find().lean();
    return res.status(200).json({ items: products, total: products.length });
  } catch (err) {
    return next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title, image, category, description, price,
    } = req.body;

    if (image?.fileName) {
      await moveImage(image.fileName);
    }

    const product = await Product.create({
      title, image, category, description, price,
    });
    return res.status(201).json(product);
  } catch (err) {
    return next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new BadRequestError('Невалидный id товара');
    }

    const update = req.body;

    if (update?.image?.fileName) {
      await moveImage(update.image.fileName);
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      update,
      { new: true, runValidators: true },
    );

    if (!product) {
      throw new NotFoundError('Товар не найден');
    }

    return res.status(200).send(product);
  } catch (err) {
    return next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new BadRequestError('Переданный _id товара невалиден');
    }

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      throw new NotFoundError('Товар не найден');
    }

    return res.status(200).send(product);
  } catch (err) {
    return next(err);
  }
};
