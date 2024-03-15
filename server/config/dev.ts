import { IDevKeys } from './keys'

export default {
  PORT: process.env.PORT || '4000',
  NODE_ENV: 'Development',
  DB_URI:
    process.env.DB_URI?.replace('<password>', process.env.DB_PASSWORD!) || '',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
  FRONTEND_URI: process.env.FRONTEND_URI,
  JUDGE0_API: process.env.JUDGE0_API,
  RAPID_API_HOST: process.env.RAPID_API_HOST,
  RAPID_API_KEY: process.env.RAPID_API_KEY,
} as IDevKeys
