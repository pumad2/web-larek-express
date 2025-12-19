import { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequest from '../errors/bad-request-error';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, total } = req.body;

    const products = await Product.find({ _id: { $in: items } }).select('_id price');
    if (products.length !== items.length) {
      throw new BadRequest('Некоторые товары не найдены');
    }

    const noPrice = products.find((i) => i.price === null);
    if (noPrice) {
      throw new BadRequest('Некоторые товары недоступны для продажи');
    }

    const sum = products.reduce((s, p) => s + (p.price ?? 0), 0);
    if (sum !== total) {
      throw new BadRequest('Неверная сумма заказа');
    }

    const id = faker.string.uuid();
    return res.status(200).json({ id, total });
  } catch (err) {
    return next(err);
  }
};

export default createOrder;
