import { Router } from 'express'
import { protect, restrictTo } from '../controllers/authController.js'
import { getCheckoutSession } from '../controllers/bookingController.js'

export const bookingRouter = Router()

bookingRouter.get('/checkout-session/:tourId', protect, getCheckoutSession)
