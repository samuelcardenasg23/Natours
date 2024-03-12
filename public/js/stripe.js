/* eslint-disable */
import axios from 'axios'
import Stripe from 'stripe'
import { showAlert } from './alerts.js'

const bookTour = async (tourId) => {
  const stripe = new Stripe(
    'pk_test_51OtOosJ7DSCvQ4do2MGehQGxln3qsO1BBWUh7r4SGqEeG85xLbpoDefnsxGP5RokAvBvopHYjK7VsTmI642QXc5y00pPezhg6g'
  )
  try {
    // 1) Get checkout session from the API
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    )
    console.log(session)

    // 2) Create checkout form + charge card
    window.location.assign(session.data.session.url)
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id
    // })
  } catch (err) {
    console.log(err)
    showAlert('error', err)
  }
}

export { bookTour }
