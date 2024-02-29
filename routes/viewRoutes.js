import { Router } from 'express'
import {
  getLoginForm,
  getOverview,
  getTour
} from '../controllers/viewController.js'
import { protect } from '../controllers/authController.js'

export const viewRouter = Router()

viewRouter.get('/', getOverview)
viewRouter.get('/tour/:slug', protect, getTour)

viewRouter.get('/login', getLoginForm)
