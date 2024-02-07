import fs from 'node:fs'

const __dirname = import.meta.dirname

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
)

export const getAllTours = (req, res) => {
  res.json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  })
}

export const getTour = (req, res) => {
  console.log(req.params)

  const id = Number(req.params.id)

  const tour = tours.find((el) => el.id === id)

  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'Failed',
      message: 'Invalid ID',
    })
  }

  res.json({
    status: 'success',
    data: {
      tour,
    },
  })
}

export const createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1
  const newTour = Object.assign({ id: newId }, req.body)

  tours.push(newTour)

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.json({
        status: 'success',
        data: {
          tour: newTour,
        },
      })
    }
  )
}

export const updateTour = (req, res) => {
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'Failed',
      message: 'Invalid ID',
    })
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour here...',
    },
  })
}

export const deleteTour = (req, res) => {
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'Failed',
      message: 'Invalid ID',
    })
  }

  res.status(204).json({
    status: 'success',
    data: null,
  })
}