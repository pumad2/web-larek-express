import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import config from './config';

export const moveImageFromTemp = async (fileName: string) => {
  const base = path.basename(fileName);

  const from = path.join(process.cwd(), 'public', config.UPLOAD_PATH_TEMP, base);
  const to = path.join(process.cwd(), 'public', config.UPLOAD_PATH, base);

  if (!fs.existsSync(from)) return;

  await fsPromises.rename(from, to);
};

export default moveImageFromTemp;
