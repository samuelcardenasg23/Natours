/* eslint-disable */

import { displayMap } from './leaflet.js'
import { login, logout } from './login.js'
import { updateData } from './updateSettings.js'

// DOM ELEMENTS
const leaflet = document.getElementById('map')
const loginForm = document.querySelector('.form--login')
const logoutBtn = document.querySelector('.nav__el--logout')
const userDataForm = document.querySelector('.form-user-data')

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

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    updateData(name, email)
  })
}
