import { openSync, readFileSync, closeSync } from 'fs'

export function javascript(func: string) {
  const fh = openSync(`./javacript/driver.js`, 'r')

  const driverContent = readFileSync(fh, { encoding: 'utf-8' })
  const execContent = driverContent.replace(/func/, `func = ${func}`)
  const base64 = Buffer.from(execContent).toString('base64')

  closeSync(fh)

  return base64
}
