import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

import app from './app'
import keys from '../config/keys'
import Tag from './models/Tag'

const PORT = keys.PORT || 4000
const MONGO_URI = keys.DB_URI

const tags = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/tags.json`, 'utf-8'),
)

;(async () => {
  try {
    await mongoose.connect(MONGO_URI)
    app.listen(PORT, () =>
      console.log(`Server is listening for requests on PORT ${PORT}`),
    )
    await Tag.create(tags)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})()
