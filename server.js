import mongoose from 'mongoose'
import dotenv from 'dotenv'

process.on('uncaughtException', (err) => {
  console.log('UNHANDLER REJECTION ❌ Shutting down...')
  console.log(err.name, err.message)
  process.exit(1)
})

import { app } from './app.js'

dotenv.config({ path: '.env' })

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)

mongoose.connect(DB).then(() => console.log('DB connection succesful ✅'))

// ! STAR SERVER

const port = process.env.PORT ?? 3000

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION ❌ Shutting down...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})
