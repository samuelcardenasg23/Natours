/* eslint-disable */

console.log('hello from the client side')
const locations = JSON.parse(document.getElementById('map').dataset.locations)

var map = L.map('map', {
  zoomControl: false,
  doubleClickZoom: false,
  scrollWheelZoom: false
})
// const map = L.map('map', {
//   attributionControl: false,
//   zoomControl: false,
//   scrollWheelZoom: false,
//   doubleClickZoom: false,
//   zoomSnap: 0.1 // important for perfect fit of the bounds
// })

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

// Add marker
const greenMarker = L.icon({
  iconUrl: '../img/pin.png',

  iconSize: [32, 40], // size of the icon
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  popupAnchor: [-6, -76] // point from which the popup should open relative to the iconAnchor
})

const points = []

locations.forEach((loc) => {
  points.push([loc.coordinates[1], loc.coordinates[0]])
  L.marker([loc.coordinates[1], loc.coordinates[0]], { icon: greenMarker })
    .addTo(map)
    .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
      autoClose: false
    })
    .openPopup()
})

const bounds = L.latLngBounds(points).pad(0.5)
map.fitBounds(bounds)

console.log(locations)
