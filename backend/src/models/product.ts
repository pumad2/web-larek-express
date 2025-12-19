import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import config from '../config';

interface IImage {
  fileName: string;
  originalName: string;
}

export interface IProduct {
  title: string;
  image: IImage;
  category: string;
  description: string;
  price: number | null;
}

const imageSchema = new mongoose.Schema<IImage>({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
});

const productSchema = new mongoose.Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Поле "title" должно быть заполнено'],
      unique: true,
      minlength: [2, 'Минимальная длина поля "title" - 2'],
      maxlength: [30, 'Максимальная длина поля "title" - 30'],
    },
    image: {
      type: imageSchema,
      required: [true, 'Поля "image" должны быть заполнены'],
    },
    category: {
      type: String,
      required: [true, 'Поле "category" должно быть заполнено'],
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
      default: null,
    },
  },
  {
    versionKey: false,
  },
);

productSchema.post('findOneAndDelete', (doc) => {
  if (!doc?.image?.fileName) return;

  const fileName = path.basename(doc.image.fileName);
  const filePath = path.join(
    process.cwd(),
    'public',
    config.UPLOAD_PATH,
    fileName,
  );

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
});

export default mongoose.model<IProduct>('product', productSchema);
