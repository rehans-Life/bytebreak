import { HydratedDocument, Model, Schema, Types, model } from 'mongoose'
import slugify from 'slugify'
import Language from './Language'

export enum ParamType {
  Boolean = 'Boolean',
  String = 'String',
  Integer = 'Integer',
  ListInteger = 'Integer[]',
  ListString = 'String[]',
  MatrixInteger = 'Integer[][]',
  MatrixString = 'String[][]',
}

interface IQuestion {
  name: string
  slug: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  config: QuestionConfig
  accepted: number
  submissions: number
  acceptanceRate: number
  tags: Types.ObjectId[]
  defaultConfigurations: DefaultConfiguration[]
  sampleTestCases: { input: string; output: string }[]
}

interface IQuestionMethods {
  populateDefaultConfigurations: () => Promise<
    HydratedDocument<IQuestion, IQuestionMethods>
  >
}

type QuestionModel = Model<IQuestion, {}, IQuestionMethods>

export interface QuestionConfig {
  funcName: string
  returnType: ParamType
  params: {
    name: string
    type:
      | 'Boolean'
      | 'String'
      | 'Integer'
      | 'Integer[]'
      | 'String[]'
      | 'Integer[][]'
      | 'String[][]'
  }[]
}

export interface DefaultConfiguration {
  langId: number
  lang: string
  code: string
}

const QuestionConfigSchema = new Schema<QuestionConfig>({
  funcName: {
    type: String,
    required: [true, 'Function name is required'],
    lowercase: true,
  },
  returnType: {
    enum: Object.values(ParamType),
  },
  params: {
    minlength: [1, 'You should add atleast one parameter'],
    type: [
      {
        name: {
          type: String,
        },
        type: {
          enum: Object.values(ParamType),
          default: 'String',
        },
      },
    ],
  },
})

const QuestionSchema = new Schema<IQuestion, QuestionModel, IQuestionMethods>(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Name of the question is required'],
      trim: true,
    },
    slug: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: '{VALUE} difficulty is not supported',
      },
      default: 'easy',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    accepted: {
      type: Number,
      default: 0,
    },
    submissions: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [Schema.Types.ObjectId],
      ref: 'Tag',
      default: [],
    },
    config: {
      type: QuestionConfigSchema,
      required: [
        true,
        'Please fill in the configuration object with the required fields',
      ],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
)

QuestionSchema.pre('save', function (next) {
  if (!this.isModified('name')) return next()

  this.slug = slugify(this.name, {
    lower: true,
    trim: true,
  })

  next()
})

QuestionSchema.method(
  'populateDefaultConfigurations',
  async function (): Promise<HydratedDocument<IQuestion, IQuestionMethods>> {
    this.defaultConfigurations = await Language.getDefaultConfigrations(
      this.config,
    )
    return this
  },
)

QuestionSchema.virtual('acceptanceRate').get(function (): number {
  return parseInt(((this.accepted / this.submissions) * 100).toFixed(1))
})

QuestionSchema.virtual('sampleTestCases', {
  localField: 'id',
  foreignField: 'question',
  ref: 'TestCase',
  options: {
    fields: {
      input: 1,
      output: 1,
    },
  },
  match: {
    sample: true,
  },
})

export default model<IQuestion, QuestionModel>('Question', QuestionSchema)
