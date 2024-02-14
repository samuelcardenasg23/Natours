import { Router } from 'express'
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
} from '../controllers/user-controller.js'
import { login, signup } from '../controllers/authController.js'

export const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)

userRouter.route('/').get(getAllUsers).post(createUser)

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)
