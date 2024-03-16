import { RequestHandler } from 'express'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/appError'
import z from 'zod'
import Problem from '../models/Problem'
import TestCase, { testcaseSchema } from '../models/TestCase'
import Tag, { ITag } from '../models/Tag'
import { isValidObjectId } from 'mongoose'
import { getDefaultCodeConfiguration as generateCode } from 'lang-code-configuration'
import { batchSubmission } from './judge0Controller'
import Comment from '../models/Comment'
import { PaginateProbelmQuery } from '../utils/apiFeatures'
import { paginationPipeline } from '../utils/paginationPipeline'

type Params = { identifier: string }

const testCasesSchema = z.array(testcaseSchema).min(1)

const solutionSchema = z.object({
  languageId: z.any(),
  code: z.string(),
})

const configSchema = z.object({
  funcName: z.string(),
  returnType: z.string(),
  params: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
    }),
  ),
})

export type TestCases = z.infer<typeof testCasesSchema>

function createQuery(params: Params) {
  const identifier = params.identifier

  if (!identifier) {
    throw new AppError(
      'Please provide an identifier order to get a problem',
      404,
    )
  }

  let query

  if (isValidObjectId(identifier)) {
    query = Problem.findById(identifier)
  } else {
    query = Problem.findOne({ slug: identifier })
  }

  return query
}

interface Itr<O, K> {
  obj: O
  key: K
}

export const parseTagsField: RequestHandler = catchAsync(
  async (req, _, next) => {
    const { filter } = req.query as unknown as PaginateProbelmQuery

    function recurse(obj: { [key: string]: any } | Array<any>) {
      if (obj instanceof Array) {
        obj.forEach((_, key) => helper({ obj, key }))
        return
      }

      Object.keys(obj).forEach((key) => helper({ obj, key }))
    }

    function helper({
      obj,
      key,
    }: Itr<{ [key: string]: any }, string> | Itr<Array<any>, number>) {
      if (obj instanceof Array) {
        if (typeof obj[key as number] === 'string') {
          obj[key as number] = Number(obj[key as number])
          return
        }

        recurse(obj[key as number])
        return
      }

      if (typeof obj[key as string] === 'string') {
        obj[key as string] = Number(obj[key as string])
        return
      }

      recurse(obj[key as string])
      return
    }

    if (!filter.tags) return next()

    if (typeof filter.tags === 'string') {
      filter.tags = Number(filter.tags)
      return next()
    }

    if (filter.tags instanceof Array) {
      filter.tags = filter.tags.map((tag) => Number(tag))
      return next()
    }

    Object.keys(filter.tags).forEach((key) => helper({ obj: filter.tags, key }))
    next()
  },
)

export const getProblems: RequestHandler = catchAsync(async (req, res) => {
  let { page, limit } = req.query as unknown as PaginateProbelmQuery
  const { fields, filter } = req.query as unknown as PaginateProbelmQuery

  if (!page) page = '1'
  if (!limit) limit = '10'

  const [problems] = await Problem.aggregate(
    req.user
      ? [
          ...Problem.aggregate()
            .lookup({
              localField: '_id',
              foreignField: 'problem',
              from: 'submissions',
              as: 'status',
              pipeline: [
                {
                  $match: {
                    user: req.user._id,
                  },
                },
                {
                  $group: {
                    _id: null,
                    statuses: { $push: '$status' },
                  },
                },
                {
                  $project: {
                    status: {
                      $reduce: {
                        input: '$statuses',
                        initialValue: 'attempted',
                        in: {
                          $cond: {
                            if: { $eq: ['$$this', 'Accepted'] },
                            then: 'solved',
                            else: '$$value',
                          },
                        },
                      },
                    },
                  },
                },
              ],
            })
            .unwind({
              path: '$status',
              preserveNullAndEmptyArrays: true,
            })
            .append({
              $set: {
                status: {
                  $cond: {
                    if: {
                      $or: [
                        { $eq: ['$status.status', 'solved'] },
                        { $eq: ['$status.status', 'attempted'] },
                      ],
                    },
                    then: '$status.status',
                    else: 'todo',
                  },
                },
                user: {
                  $toString: '$user',
                },
              },
            })
            .pipeline(),
          ...paginationPipeline(Problem, 'problems', {
            page,
            fields,
            limit,
            filter,
          }),
        ]
      : paginationPipeline(Problem, 'problems', {
          page,
          fields,
          limit,
          filter,
        }),
  )

  return res.status(200).json({
    status: 'success',
    data: problems || {
      problems: [],
      total: 0,
      maxPage: 1,
    },
  })
})

