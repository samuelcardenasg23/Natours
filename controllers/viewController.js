import { Tour } from '../models/tourModel.js'
import { catchAsync } from '../utils/catchAsync.js'
import { AppError } from '../utils/appError.js'
import { Booking } from '../models/bookingModel.js'

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

const getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  })

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404))
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  })
})

const getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in'
  })
}

const getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account'
  })
}

const getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id })

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour)
  const tours = await Tour.find({ _id: { $in: tourIDs } })

  // 3) Render the overview page but just with the tours booked by the user
  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  })
})

export { getOverview, getTour, getLoginForm, getAccount, getMyTours }
