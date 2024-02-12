const { stdin, stdout, stderr, exit } = require('process')

type datatype =
  | 'Boolean'
  | 'String'
  | 'Integer'
  | 'Integer[]'
  | 'String[]'
  | 'Integer[][]'
  | 'String[][]'

export interface Param {
  name: string
  type: datatype
}

let inputsData = ''
let funcName = ''
let params: Param[] = []
let args = ''

stdin.on('data', (data: Buffer) => {
  inputsData += data.toString('utf-8')
})

stdin.on('end', () => {
  let paramStr: string = '';
  [funcName, paramStr, args] = inputsData.trim().split('|')
  params = JSON.parse(paramStr.replace(/\\/g, ''))
  main()
})


function convertArg(type: datatype, input: string) {
  let temp;

  try {
    switch (type) {
      case 'String[][]':
      case 'Integer[][]':
        temp = JSON.parse(input)
        if(!temp.every((el: any) => el instanceof Array)) throw TypeError();
        return temp

      case 'Integer[]':
      case 'String[]':
        return JSON.parse(input)

      case 'Integer':
        temp = parseInt(input)
        if(Number.isNaN(temp)) throw TypeError();
        return temp
        
      case 'Boolean':
        return input === 'true' ? true : false
      default:
        return input
    }
  } catch (err) {
    stderr.write(`${input} is not a valid value of type ${type}`)
    exit(1)
  }
}


function main() {
  const inputs = args.split(/\n/)
  const convertedArgs = []

  for (let i = 0; i < inputs.length; i++) {
    const param = params[i]
    const input = inputs[i]

    convertedArgs.push(convertArg(param.type, input))
  }

  const output = eval(funcName)(...convertedArgs)

  stdout.write(output.toString())
}


