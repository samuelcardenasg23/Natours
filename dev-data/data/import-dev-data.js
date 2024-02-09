import fs from 'node:fs'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Tour } from '../../models/tourModel.js'

dotenv.config({ path: '.env' })

const __dirname = import.meta.dirname

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)

mongoose.connect(DB).then(() => console.log('DB connection succesful ✅'))

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
)

// IMPORT DATA TO DB
const importData = async () => {
  try {
    await Tour.create(tours)
    console.log('Data succesfully loaded ✅')
  } catch (err) {
    console.log(err)
  }
  process.exit()
}

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log('Data succesfully deleted ✅')
  } catch (err) {
    console.log(err)
  }
  process.exit()
}

if (process.argv[2] === '--import') {
  importData()
} else if (process.argv[2] === '--delete') {
  deleteData()
}
