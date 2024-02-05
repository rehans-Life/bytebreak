import { Schema, model } from 'mongoose'
import slugify from 'slugify'

slugify.extend({
  '+': 'p',
  '#': 'sharp',
})

interface ITag {
  _id: number
  name: string
  slug: string
  category: 'topic' | 'language'
}

const TagSchema = new Schema<ITag>({
  _id: Number,
  name: {
    type: String,
    required: [true, 'Please provide the tag name'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
  },
  category: {
    type: String,
    enum: {
      values: ['topic', 'language'],
      message: '{VALUE} category is not supported',
    },
  },
})

TagSchema.pre('save', function (next) {
  if (!this.isModified('name')) return
  this.slug = slugify(this.name, {
    lower: true,
    trim: true,
  })
  next()
})

export default model<ITag>('Tag', TagSchema)
