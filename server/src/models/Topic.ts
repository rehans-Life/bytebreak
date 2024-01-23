import { Schema, model } from 'mongoose'

interface ITag {
  name: string
}

const TagSchema = new Schema<ITag>({
  name: {
    type: String,
    required: [true, 'Please provide the tag name'],
    unique: true,
    trim: true,
  },
})

export default model<ITag>('Tag', TagSchema)
