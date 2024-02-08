import mongoose from 'mongoose'
import dotenv from 'dotenv'

import { app } from './app.js'

dotenv.config({ path: '.env' })

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)

mongoose.connect(DB).then(() => console.log('DB connection succesful ✅'))

// ! STAR SERVER

const port = process.env.PORT ?? 3000

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
