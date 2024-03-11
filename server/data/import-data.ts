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
    await mongoose.connect(
      process.env.DB_URI?.replace(
        '<password>',
        process.env.DB_PASSWORD || '',
      ) || '',
    )

    if (process.argv[2] === '--import') {
      await importData()
    }

    if (process.argv[2] === '--delete') {
      await deleteData()
    }
  } catch (err) {
    console.log(err)
  }
}
exec()
