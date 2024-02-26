import { Tour } from '../models/tourModel.js'
import { catchAsync } from '../utils/catchAsync.js'

const getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from our collection
  const tours = await Tour.find()

  // 2) Build template

  // 3) Render that template using tour data from step 1)

  res.status(200).render('overview', {
    title: 'All tours',
    tours
  })
})

const getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest hiker Tour'
  })
}

export { getOverview, getTour }
