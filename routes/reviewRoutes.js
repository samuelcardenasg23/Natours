import { Router } from 'express'
import { getAllReviews, createReview } from '../controllers/reviewController.js'
import { protect, restrictTo } from '../controllers/authController.js'

export const reviewsRouter = Router()

reviewsRouter
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview)
