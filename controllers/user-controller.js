import { User } from '../models/userModel.js'
import { catchAsync } from '../utils/catchAsync.js'
import { AppError } from '../utils/appError.js'
import { deleteOne, getAll, getOne, updateOne } from './handlerFactory.js'

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })

  return newObj
}

const getMe = (req, res, next) => {
  req.params.id = req.user.id
  next()
}

const updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file)
  console.log(req.body)

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

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status: 'success',
    data: null
  })
})

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    messagge: 'This route is not defined. Please use /signup instead'
  })
}

const getAllUsers = getAll(User)

const getUser = getOne(User)

// DO NOT UPDATE PASSWORDS WITH THIS
const updateUser = updateOne(User)

const deleteUser = deleteOne(User)

export {
  getAllUsers,
  updateMe,
  deleteMe,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getMe
}
