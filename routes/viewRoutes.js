import { Router } from 'express'
import {
  getLoginForm,
  getOverview,
  getTour
} from '../controllers/viewController.js'
import { isLoggedIn } from '../controllers/authController.js'

export const viewRouter = Router()

viewRouter.use(isLoggedIn)

viewRouter.get('/', getOverview)
viewRouter.get('/tour/:slug', getTour)

viewRouter.get('/login', getLoginForm)
