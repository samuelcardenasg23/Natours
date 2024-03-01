/* eslint-disable */

import { displayMap } from './leaflet'
import { login, logout } from './login'

// DOM ELEMENTS
const leaflet = document.getElementById('map')
const loginForm = document.querySelector('.form')
const logoutBtn = document.querySelector('.nav__el--logout')

// DELEGATION
if (leaflet) {
  const locations = JSON.parse(leaflet.dataset.locations)
  displayMap(locations)
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email, password)
  })
}

if (logoutBtn) logoutBtn.addEventListener('click', logout)
