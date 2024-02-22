import { Schema, Types, model } from 'mongoose'
import slugify from 'slugify'

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
  likes: number
  tags: Types.ObjectId[]
  solution: {
    languageId: number,
    code: string
  }
  sampleTestCases: { input: string; output: string }[]
}

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
  }
})

const ProblemSchema = new Schema<IProblem>(
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
      required: [true, 'Users ID is required for creating a problem'],
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
      default: 500000,
    },
    submissions: {
      type: Number,
      default: 1000000,
    },
    likes: {
      type: Number,
      default: 100,
    },
    tags: {
      type: [Number],
      ref: 'Tag',
      default: [],
    },
    solution: {
      type: {
        languageId: {
          type: Number, 
          ref: 'Tag',
          required: [true, 'Solution must be written in a specific language']
        },
        code: { 
          type: String,       
          required: [true, 'The problem requires a solution']
        }
      },
      select: false,
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

ProblemSchema.virtual('acceptanceRate').get(function (): number {
  return parseInt(((this.accepted / this.submissions) * 100).toFixed(1))
})

ProblemSchema.virtual('sampleTestCases', {
  localField: '_id',
  foreignField: 'problem',
  ref: 'TestCase',
  limit: 3,
})

export default model<IProblem>('Problem', ProblemSchema)
