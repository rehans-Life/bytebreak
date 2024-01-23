import { Error, Schema, Types, model } from 'mongoose'
import Question from './Question'

interface ISubmission {
  question: Types.ObjectId
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
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
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
      enum: ['Wrong Answer', 'Accepted'],
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
    const question = await Question.findById(this.question)

    if (!question)
      throw new Error('There is question corresponding to the submission')

    question.submissions += 1

    if (this.status === 'Accepted') question.accepted += 1

    await question.save()

    next()
  } catch (err) {
    next(
      new Error(
        err instanceof Error && err?.message
          ? err.message
          : 'An error occured while submitting the code please try again',
      ),
    )
  }
})

export default model<ISubmission>('Submission', SubmissionSchema)
