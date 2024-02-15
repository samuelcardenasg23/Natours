import { User } from '../models/userModel.js'
import { catchAsync } from '../utils/catchAsync.js'
import { AppError } from '../utils/appError.js'

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })

  return newObj
}

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  })
})

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates please use /updateMyPassword',
        400
      )
    )
  }

  // 2) Filtered out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email')

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  })
})

export const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    messagge: 'This route is not yet defined'
  })
}

export const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    messagge: 'This route is not yet defined'
  })
}

export const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    messagge: 'This route is not yet defined'
  })
}

export const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    messagge: 'This route is not yet defined'
  })
}