export const createProblem: RequestHandler = catchAsync(
  async (req, res, next) => {
    let testcases: TestCases = []
    try {
      testcases = JSON.parse(req.file?.buffer.toString('utf-8') ?? '')
    } catch (err) {
      next(new AppError('File content cannot be parsed into JSON', 400))
      return
    }

    testCasesSchema.parse(testcases)

    const { solution, config } = req.body

    solutionSchema.parse(solution)
    configSchema.parse(config)

    const submissions = await batchSubmission(
      solution.code,
      solution.languageId,
      config,
      testcases,
    )

    submissions.forEach((submission, i) => {
      const { input, output } = testcases[i]
      if (submission.status.id === 4) {
        throw new AppError(
          `Expected output: ${output} but recieved ${submission.stdout} from solution code for Input: ${input.split('\n').join(',')}`,
          417,
        )
      }

      if (submission.status.id >= 5) {
        console.log(submission)
        throw new AppError(
          `An error occured while executing your solution code against the testcases please try again after fixing it`,
          417,
        )
      }
    })

    const problem = await Problem.create({
      ...req.body,
      user: req.user._id,
    })

    const addedTestcases = await Promise.all(
      (testcases as TestCases).map(async (testcase) => {
        return TestCase.create({ ...testcase, problem: problem._id }).catch(
          () => ({}),
        )
      }),
    )

    problem.totalTestcases = addedTestcases.reduce<number>((acc, curr) => {
      if (!Object.entries(curr).length) return acc
      return acc + 1
    }, 0)

    await problem.save()

    const editorial = await Comment.create({
      text: req.body.editorial,
      user: req.user._id,
      parentId: problem._id,
    })

    await Problem.populate(problem, {
      path: 'sampleTestCases',
    })

    await Problem.populate(problem, {
      path: 'tags',
    })

    return res.status(201).json({
      status: 'success',
      data: {
        problem,
        editorial,
      },
    })
  },
)

export const getProblem: RequestHandler = catchAsync(async (req, res, next) => {
  const query = createQuery(req.params as Params)

  const problem = await query.populate([
    {
      path: 'sampleTestCases',
      select: 'input output',
    },
    {
      path: 'tags',
    },
  ])

  if (!problem) {
    throw new AppError('No problem was found with the given identifier', 404)
  }

  return res.status(200).json({
    status: 'success',
    data: problem,
  })
})

export const getEditorial = catchAsync(async (req, res, next) => {
  const problem = await createQuery(req.params as Params)

  if (!problem) {
    throw new AppError('No problem was found with the given identifier', 404)
  }

  const editorial = await Comment.findOne({
    $and: [{ parentId: problem._id }, { user: problem.user }],
  })

  return res.status(200).json({
    status: 'success',
    data: {
      editorial,
    },
  })
})

export const getDefaultConfigurations = catchAsync(async (req, res, next) => {
  const languages = await Tag.find({
    category: 'language',
  }).select('-__v')

  const problem = await createQuery(req.params as Params)

  if (!problem) {
    throw new AppError('No problem was found with the given identifier', 404)
  }

  const {
    config: { funcName, returnType, params },
  } = problem

  const configurations = languages.reduce<
    ({ defaultConfiguration: string } & ITag)[]
  >((acc, curr) => {
    const config = generateCode(curr.slug as any, funcName, returnType, params)

    if (config) {
      acc.push({
        ...curr.toObject(),
        defaultConfiguration: config,
      })
    }

    return acc
  }, [])

  return res.status(200).json({
    status: 'success',
    data: {
      languageConfigurations: configurations,
    },
  })
})
