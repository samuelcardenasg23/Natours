import { Router } from 'express'
import {
  getLoginForm,
  getAccount,
  getOverview,
  getTour
} from '../controllers/viewController.js'
import { isLoggedIn, protect } from '../controllers/authController.js'

export const viewRouter = Router()

viewRouter.get('/', isLoggedIn, getOverview)
viewRouter.get('/tour/:slug', isLoggedIn, getTour)

viewRouter.get('/login', isLoggedIn, getLoginForm)

viewRouter.get('/me', protect, getAccount)
