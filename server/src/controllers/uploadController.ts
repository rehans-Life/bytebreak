import { NextFunction, Response, Request, RequestHandler } from 'express'
import sharp from 'sharp'
import {storage} from '../../config/firebase'
import { v4 as uuid } from 'uuid'
import catchAsync from '../utils/catchAsync'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import AppError from '../utils/appError'
import { FileFilterCallback } from 'multer'

type MulterFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => void

export const filterImage: MulterFilter = (_, file, callback) => {
  if (!file.mimetype.startsWith('image')) {
    callback(new AppError('File should be an image', 400))
  }
  callback(null, true)
}

export const resizeUserImage: RequestHandler = catchAsync(
  async (req: Request, _: Response, next: NextFunction) => {
    if (req.file)
      req.file.buffer = await sharp(req.file?.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ mozjpeg: true })
        .toBuffer()

    next()
  },
)

export const deleteFile: RequestHandler = catchAsync(async (req, res, next) => {
  if (!req.body.path) {
    throw new AppError(
      'Must provide the file path in order to delete the file',
      404,
    )
  }
})

export const uploadPhoto: RequestHandler = catchAsync(
  async (req, res, next) => {
    if (!req.file) {
      throw new AppError('Please attach an image in order to upload', 404)
    }

    const avatarRef = ref(storage, `avatars/${uuid()}`)
    await uploadBytes(avatarRef, req.file.buffer)

    const url = await getDownloadURL(avatarRef)

    return res.status(200).json({
      status: 'success',
      data: {
        url,
      },
    })
  },
)
