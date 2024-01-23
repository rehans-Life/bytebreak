import { Schema, Types, model } from 'mongoose'

export interface ITestCase {
  id: Types.ObjectId
  question: Types.ObjectId
  input: string
  output: string
  sample: boolean
}

const TestCaseSchema = new Schema<ITestCase>({
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: [true, 'Test case must be related to a question'],
  },
  input: {
    type: String,
    required: [true, 'Test case must have an input'],
  },
  output: {
    type: String,
    required: [true, 'Test case must have an output'],
  },
  sample: {
    type: Boolean,
    default: false,
  },
})

export default model<ITestCase>('TestCase', TestCaseSchema)
