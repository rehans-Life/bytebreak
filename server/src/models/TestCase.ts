import { Schema, Types, model } from 'mongoose'

export interface ITestCase {
  id: string
  problem: Types.ObjectId
  input: string
  output: string
  sample: boolean
}

const TestCaseSchema = new Schema<ITestCase>({
  problem: {
    type: Schema.Types.ObjectId,
    ref: 'Problem',
    required: [true, 'Test case must be related to a problem'],
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
