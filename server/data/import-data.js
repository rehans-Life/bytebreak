import fs from 'fs'
import mongoose from 'mongoose'
import Tag from '../dist/src/models/Tag.js'
import dotenv from 'dotenv'

dotenv.config({
  path: '.env',
})

const tags = JSON.parse(fs.readFileSync(`${__dirname}/tags.json`, 'utf-8'))

;(async () => {
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
})()

async function importData() {
  await Tag.create(tags)
}

async function deleteData() {
  await Tag.deleteMany()
}
