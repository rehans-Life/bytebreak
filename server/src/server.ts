import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

import app from './app'
import keys from '../config/keys'

const PORT = keys.PORT || 4000
const MONGO_URI = keys.DB_URI

;(async () => {
  try {
    await mongoose.connect(MONGO_URI)
    app.listen(PORT, () =>
      console.log(`Server is listening for requests on PORT ${PORT}`),
    )
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})()
