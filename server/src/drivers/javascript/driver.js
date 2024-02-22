const { stdin, stdout, stderr, exit } = require('process')

let inputsData = ''
let funcName = ''
let returnType = '';
let params = []
let args = ''

stdin.on('data', (data) => {
  inputsData += data.toString('utf-8')
})

stdin.on('end', () => {
  ;[funcName, params, args, returnType] = inputsData.trim().split('|')
  params = JSON.parse(params.replace(/\\/g, ''))
  main()
})

function convertArg(type, input) {
  let temp;

  try {
    switch (type) {
      case 'String[][]':
      case 'Integer[][]':
        temp = JSON.parse(input)
        if(!temp.every((el) => el instanceof Array)) throw TypeError();
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

  if(output instanceof Array) {
    stdout.write(JSON.stringify(output).replace(/\"/g, ""))
  } else {
    stdout.write(output.toString())
  }
}


