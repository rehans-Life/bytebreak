import 'dart:io';
import 'dart:mirrors';
import 'dart:convert';

class Solution {}

void main() {
    String inputs = '';

    stdin.listen(
      (event) {
        inputs += String.fromCharCodes(event);
      },
      onDone: () {
        execute(inputs.split("|")); 
      }
    );
}

dynamic convertArg({
  required String type,
  required String arg
}) {
  try {
    switch (type) {
      case 'Integer[][]':
      case 'String[][]':
        final temp = jsonDecode(arg);

        if(!temp.every((el) => el is List)) {
          throw Exception();
        }

        return temp;

      case 'Integer[]':
      case 'String[]':
        return jsonDecode(arg);
      case 'Integer':
        return int.parse(arg);
      case 'Boolean':
        return arg == 'true' ? true : false;
      default:
        return arg;
    }
  } catch (err) {
    stderr.write("$arg is not valid value of type $arg");
    exit(1);
  }
}

void eval({
  required String funcName,
  required Solution solution,
  required List<dynamic> args,
}) {
  final reflection = reflect(solution);

  final variables = reflection.type.declarations.values;
  final attr = variables.firstWhere((el) => MirrorSystem.getName(el.simpleName) == funcName);

  stdout.write(reflection.invoke(attr.simpleName, args));
}

void execute(List<String> inputs) {
    final funcName = inputs[0];
    final params = jsonDecode(inputs[1].replaceAll(RegExp(r'\\'), ''));
    final args = inputs[2].split(RegExp(r'\n'));

    List<dynamic> convertedArgs = [];

    for (var i = 0; i < params.length; i++) {
      final param = params[i];
      final arg = args[i];

      convertedArgs.add(convertArg(type: param['type'], arg: arg));
    }

    final solution = Solution();
    final reflection = reflect(solutiobn)

    eval(funcName: funcName, solution: solution, args: args);
}
