import fs from 'fs'
import mongoose from 'mongoose'
import Tag from '../src/models/Tag'
import dotenv from 'dotenv'

dotenv.config({
  path: '.env',
})

const tags = (
  JSON.parse(fs.readFileSync(`${__dirname}/tags.json`, 'utf-8')) as any[]
).map((obj, index) => {
  return {
    name: obj.name,
    _id: obj.id || index + 100,
    category: obj.category || 'language',
  }
})

async function importData() {
  await Tag.create(tags)
}

async function deleteData() {
  await Tag.deleteMany()
}

const exec = async () => {
  try {
    const DB_URI = process.env.DB_URI

    await mongoose.connect(
      DB_URI?.replace('<password>', process.env.DB_PASSWORD || '') || '',
    )

    if (process.argv[2] === '--import') {
      await importData()
      process.exit(0)
    }

    if (process.argv[2] === '--delete') {
      await deleteData()
      process.exit(0)
    }
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
exec()
