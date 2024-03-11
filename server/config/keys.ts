export default {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DB_URI: process.env.DB_URI!.replace('<password>', process.env.DB_PASSWORD!),
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
  FRONTEND_URI: process.env.FRONTEND_URI,
  JUDGE0_API: process.env.JUDGE0_API,
  RAPID_API_HOST: process.env.RAPID_API_HOST,
  RAPID_API_KEY: process.env.RAPID_API_KEY,
} as {
  PORT: number | string
  NODE_ENV: 'Development' | 'Production' | 'CI'
  DB_URI: string
  JWT_SECRET_KEY: string
  JWT_EXPIRES_IN: string
  JWT_COOKIE_EXPIRES_IN: string
  FRONTEND_URI: string
  JUDGE0_API: string
  RAPID_API_HOST: string
  RAPID_API_KEY: string
}
