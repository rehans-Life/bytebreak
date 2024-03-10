import { RequestHandler } from 'express'
import catchAsync from '../utils/catchAsync'
import User, { IUser, IUserMethods } from '../models/User'
import { HydratedDocument } from 'mongoose'
import { createOne, deleteOne, getAll, getOne, updateOne } from './handlerFactory'
import AppError from '../utils/appError'
import Submission from '../models/Submission'

export const getMe: RequestHandler = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id
  next()
})

export const updateMe: RequestHandler = catchAsync(async (req, res, _) => {
  const user = (await User.findById(req.user.id)) as HydratedDocument<
    IUser,
    IUserMethods
  >

  user.username = req.body.username
  user.email = req.body.email

  user.save()

  return res.status(200).json({
    status: 'success',
    data: { user },
  })
})

export const deleteMe: RequestHandler = catchAsync(async (req, res, _) => {
  await User.findByIdAndUpdate(
    {
      id: req.user.id,
    },
    {
      active: false,
    },
  )

  return res.status(204).json({
    status: 'success',
    data: null,
  })
})

export const getUsers: RequestHandler = getAll(User)

export const createUser: RequestHandler = createOne(User)

export const getUser: RequestHandler = getOne(User)

export const updateUser: RequestHandler = updateOne(User)

export const deleteUser: RequestHandler = deleteOne(User)

export const userSubmissionsCount: RequestHandler = catchAsync(async (req, res, next) => {
  const username = req.params.username;

  const user = await User.findOne({
    username
  })

  if (!user) throw new AppError("User not found");

  const [submissionCount] = await Submission.aggregate([
    {
      $match: {
        user: user._id,
        status: "Accepted"
      }
    },
    {
      $group: {
        _id: "$problem",
        problem: { $first: "$problem" }
      }
    },
    {
      $lookup: {
        localField: "problem",
        foreignField: "_id",
        as: "problem",
        from: "problems",
        pipeline: [{
          $project: { difficulty: 1 }
        }]
      },
    },
    {
      $unwind: { path: "$problem" }
    },
    {
      $set: {
        difficulty: "$problem.difficulty"
      }
    },
    {
      $group: {
        _id: "",
        total: { $count: {} },
        easy: { $sum: { $cond: {
            if: { $eq: ["$difficulty", "easy"] },
            then: 1,
            else: 0 
          } }
        },
        medium: { $sum: { $cond: {
                if: { $eq: ["$difficulty", "medium"] },
                then: 1,
                else: 0 
            } },
        },
        hard: { $sum: { $cond: {
                if: { $eq: ["$difficulty", "hard"] },
                then: 1,
                else: 0 
            } }
        }
      }
    },
    { $project: { _id: 0 } }
  ])

  return res.status(200).json({
    status: "success",
    data: {
      submissionCount
    }
  })
});

export const userInfo: RequestHandler = catchAsync(async (req, res, next) => {
  const username = req.params.username;

  const [userInfo] = await User.aggregate([
    {
      $match: {
        username,
      },
    },
    {
      $unset: "password"
    },
    {
      $lookup: {
        localField: '_id',
        foreignField: 'user',
        from: 'submissions',
        as: 'solvedByLang',
        pipeline: [
          {
            $match: { status: 'Accepted' }
          },
          {
            $group: { 
              _id: { language: "$language", problem: "$problem" } 
            }
          },
          {
            $replaceRoot: {
              newRoot: '$_id'
            }
          },
          {
            $group: {
              _id: "$language",
              solved: { $count: {} }
            }
          },
          {
            $lookup: {
              localField: '_id',
              foreignField: '_id',
              from: 'tags',
              as: 'language'
            }
          },
          {
            $unwind: { path: "$language", preserveNullAndEmptyArrays: true },
          },
          {
            $project: {
              language: "$language.name",
              solved: "$solved"
            }
          }
        ]
      }
    }
  ]);

  if (!userInfo) throw new AppError("User not found");

  return res.status(200).json({
    status: "success",
    data: {
      userInfo
    }
  })
})

export const userCalender: RequestHandler = catchAsync(async (req, res, next) => {
  const username = req.params.username;

  const user = await User.findOne({
    username
  })

  if (!user) throw new AppError("User not found");

  const today = new Date();
  const backToday = (() => {
    const today = new Date();
    today.setDate(today.getDate() - 366)
    return today;
  })();
  const currYear = today.getFullYear();
  const createdYear = new Date(user.createdAt).getFullYear();

  const activeYears = Array.from(new Array((currYear - createdYear) + 1), (_, i: number) => i + createdYear);
  
  let year: number;

  if(Number.isNaN(parseInt(req.query.year as string))) year = currYear;
  else year = parseInt(req.query.year as string);

  const submissionsCalender = await Submission.aggregate([
    { 
      $match: {
        user: user._id,
        createdAt: {
          $lte: year !== currYear ? new Date(`${year}-12-31`) : today,
          $gte: year !== currYear ? new Date(`${year}-01-01`) : backToday
        }
      } 
    },
    {
      $group: {
        _id: { $dayOfYear: "$createdAt" },
        date: { $first: "$createdAt" },
        submissions: { $count: {} }
      }
    }, 
    {
      $project: {
        _id: 0
      }
    }
  ])

  return res.status(200).json({
    status: "success",
    data: {
      activeYears,
      submissionsCalender,
    }
  })

})
