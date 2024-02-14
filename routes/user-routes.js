import { Router } from 'express'
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
} from '../controllers/user-controller.js'
import {
  login,
  signup,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js'

export const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)

userRouter.post('/forgotPassword', forgotPassword)
userRouter.patch('/resetPassword/:token', resetPassword)

userRouter.route('/').get(getAllUsers).post(createUser)

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)
