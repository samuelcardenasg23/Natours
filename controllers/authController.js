import { promisify } from 'node:util'
import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js'
import { catchAsync } from '../utils/catchAsync.js'
import { AppError } from '../utils/appError.js'

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  })

  const token = signToken(newUser._id)

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  })
})

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400))
  }

  // 2) Check if the user exist && password is correct
  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }

  // 3) If everything is ok, send token to the client
  const token = signToken(user._id)

  res.status(200).json({
    status: 'success',
    token
  })
})

export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting the token and check if exists
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    )
  }

  // 2) Verificate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  // 3) Check if user still exist
  const currentUser = await User.findById(decoded.id)
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does not longer exists.',
        401
      )
    )
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    )
  }

  // GRANT ACCESS TO PROTECTED ROUTES
  // STORING THE USER IN CURRENT
  req.user = currentUser
  next()
})

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles is an array ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      )
    }

    next()
  }