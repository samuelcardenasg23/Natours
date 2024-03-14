import { Router } from 'express'
import { protect, restrictTo } from '../controllers/authController.js'
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBooking,
  getCheckoutSession,
  updateBooking
} from '../controllers/bookingController.js'

export const bookingRouter = Router()

bookingRouter.use(protect)

bookingRouter.get('/checkout-session/:tourId', getCheckoutSession)

bookingRouter.use(restrictTo('admin', 'lead-guide'))

bookingRouter.route('/').get(getAllBookings).post(createBooking)

bookingRouter
  .route('/:id')
  .get(getBooking)
  .patch(updateBooking)
  .delete(deleteBooking)
