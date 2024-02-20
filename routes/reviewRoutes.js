import { Router } from 'express'
import {
  getAllReviews,
  createReview,
  deleteReview
} from '../controllers/reviewController.js'
import { protect, restrictTo } from '../controllers/authController.js'

export const reviewsRouter = Router({ mergeParams: true })

reviewsRouter
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview)

reviewsRouter.route('/:id').delete(deleteReview)
