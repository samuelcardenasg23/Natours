const getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All tours'
  })
}

const getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest hiker Tour'
  })
}

export { getOverview, getTour }
