import { Router } from 'express'

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    messagge: 'This route is not yet defined',
  })
}

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    messagge: 'This route is not yet defined',
  })
}

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    messagge: 'This route is not yet defined',
  })
}

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    messagge: 'This route is not yet defined',
  })
}

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    messagge: 'This route is not yet defined',
  })
}

export const userRoutes = Router()

userRoutes.route('/').get(getAllUsers).post(createUser)

userRoutes.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)
