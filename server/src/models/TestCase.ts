import { Schema, Types, model } from 'mongoose'
import z from 'zod';

export const testcaseSchema = z.object({
    output: z.string(),
    input: z.string(),
});

const testCasesDBSchema = testcaseSchema.extend({
  problem: z.instanceof(Types.ObjectId)
})

export type ITestCase = z.infer<typeof testCasesDBSchema>

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
})

export default model<ITestCase>('TestCase', TestCaseSchema)
