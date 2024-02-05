import { Model, Schema, model } from 'mongoose'
import { DefaultConfiguration, ProblemConfig } from './Problem'

interface Types {
  Boolean: string
  String: string
  Integer: string
  'Integer[]': string
  'String[]': string
  'Integer[][]': string
  'String[][]': string
}

interface ILanguage {
  name: 'Javascript' | 'Python' | 'Typescript' | 'Dart' | 'Java' | 'C++'
  types: Types
}

interface LanguageMethods {
  buildCodeConfiguration: (config: ProblemConfig) => string
}

interface LanguageModel extends Model<ILanguage, {}, LanguageMethods> {
  getDefaultConfigrations: (
    config: ProblemConfig,
  ) => Promise<DefaultConfiguration[]>
}

const LanguageSchema = new Schema<ILanguage, LanguageModel, LanguageMethods>({
  name: {
    type: String,
    enum: ['Javascript', 'Python', 'Typescript', 'Dart', 'Java', 'C++'],
    required: [true, 'The language name is required'],
    unique: true,
  },
  types: {
    type: {
      Boolean: String,
      String: String,
      Integer: String,
      'Integer[]': String,
      'String[]': String,
      'Integer[][]': String,
      'String[][]': String,
    },
    select: false,
  },
})

LanguageSchema.method(
  'buildCodeConfiguration',
  function (config: ProblemConfig) {
    let params
    const { funcName, returnType } = config
    switch (this.name) {
      case 'Javascript':
        params = config.params.map(({ name }) => name.toLowerCase()).join(', ')
        return `function ${funcName}(${params}){\n}`
      case 'Python':
        params = config.params
          .map(({ name, type }) => `${name.toLowerCase()}: ${this.types[type]}`)
          .join(', ')
        return `class Solution:\n\tdef ${funcName}(${params}) -> ${this.types[returnType]}:\n`
      case 'Dart':
        params = config.params
          .map(({ name, type }) => `${this.types[type]} ${name.toLowerCase()}`)
          .join(', ')
        return `class Solution {\n\t${this.types[returnType]} ${funcName}(${params}) {\n\t}\n}`
      case 'Typescript':
        params = config.params
          .map(({ name, type }) => `${name.toLowerCase()}: ${this.types[type]}`)
          .join(', ')
        return `function ${funcName}(${params}): ${this.types[returnType]} {\n}`
      case 'Java':
        params = config.params
          .map(({ name, type }) => `${this.types[type]} ${name.toLowerCase()}`)
          .join(', ')
        return `class Solution {\n\tpublic ${this.types[returnType]} ${funcName}(${params}) {\n\t}\n}`
      case 'C++':
        params = config.params
          .map(({ name, type }) => `${this.types[type]} ${name.toLowerCase()}`)
          .join(', ')
        return `class Solution {\npublic:\n\t${this.types[returnType]} ${funcName}(${params}) {\n\t}\n};`
      default:
        return ''
    }
  },
)

LanguageSchema.static(
  'getDefaultConfigrations',
  async function (config: ProblemConfig): Promise<DefaultConfiguration[]> {
    const languages = await Language.find()
    return languages.map((lang) => {
      return {
        lang: lang.name,
        langId: lang.id,
        code: lang.buildCodeConfiguration(config),
      }
    })
  },
)

const Language = model<ILanguage, LanguageModel>('Language', LanguageSchema)
export default Language
