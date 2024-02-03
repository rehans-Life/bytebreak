import { Error, Schema, Types, model } from 'mongoose'
import Problem from './Problem'
import AppError from '../utils/appError'

interface ISubmission {
  problem: Types.ObjectId
  user: Types.ObjectId
  language: Types.ObjectId
  code: string
  runtime: number
  memory: number
  status: 'Wrong Answer' | 'Accepted' | 'Runtime Error'
  testCasesPassed: number
  lastExecutedInput?: string
  error?: string
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    problem: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    language: {
      type: Schema.Types.ObjectId,
      ref: 'Language',
    },
    code: {
      type: String,
      required: [true, 'Code is required for a submission'],
    },
    status: {
      type: String,
      enum: ['Wrong Answer', 'Accepted', 'Runtime Error'],
      default: 'Wrong Answer',
    },
    runtime: {
      type: Number,
    },
    memory: {
      type: Number,
    },
    testCasesPassed: {
      type: Number,
    },
    lastExecutedInput: {
      type: String,
    },
    error: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

SubmissionSchema.pre('save', async function (next) {
  try {
    const problem = await Problem.findById(this.problem)

    if (!problem)
      throw new AppError(
        'There is problem corresponding to the submission',
        404,
      )

    problem.submissions += 1

    if (this.status === 'Accepted') problem.accepted += 1

    await problem.save()

    next()
  } catch (err) {
    next(
      new AppError(
        err instanceof Error && err?.message
          ? err.message
          : 'An error occured while submitting the code please try again',
        500,
      ),
    )
  }
})

export default model<ISubmission>('Submission', SubmissionSchema)
