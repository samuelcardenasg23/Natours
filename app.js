import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { toursRouter } from './routes/tours-routes.js'
import { userRouter } from './routes/user-routes.js'
import { AppError } from './utils/appError.js'
import { globalErrorHandler } from './controllers/errorController.js'

dotenv.config({ path: '.env' })

export const app = express()
app.disable('x-powered-by')

//! MIDDLEWARES

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.static('public'))

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()

  next()
})

// ! ROUTES

app.use('/api/v1/tours', toursRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in the server!`, 404))
})

app.use(globalErrorHandler)
