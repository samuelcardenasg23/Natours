import express from 'express'
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { toursRouter } from './routes/tours-routes.js'
import { userRouter } from './routes/user-routes.js'
import { AppError } from './utils/appError.js'
import { globalErrorHandler } from './controllers/errorController.js'

dotenv.config({ path: '.env' })

export const app = express()
app.disable('x-powered-by')

//! GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet())

// Development loggin
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Limit requests from same api
const limiter = rateLimit({
  max: 500, // Limit each IP to 500 requests
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
  // legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})
// Apply this limiter will affect all the routes that start only with /api
app.use('/api', limiter)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }))

// Serving static files
app.use(express.static('public'))

// Test middleware
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
