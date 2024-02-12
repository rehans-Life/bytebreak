import { RequestHandler } from 'express'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/appError'
import z from 'zod'
import Problem from '../models/Problem'
import TestCase, { testcaseSchema } from '../models/TestCase'
import { getAll } from './handlerFactory'
import Tag, { ITag } from '../models/Tag'
import { isValidObjectId } from 'mongoose'
import { getDefaultCodeConfiguration as generateCode } from 'lang-code-configuration'
import { batchSubmission } from './judge0Controller'
import Comment from '../models/Comment'

type Params = {identifier: string}

const testCasesSchema = z.array(testcaseSchema).min(1)

const solutionSchema = z.object({
  languageId: z.any(),
  code: z.string()
})

const configSchema = z.object({
  funcName: z.string(),
  returnType: z.string(),
  params: z.array(z.object({
    name: z.string(),
    type: z.string()
  }))
})

export type TestCases = z.infer<typeof testCasesSchema>

function createQuery(params: Params) {
  const identifier = params.identifier

  if (!identifier) {
    throw new AppError('Please provide an identifier order to get a problem', 404)
  }

  let query;

  if(isValidObjectId(identifier)) {
    query = Problem.findById(identifier);
  } else {
    query = Problem.findOne({ slug: identifier })
  }

  return query;
}

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

    const { solution, config } = req.body;

    solutionSchema.parse(solution);
    configSchema.parse(config)

    const submissions = await batchSubmission(
      solution.code, 
      solution.languageId, 
      config, 
      testcases
    );

    submissions.forEach((submission, i) => {
      const { input, output } = testcases[i];
      if (submission.status.id === 4) {
        throw new AppError(`Expected output: ${output} but recieved ${submission.stdout} from solution code for Input: ${input.split("\n").join(",")}`, 417)
      }

      if (submission.status.id >= 5) {
        console.log(submission.stderr)
        throw new AppError(`An error occured while executing your solution code please try again after fixing it`, 417)
      }
    })

    const problem = await Problem.create({
      ...req.body,
      user: req.user._id
    })

    await Promise.all(
      (testcases as TestCases).map(async (testcase) => {
        return TestCase.create({ ...testcase, problem: problem._id }).catch(
          () => ({}),
        )
      }),
    )

    const editorial = await Comment.create({
      text: req.body.editorial,
      user: req.user._id,
      parentId: problem._id,
    })

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
        editorial,
      },
    })
  },
)

export const getProblem: RequestHandler = catchAsync(async (req, res, next) => {
  let query = createQuery(req.params as Params);

  const problem = await query.populate([{
      path: 'sampleTestCases',
      select: "input output"
    }, {
      path: 'tags',
    }
  ])

  if(!problem) {
    throw new AppError('No problem was found with the given identifier', 404)
  }

  return res.status(200).json({
    status: 'success',
    data: problem
  })
})

export const getEditorial = catchAsync(async (req, res, next) => {
  const problem = await createQuery(req.params as Params)

  if(!problem) {
    throw new AppError('No problem was found with the given identifier', 404)
  }

  const editorial = await Comment.findOne({
    $and: [
      { parentId: problem._id },
      { user: problem.user },
    ]
  })

  return res.status(200).json({
    status: "success",
    data: {
      editorial
    }
  })

})

export const getDefaultConfigurations = catchAsync(async (req, res, next) => {
  const languages = await Tag.find({
    category: 'language'
  }).select("-__v")

  const problem = await createQuery(req.params as Params)

  if(!problem) {
    throw new AppError('No problem was found with the given identifier', 404)
  }

  const {config: {funcName, returnType, params}} = problem;

  const configurations = languages.reduce<({ defaultConfiguration: string} & ITag)[]>((acc, curr) => {
    const config = generateCode(curr.slug as any, funcName, returnType, params)

    if(config) {
      acc.push({
        ...(curr.toObject()),
        defaultConfiguration: config
      })
    }

    return acc;
  }, [])

  return res.status(200).json({
    status: 'success',
    data: {
      languageConfigurations: configurations
    }
  });
})