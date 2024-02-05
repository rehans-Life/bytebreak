import { RequestHandler } from 'express'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/appError'
import z from 'zod'
import Problem from '../models/Problem'
import TestCase from '../models/TestCase'
import { getAll } from './handlerFactory'

const testCasesSchema = z.array(
  z.object({
    output: z.string(),
    input: z.string(),
  }),
)

type TestCases = z.infer<typeof testCasesSchema>

export const getProblems = getAll(Problem)

export const createProblem: RequestHandler = catchAsync(
  async (req, res, next) => {
    try {
      var testcases = JSON.parse(req.file?.buffer.toString('utf-8') ?? '')
    } catch (err) {
      next(new AppError('File content cannot be parsed into JSON', 400))
      return
    }

    testCasesSchema.parse(testcases)

    const problem = await Problem.create(req.body)

    const insertedTestcases = await Promise.all(
      (testcases as TestCases).map(async (testcase) => {
        return TestCase.create({ ...testcase, problem: problem._id }).catch(
          () => ({}),
        )
      }),
    )

    await Problem.populate(problem, {
      path: 'testcases',
    })

    await Problem.populate(problem, {
      path: 'tags',
    })

    return res.status(201).json({
      status: 'success',
      data: {
        problem,
        testcases: insertedTestcases,
      },
    })
  },
)

export const getProblem: RequestHandler = catchAsync(async (req, res, next) => {
  const slug = req.params.slug

  if (!slug) {
    throw new AppError('Please provide a slugin order to get a problem', 400)
  }

  const problem = await Problem.findOne({
    slug,
  })
    .populate({
      path: 'tags',
    })
    .populate({
      path: 'sampleTestCases',
    })

  return res.status(200).json({
    status: 'success',
    data: {
      problem,
    },
  })
})
