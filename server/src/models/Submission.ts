import { Error, Schema, Types, model } from 'mongoose'
import Problem from './Problem'
import AppError from '../utils/appError'
import { ITestCase } from './TestCase'

const statuses = [
  "Accepted",
  "Wrong Answer",
  "Time Limit Exceeded",
  "Compilation Error",
  "Runtime Error (SIGSEGV)",
  "Runtime Error (SIGXFSZ)",
  "Runtime Error (SIGFPE)",
  "Runtime Error (SIGABRT)",
  "Runtime Error (NZEC)",
  "Runtime Error (Other)",
  "Internal Error",
  "Exec Format Error"
] as const;

export type StatusTypes = typeof statuses[number]

interface ISubmission {
  problem: Types.ObjectId
  user: Types.ObjectId
  language: number
  code: string
  runtime: String
  memory: String
  status: StatusTypes
  testCasesPassed: number
  lastExecutedTestcase?: Types.ObjectId
  error?: string
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    problem: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: [true, 'a submission should correspond to a problem']
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'a submission should correspond to a user']
    },
    language: {
      type: Number,
      ref: 'Language',
      required: [true, 'a submission should be written in a specific language']
    },
    lastExecutedTestcase: {
      type: Schema.Types.ObjectId,
      ref: "TestCase"
    },
    code: {
      type: String,
      required: [true, 'code is required for a submission'],
    },
    status: {
      type: String,
      enum: { values: statuses, message: "{VALUE} is not a valid status for a submission" },
      required: [true, 'status code is required for a submission'],
    },
    runtime: {
      type: String,
      default: 'N/A'
    },
    memory: {
      type: String,
      default: 'N/A'
    },
    testCasesPassed: {
      type: Number,
      default: 0,
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
