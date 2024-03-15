import dev from './dev'
import prod from './prod'

export interface IKeys {
  PORT: number | string
  DB_URI: string
  JWT_SECRET_KEY: string
  JWT_EXPIRES_IN: string
  JWT_COOKIE_EXPIRES_IN: string
  FRONTEND_URI: string
  JUDGE0_API: string
  RAPID_API_HOST: string
  RAPID_API_KEY: string
}

export interface IDevKeys extends IKeys {
  NODE_ENV: 'Development'
  RAPID_API_HOST: string
  RAPID_API_KEY: string
}

export interface IProdKeys extends IKeys {
  NODE_ENV: 'Production'
}

let keys: IDevKeys | IProdKeys

if (process.env.NODE_ENV === 'Development') {
  keys = dev
} else {
  keys = prod
}

export default keys
