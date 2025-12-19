import path from 'path';
import fs from 'fs/promises';
import config from './config';
import BadRequestError from './errors/bad-request-error';

export const moveImageFromTemp = async (fileName: string) => {
  const base = path.basename(fileName); // "abc.png"

  const from = path.join(process.cwd(), 'public', config.UPLOAD_PATH_TEMP, base);
  const to = path.join(process.cwd(), 'public', config.UPLOAD_PATH, base);

  try {
    await fs.rename(from, to);
  } catch {
    throw new BadRequestError('Файл изображения не найден во временной папке');
  }
};

export default moveImageFromTemp;
