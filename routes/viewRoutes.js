import { Router } from 'express'
import {
  getLoginForm,
  getOverview,
  getTour
} from '../controllers/viewController.js'

export const viewRouter = Router()

viewRouter.get('/', getOverview)
viewRouter.get('/tour/:slug', getTour)

viewRouter.get('/login', getLoginForm)
