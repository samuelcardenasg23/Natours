import path from 'node:path'
import express from 'express'
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { toursRouter } from './routes/tours-routes.js'
import { userRouter } from './routes/user-routes.js'
import { reviewsRouter } from './routes/reviewRoutes.js'
import { bookingRouter } from './routes/bookingRoutes.js'
import { viewRouter } from './routes/viewRoutes.js'
import { AppError } from './utils/appError.js'
import { globalErrorHandler } from './controllers/errorController.js'

const __dirname = import.meta.dirname

dotenv.config({ path: '.env' })

export const app = express()
app.disable('x-powered-by')

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

//! GLOBAL MIDDLEWARES
// Serving static files (might use path.join)
app.use(express.static('public'))

// Set security HTTP headers https://github.com/helmetjs/helmet
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false
  })
)

// Further HELMET configuration for Security Policy (CSP)
const scriptSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.7/axios.min.js'
]
const styleSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://fonts.googleapis.com/'
]
const connectSrcUrls = ['https://unpkg.com', 'https://tile.openstreetmap.org']
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com']

//set security http headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
      fontSrc: ["'self'", ...fontSrcUrls]
    }
  })
)

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
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

//Data sanitization against XSS

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  // console.log(req.cookies)

  next()
})

// ! ROUTES
app.use('/', viewRouter)
app.use('/api/v1/tours', toursRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewsRouter)
app.use('/api/v1/bookings', bookingRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in the server!`, 404))
})

app.use(globalErrorHandler)
