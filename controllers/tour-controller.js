import { Error } from 'mongoose'
import { Tour } from '../models/tourModel.js'

export const aliasTopTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

export const getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // 1A) FILTERING
    const queryObj = { ...req.query }
    const excludeFields = ['page', 'sort', 'limit', 'fields']
    excludeFields.forEach((el) => delete queryObj[el])

    // 1B) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    let query = Tour.find(JSON.parse(queryStr))

    // 2) SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    // 3) FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-__v')
    }

    // 4) PAGINATION
    const page = Number(req.query.page) ?? 1
    const limit = Number(req.query.limit) ?? 100
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

    if (req.query.page) {
      const numberTours = await Tour.countDocuments()
      if (skip >= numberTours) throw new Error('This page does not exist')
    }

    // EXECUTE QUERY
    const tours = await query

    // SEND RESPONSE
    res.json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err
    })
  }
}

export const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)

    res.json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err
    })
  }
}

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
    res.status(400).json({
      status: 'Failed',
      message: 'Invalid data sent'
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
    res.status(404).json({
      status: 'Failed',
      message: err
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
    res.status(404).json({
      status: 'Failed',
      message: err
    })
  }
}
