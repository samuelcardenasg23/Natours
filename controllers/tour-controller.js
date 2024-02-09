import { Tour } from '../models/tourModel.js'

export const getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    const queryObj = { ...req.query }
    const excludeFields = ['page', 'sort', 'limit', 'fields']
    excludeFields.forEach((el) => delete queryObj[el])

    const query = Tour.find(queryObj)

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
