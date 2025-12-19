import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import cookieParser from 'cookie-parser';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import authRouter from './routes/auth';
import uploadRouter from './routes/upload';
import errorHandler from './middlewares/error-handler';
import { requestLogger, errorLogger } from './middlewares/logger';
import config from './config';

const app = express();

app.use(requestLogger);
app.use(cors({
  origin: config.ORIGIN_ALLOW,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(config.DB_ADDRESS);

app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);

app.use(errorLogger);
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Server started on port ${config.PORT}`);
});
