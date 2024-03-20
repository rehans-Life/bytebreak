from sys import stderr, stdin, stdout, exit
from typing import List
from json import loads, dumps 
import re

class Solution: pass

input = stdin.read()

funcName = ''
params = {}
args = []

inputs = input.split("|")

funcName = inputs[0]
params = loads(inputs[1].replace("\\", ""))
args = inputs[2].split("\n")

def convertToType(type: str, arg: str):
    try:
        if type in ['Integer[]', 'String[]']:
            return loads(arg)
        elif type in ['Integer[][]', 'String[][]']:
            temp = loads(arg)

            if (len(filter(lambda el: isinstance(el, list), temp)) != len(temp)):
                raise TypeError()
        
            return temp

        elif type == 'Integer':
            return int(arg)
        elif type == 'Boolean':
            return  True if arg == 'true' else False
        else: 
            return arg
    except:
        stderr.write('% s is not a valid value of type % s' % (arg, type))
        exit(1)

def main():
    convertedArgs = []

    for i in range(len(params)):
        param = params[i]
        arg = args[i]

        convertedArgs.append(convertToType(param['type'], arg))

    solution = Solution()

    output = getattr(solution, funcName)(*convertedArgs)

    if(isinstance(output, list)):
        stdout.write(re.sub("\s|\"", "", dumps(output)))
    else:
        stdout.write(str(output))

main()
