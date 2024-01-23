import { Model, Schema, model } from 'mongoose'
import { DefaultConfiguration, QuestionConfig } from './Question'

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
  name: 'JavaScript' | 'Python' | 'Typescript' | 'Dart' | 'Java' | 'C++'
  types: Types
}

interface LanguageMethods {
  buildCodeConfiguration: (config: QuestionConfig) => string
}

interface LanguageModel extends Model<ILanguage, {}, LanguageMethods> {
  getDefaultConfigrations: (
    config: QuestionConfig,
  ) => Promise<DefaultConfiguration[]>
}

const LanguageSchema = new Schema<ILanguage, LanguageModel, LanguageMethods>({
  name: {
    enum: ['JavaScript', 'Python', 'Typescript', 'Dart', 'Java', 'C++'],
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
  function (config: QuestionConfig) {
    let params
    const { funcName, returnType } = config
    switch (this.name) {
      case 'JavaScript':
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
  async function (config: QuestionConfig): Promise<DefaultConfiguration[]> {
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
