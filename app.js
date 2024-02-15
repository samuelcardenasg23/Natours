import express from 'express'
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit'
import dotenv from 'dotenv'
import { toursRouter } from './routes/tours-routes.js'
import { userRouter } from './routes/user-routes.js'
import { AppError } from './utils/appError.js'
import { globalErrorHandler } from './controllers/errorController.js'

dotenv.config({ path: '.env' })

export const app = express()
app.disable('x-powered-by')

//! GLOBAL MIDDLEWARES

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const limiter = rateLimit({
  max: 500, // Limit each IP to 500 requests
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
  // legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})
// Apply this limiter will affect all the routes that start only with /api
app.use('/api', limiter)

app.use(express.json())
app.use(express.static('public'))

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  // console.log(req.headers)

  next()
})

// ! ROUTES

app.use('/api/v1/tours', toursRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in the server!`, 404))
})

app.use(globalErrorHandler)
