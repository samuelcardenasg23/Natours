import { Router } from 'express'
import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkID,
} from '../controllers/tour-controller.js'

export const toursRouter = Router()

toursRouter.param('id', checkID)

toursRouter.route('/').get(getAllTours).post(createTour)

toursRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)
