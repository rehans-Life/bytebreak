import { openSync, readFileSync, closeSync } from 'fs'
import { join } from 'path'

function createExecContent(path: string, convert: (driverContent: string) => string): string {
  const fh = openSync(join(__dirname, path), 'r')

  const driverContent = readFileSync(fh, { encoding: 'utf-8' })
  const execContent = convert(driverContent)

  const base64 = Buffer.from(execContent).toString('base64')

  closeSync(fh)

  return base64
}

export const dart = (code: string) => createExecContent('/dart/driver.dart', (driverContent) => {
  return driverContent.replace(/class Solution {}/, code);
}); 


export const javascript = (code: string) => createExecContent(`/javascript/driver.js`, (driverContent) => `${code}\n${driverContent}` )


export const python = (code: string) => createExecContent('/python/driver.py', (driverContent) => {
  return driverContent.replace(/class Solution: pass/, code)
}); 

export const typescript = (code: string) =>  createExecContent('/dart/driver.dart', (driverContent) => `${code}\n${driverContent}`); 
