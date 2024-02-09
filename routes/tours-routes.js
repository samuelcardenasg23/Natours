import { Router } from 'express'
import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats
} from '../controllers/tour-controller.js'

export const toursRouter = Router()

// toursRouter.param('id')
toursRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours)

toursRouter.route('/tour-stats').get(getTourStats)

toursRouter.route('/').get(getAllTours).post(createTour)

toursRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)
