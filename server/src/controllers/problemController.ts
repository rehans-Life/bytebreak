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

export const getProblemInsights: RequestHandler = catchAsync(
  async (_req, res) => {
    const [insights] =
      (await Problem.aggregate([
        {
          $facet: {
            totals: [
              {
                $group: {
                  _id: null,
                  total: { $sum: 1 },
                  easy: {
                    $sum: {
                      $cond: [{ $eq: ['$difficulty', 'easy'] }, 1, 0],
                    },
                  },
                  medium: {
                    $sum: {
                      $cond: [{ $eq: ['$difficulty', 'medium'] }, 1, 0],
                    },
                  },
                  hard: {
                    $sum: {
                      $cond: [{ $eq: ['$difficulty', 'hard'] }, 1, 0],
                    },
                  },
                },
              },
              { $project: { _id: 0 } },
            ],
            performanceByDifficulty: [
              {
                $group: {
                  _id: '$difficulty',
                  avgAcceptance: {
                    $avg: {
                      $cond: [
                        { $gt: ['$submissions', 0] },
                        { $divide: ['$accepted', '$submissions'] },
                        0,
                      ],
                    },
                  },
                  avgLikes: { $avg: '$likes' },
                  avgSubmissions: { $avg: '$submissions' },
                  total: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  difficulty: '$_id',
                  avgAcceptance: {
                    $round: [{ $multiply: ['$avgAcceptance', 100] }, 1],
                  },
                  avgLikes: { $round: ['$avgLikes', 1] },
                  avgSubmissions: { $round: ['$avgSubmissions', 0] },
                  total: 1,
                },
              },
              { $sort: { difficulty: 1 } },
            ],
            topTags: [
              { $unwind: '$tags' },
              {
                $group: {
                  _id: '$tags',
                  totalProblems: { $sum: 1 },
                  avgAcceptance: {
                    $avg: {
                      $cond: [
                        { $gt: ['$submissions', 0] },
                        { $divide: ['$accepted', '$submissions'] },
                        0,
                      ],
                    },
                  },
                  avgLikes: { $avg: '$likes' },
                },
              },
              { $sort: { totalProblems: -1 } },
              { $limit: 6 },
              {
                $lookup: {
                  from: Tag.collection.name,
                  localField: '_id',
                  foreignField: '_id',
                  as: 'tag',
                },
              },
              { $unwind: '$tag' },
              {
                $project: {
                  _id: 0,
                  id: '$tag._id',
                  name: '$tag.name',
                  slug: '$tag.slug',
                  totalProblems: 1,
                  avgAcceptance: {
                    $round: [{ $multiply: ['$avgAcceptance', 100] }, 1],
                  },
                  avgLikes: { $round: ['$avgLikes', 1] },
                },
              },
            ],
            topProblems: [
              {
                $project: {
                  name: 1,
                  slug: 1,
                  likes: 1,
                  difficulty: 1,
                  acceptanceRate: {
                    $cond: [
                      { $gt: ['$submissions', 0] },
                      {
                        $round: [
                          {
                            $multiply: [
                              { $divide: ['$accepted', '$submissions'] },
                              100,
                            ],
                          },
                          1,
                        ],
                      },
                      0,
                    ],
                  },
                },
              },
              { $sort: { likes: -1 } },
              { $limit: 5 },
            ],
            monthlyAcceptance: [
              {
                $project: {
                  month: {
                    $dateToString: {
                      date: '$createdAt',
                      format: '%Y-%m',
                    },
                  },
                  acceptance: {
                    $cond: [
                      { $gt: ['$submissions', 0] },
                      { $divide: ['$accepted', '$submissions'] },
                      0,
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: '$month',
                  avgAcceptance: { $avg: '$acceptance' },
                  count: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
              {
                $project: {
                  _id: 0,
                  month: '$_id',
                  avgAcceptance: {
                    $round: [{ $multiply: ['$avgAcceptance', 100] }, 1],
                  },
                  count: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            totals: { $arrayElemAt: ['$totals', 0] },
            performanceByDifficulty: 1,
            topTags: 1,
            topProblems: 1,
            monthlyAcceptance: 1,
          },
        },
      ])) || []

    return res.status(200).json({
      status: 'success',
      data:
        insights || {
          totals: { total: 0, easy: 0, medium: 0, hard: 0 },
          performanceByDifficulty: [],
          topTags: [],
          topProblems: [],
          monthlyAcceptance: [],
        },
    })
  },
)

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

    testcases.forEach(({ input }, i) => {
      if (input.split('\n').length !== config.params.length) {
        throw new AppError(
          `The number of inputs in testcase ${i + 1} is not equal to the number of params specified in the configuration`,
          400,
        )
      }
    })

    const submissions = await batchSubmission(
      solution.code,
      solution.languageId,
      config,
      testcases,
    )

    for (let i = 0; i < submissions.length; i++) {
      const submission = submissions[i]
      const { input, output } = testcases[i]

      if (submission.status.id === 4) {
        return res.status(417).json({
          status: submission.status.description,
          message: `Expected output: ${output} but recieved ${submission.stdout} from solution code for Input: ${input.split('\n').join(',')}`,
        })
      }

      if (submission.status.id >= 5) {
        console.log(submission)
        return res.status(417).json({
          status: submission.status.description,
          message: submission.stderr
            ? submission.stderr
            : submission.compile_output
              ? submission.compile_output
              : `An error occured while executing your solution code against the testcases please try again after fixing it`,
        })
      }
    }

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
