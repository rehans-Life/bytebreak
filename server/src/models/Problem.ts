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

interface IProblem {
  name: string
  user: Types.ObjectId
  slug: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  config: ProblemConfig
  accepted: number
  submissions: number
  acceptanceRate: number
  tags: Types.ObjectId[]
  defaultConfigurations: DefaultConfiguration[]
  sampleTestCases: { input: string; output: string }[]
}

interface IProblemMethods {
  populateDefaultConfigurations: () => Promise<
    HydratedDocument<IProblem, IProblemMethods>
  >
}

type ProblemModel = Model<IProblem, {}, IProblemMethods>
type datatype =
  | 'Boolean'
  | 'String'
  | 'Integer'
  | 'Integer[]'
  | 'String[]'
  | 'Integer[][]'
  | 'String[][]'

interface Param {
  name: string
  type: datatype
}

export interface ProblemConfig {
  funcName: string
  returnType: datatype
  params: Param[]
}

export interface DefaultConfiguration {
  langId: number
  lang: string
  code: string
}

const ProblemConfigSchema = new Schema<ProblemConfig>({
  funcName: {
    type: String,
    required: [true, 'Function name is required'],
    lowercase: true,
  },
  returnType: {
    type: String,
    enum: Object.values(ParamType),
    required: [true, 'Function return type is required'],
  },
  params: {
    validate: {
      validator: function (val: Array<Param>) {
        return val.length >= 1
      },
      message: 'One param is required at minimum',
    },
    type: [
      {
        name: {
          type: String,
        },
        type: {
          type: String,
          enum: Object.values(ParamType),
          default: 'String',
        },
      },
    ],
  },
})

const ProblemSchema = new Schema<IProblem, ProblemModel, IProblemMethods>(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Name of the problem is required'],
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
      type: [Number],
      ref: 'Tag',
      default: [],
    },
    config: {
      type: ProblemConfigSchema,
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

ProblemSchema.pre('save', function (next) {
  if (!this.isModified('name')) return next()

  this.slug = slugify(this.name, {
    lower: true,
    trim: true,
  })

  next()
})

ProblemSchema.method(
  'populateDefaultConfigurations',
  async function (): Promise<HydratedDocument<IProblem, IProblemMethods>> {
    this.defaultConfigurations = await Language.getDefaultConfigrations(
      this.config,
    )
    return this
  },
)

ProblemSchema.virtual('acceptanceRate').get(function (): number {
  return parseInt(((this.accepted / this.submissions) * 100).toFixed(1))
})

ProblemSchema.virtual('sampleTestCases', {
  localField: 'id',
  foreignField: 'problem',
  ref: 'TestCase',
  limit: 3,
  options: {
    fields: {
      input: 1,
      output: 1,
    },
  },
})

export default model<IProblem, ProblemModel>('Problem', ProblemSchema)
