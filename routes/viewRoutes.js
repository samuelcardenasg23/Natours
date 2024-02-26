import { Router } from 'express'
import { getOverview, getTour } from '../controllers/viewController.js'

export const viewRouter = Router()

viewRouter.get('/', getOverview)
viewRouter.get('/tour', getTour)
