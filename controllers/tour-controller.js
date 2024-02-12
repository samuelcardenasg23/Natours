import { Tour } from '../models/tourModel.js'
import { APIFeatures } from '../utils/apiFeatures.js'
import { AppError } from '../utils/appError.js'

export const aliasTopTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

export const getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    const tours = await features.query

    // SEND RESPONSE
    res.json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    })
  } catch (err) {
    err.statusCode = err.statusCode ?? 500
    err.status = err.status ?? 'error'

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }
}

export const getTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id)

    if (!tour) {
      return next(new AppError('No tour found with that ID', 404))
    }

    res.json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (err) {
    // ESTE POR SI ALGO
    err.statusCode = err.statusCode ?? 500
    err.status = err.status ?? 'error'

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })

    // res.status(404).json({
    //   status: 'Failed',
    //   message: err
    // })
  }
}

// const catchAsync = (fn) => (req, res, next) => {
//   fn(req, res, next).catch(next)
// }

export const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)

    res.json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  } catch (err) {
    err.statusCode = err.statusCode ?? 500
    err.status = err.status ?? 'error'

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }
}

export const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (err) {
    err.statusCode = err.statusCode ?? 500
    err.status = err.status ?? 'error'

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }
}

export const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success',
      data: null
    })
  } catch (err) {
    err.statusCode = err.statusCode ?? 500
    err.status = err.status ?? 'error'

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }
}

export const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
    ])

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    })
  } catch (err) {
    err.statusCode = err.statusCode ?? 500
    err.status = err.status ?? 'error'

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }
}

export const getMonthlyPlan = async (req, res) => {
  try {
    const year = Number(req.params.year)

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numToursStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numToursStarts: -1 }
      },
      {
        $limit: 12
      }
    ])

    res.status(200).json({
      status: 'success',
      results: plan.length,
      data: {
        plan
      }
    })
  } catch (err) {
    err.statusCode = err.statusCode ?? 500
    err.status = err.status ?? 'error'

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }
}
