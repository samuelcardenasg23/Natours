import { Router } from 'express'
import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin
} from '../controllers/tour-controller.js'
import { protect, restrictTo } from '../controllers/authController.js'
import { reviewsRouter } from './reviewRoutes.js'

export const toursRouter = Router()

toursRouter.use('/:tourId/reviews', reviewsRouter)

// toursRouter.param('id')
toursRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours)

toursRouter.route('/tour-stats').get(getTourStats)

toursRouter
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan)

toursRouter
  .route('/tours-within/:distance/center/:latlng/:unit')
  .get(getToursWithin)

toursRouter
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour)

toursRouter
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)
