import { readFileSync } from 'fs'
import { IProdKeys } from './keys'
import { join } from 'path'

const secret_path = '/run/secrets/'

const getValue = (name: string) =>
  readFileSync(join(secret_path, `${name}_FILE`), 'utf-8')

export default {
  PORT: process.env.PORT || '4000',
  NODE_ENV: 'Production',
  DB_URI:
    getValue('DB_URI')?.replace('<password>', getValue('DB_PASSWORD')) || '',
  JWT_SECRET_KEY: getValue('JWT_SECRET_KEY'),
  JWT_EXPIRES_IN: getValue('JWT_EXPIRES_IN'),
  JWT_COOKIE_EXPIRES_IN: getValue('JWT_COOKIE_EXPIRES_IN'),
  FRONTEND_URI: process.env.FRONTEND_URI,
  JUDGE0_API: process.env.JUDGE0_API,
} as IProdKeys
