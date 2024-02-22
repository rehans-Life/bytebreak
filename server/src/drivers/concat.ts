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

export const java = (code: string) => createExecContent('/java/driver.java', (driverContent) => {
  const imports: string[] = [];

  code = code.replace(/import\s.*;/gm, (match) => {
    imports.push(match);
    return "";
  })
  
  driverContent = `${imports.join("\n")}\n${driverContent}`;

  const execContent = driverContent.replace(/class Solution {}/, code);

  return execContent;
}); 

export const cpp = (code: string, funcName: string) => createExecContent('/cpp/driver.cpp', (driverContent) => {
  return driverContent.replace(/class Solution {}/, code).replace(/func_name/g, funcName);
}); 

export const javascript = (code: string) => createExecContent(`/javascript/driver.js`, (driverContent) => `${code}\n${driverContent}` )

export const python = (code: string) => createExecContent('/python/driver.py', (driverContent) => {
  return driverContent.replace(/class Solution: pass/, code)
}); 
