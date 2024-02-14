import { AppError } from '../utils/appError.js'

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name

  const message = `Duplicate field value: ${value}. Use another value.`

  return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message)

  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const handleJWTError = () =>
  new AppError('Invalid token. Please login again', 401)

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please login again', 401)

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  })
}

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.log('ERROR ❌', err)

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    })
  }
}

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode ?? 500
  err.status = err.status ?? 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production ') {
    let error = Object.create(err)

    if (error.name === 'CastError') error = handleCastErrorDB(error)
    if (error.code === 11000) error = handleDuplicateFieldsDB(error)
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
    if (error.name === 'JsonWebTokenError') error = handleJWTError()
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()

    sendErrorProd(error, res)
  }
}