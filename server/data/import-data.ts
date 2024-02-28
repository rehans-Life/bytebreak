import fs from 'fs'
import mongoose from 'mongoose'
import Tag from '../src/models/Tag'
import dotenv from 'dotenv'
import Problem from '../src/models/Problem'

dotenv.config({
  path: '.env',
})

let tags = (
  JSON.parse(fs.readFileSync(`${__dirname}/tags.json`, 'utf-8')) as any[]
).map((obj, index) => {
  return {
    name: obj.name,
    _id: obj.id || index + 100,
    category: obj.category || 'language',
  }
})

;(async () => {
  try {
    await mongoose.connect(
      process.env.DB_URI?.replace(
        '<password>',
        process.env.DB_PASSWORD || '',
      ) || '',
    )

    const problems = await Problem.aggregate()
    .lookup({
      localField: "_id",
      foreignField: "problem",
      from: 'submissions',
      as: 'status',
      pipeline: [
        {
          $match: {
            user: new mongoose.Types.ObjectId("65c0d2d653bad783b5dc41bc")
          }
        },
      ]
      })
      .match({
        tags: {
          $all: ['103']
        }
      })
    .project("name slug difficulty accepted submissions status" as unknown as { [key: string]: any })
    .skip(1 * 4)
    

    console.log(problems)

    // if (process.argv[2] === '--import') {
    //   await importData()
    // }

    // if (process.argv[2] === '--delete') {
    //   await deleteData()
    // }
  } catch (err) {
    console.log(err)
  }
})()

async function importData() {
  await Tag.create(tags)
}

async function deleteData() {
  await Tag.deleteMany()
}
