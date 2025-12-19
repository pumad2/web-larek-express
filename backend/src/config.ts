import 'dotenv/config';

const {
  PORT,
  DB_ADDRESS,
  UPLOAD_PATH,
  UPLOAD_PATH_TEMP,
  ORIGIN_ALLOW,
  AUTH_REFRESH_TOKEN_EXPIRY,
  AUTH_ACCESS_TOKEN_EXPIRY,
  JWT_ACCESS_KEY,
  JWT_REFRESH_KEY,
} = process.env;

const config = {
  PORT: Number(PORT) || 3000,
  DB_ADDRESS: DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek',
  UPLOAD_PATH: UPLOAD_PATH || 'images',
  UPLOAD_PATH_TEMP: UPLOAD_PATH_TEMP || 'temp',
  ORIGIN_ALLOW: ORIGIN_ALLOW || 'http://localhost:5173',
  AUTH_REFRESH_TOKEN_EXPIRY: AUTH_REFRESH_TOKEN_EXPIRY || '7d',
  AUTH_ACCESS_TOKEN_EXPIRY: AUTH_ACCESS_TOKEN_EXPIRY || '1m',
  JWT_ACCESS_KEY: JWT_ACCESS_KEY || 'secret-access-key',
  JWT_REFRESH_KEY: JWT_REFRESH_KEY || 'secret-refresh-key',
};

export default config;
