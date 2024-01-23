const { stdin, stdout } = require('process')

let inputsData = ''
let params
let args

stdin.on('data', (data) => {
  inputsData += data.toString('utf-8')
})

stdin.on('end', () => {
  ;[params, args] = inputsData.trim().split('|')
  params = JSON.parse(params.replace(/\\/g, ''))
  main()
})

function main() {
  const inputs = args.split(/\n/)
  const convertedArgs = []

  for (let i = 0; i < inputs.length; i++) {
    const param = params[i]
    const input = inputs[i]
    let temp

    switch (param.type) {
      case 'Integer[]':
      case 'String[]':
        temp = JSON.parse(input)
        break
      case 'Integer':
        temp = parseInt(input)
        break
      case 'Boolean':
        temp = input === 'true' ? true : false
        break
      default:
        temp = input
        break
    }

    convertedArgs.push(temp)
  }

  func(...convertedArgs)
}

let func
