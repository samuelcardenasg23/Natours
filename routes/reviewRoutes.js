import { Router } from 'express'
import {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds
} from '../controllers/reviewController.js'
import { protect, restrictTo } from '../controllers/authController.js'

export const reviewsRouter = Router({ mergeParams: true })

reviewsRouter
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourUserIds, createReview)

reviewsRouter.route('/:id').patch(updateReview).delete(deleteReview)
