import { Router } from 'express'
import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan
} from '../controllers/tour-controller.js'
import { protect } from '../controllers/authController.js'

export const toursRouter = Router()

// toursRouter.param('id')
toursRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours)

toursRouter.route('/tour-stats').get(getTourStats)

toursRouter.route('/monthly-plan/:year').get(getMonthlyPlan)

toursRouter.route('/').get(protect, getAllTours).post(createTour)

toursRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)
