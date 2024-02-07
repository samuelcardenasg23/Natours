import express from 'express'
import { toursRouter } from './routes/tours-routes.js'
import { userRoutes } from './routes/user-routes.js'
import morgan from 'morgan'

const app = express()
app.disable('x-powered-by')

//! MIDDLEWARES
app.use(morgan('dev'))

app.use(express.json())

app.use((req, res, next) => {
  console.log('Hello from the middleware 👌')
  next()
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()

  next()
})

// ! ROUTES

app.use('/api/v1/tours', toursRouter)
app.use('/api/v1/users', userRoutes)

// ! STAR SERVER

const port = process.env.PORT ?? 3000

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
