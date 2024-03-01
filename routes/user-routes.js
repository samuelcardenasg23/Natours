import { Router } from 'express'
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe
} from '../controllers/user-controller.js'
import {
  login,
  signup,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
  logout
} from '../controllers/authController.js'

export const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.get('/logout', logout)

userRouter.post('/forgotPassword', forgotPassword)
userRouter.patch('/resetPassword/:token', resetPassword)

userRouter.use(protect)

userRouter.patch('/updateMyPassword', updatePassword)

userRouter.get('/me', getMe, getUser)
userRouter.patch('/updateMe', updateMe)
userRouter.delete('/deleteMe', deleteMe)

userRouter.use(restrictTo('admin'))

userRouter.route('/').get(getAllUsers).post(createUser)

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)
