import { RequestHandler } from 'express'
import Tour from '../models/Tag'
import { getAll } from './handlerFactory'
import catchAsync from '../utils/catchAsync'
import Like from '../models/Like'
import mongoose, { HydratedDocument } from 'mongoose'
import capitalize from 'capitalize'
import AppError from '../utils/appError'
import { statuses } from '../models/Submission'

export const getTags: RequestHandler = getAll(Tour)

export const getStatuses: RequestHandler = catchAsync(async (_, res) => {
    return res.status(200).json({
        status: "success",
        data: {
            statuses 
        }
    });
})

export const setRef: (name: string) => RequestHandler = (name) => (req, res, next) => {
    req.ref = name;
    next()
}

export const getParent = async function (ref: string, id: string): Promise<HydratedDocument<any, any>> {
    const parentDoc: HydratedDocument<any, any> = await mongoose
      .model(capitalize(ref))
      .findById(id)
  
    if (!parentDoc) {
      throw new AppError('There is no parent corresponding to the like', 404)
    }
    return parentDoc
  }

export const getLike: RequestHandler = catchAsync(async (req, res) => {
    const id = req.params.id;

    const like = await Like.findOne({
        parent: id,
        user: req.user._id,
    });

    if(!like) throw new AppError("User hasn't liked the document yet", 404)

    return res.status(200).json({
        status: "success",
        data: like,
    });
});

export const createLike: RequestHandler = catchAsync(async (req, res) => {
    console.log(req.url);
    const id = req.params.id;

    const parent = await getParent(req.ref, id)

    let like  = await Like.create({
        parent: id,
        user: req.user._id,
        ref: req.ref
    });

    const oldLikes = parent.likes || 0;

    try {
        parent.likes += 1
        await parent.save()
    } catch (err) {
        await Like.deleteOne({
            _id: like._id
        })

        parent.likes = oldLikes;
        await parent.save({
            validateModifiedOnly: true
        })

        throw err;
    }

    return res.status(201).json({
        status: 'success',
        data: like
    })
})

export const deleteLike: RequestHandler = catchAsync(async (req, res) => {
    const id = req.params.id;

    const like = await Like.findOne({
        parent: id,
        user: req.user._id,
    });
    
    if(!like) {
        throw new AppError('Invalid like info', 404)
    }
    
    const parent = await getParent(like.ref, id);

    parent.likes -= 1
    await parent.save({
        validateModifiedOnly: true
    }) 

    try {
        await Like.deleteOne({
            _id: like._id
        })
    } catch (err) {
        parent.likes += 1
        await parent.save({
            validateModifiedOnly: true
        }) 
        throw err;
    }

    res.status(204).json({
        status: "success",
        data: null
    })
});





