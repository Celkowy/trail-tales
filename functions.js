import { goToMarker, elementRightClick } from './eventListeners.js'
const activitiesList = document.querySelector('.cords-list')
export const map = L.map('map')
export const markersState = []

export function removeMarker(lat, lng, marker) {
  const cordsArr = JSON.parse(localStorage.getItem('cords'))
  const indexToRemove = cordsArr.findIndex(element => element.toString() === [lat, lng].toString())
  cordsArr.splice(indexToRemove, 1)
  localStorage.setItem('cords', JSON.stringify(cordsArr))
  marker.remove()
  displayActivities()
}

export function displayActivities() {
  activitiesList.innerHTML = ''
  activitiesList.classList.add('active')
  const cordsList = JSON.parse(localStorage.getItem('cords')) || []
  cordsList.forEach(el => {
    const [lat, lng] = el
    const element = document.createElement('div')
    element.classList.add('element')
    element.textContent = `${lat}, ${lng}`
    goToMarker(lat, lng, element, map)
    elementRightClick(lat, lng, element, markersState)
    activitiesList.appendChild(element)
  })
}

export function drawMarkers() {
  markersState.splice(0, markersState.length)
  const cordsArr = JSON.parse(localStorage.getItem('cords')) || []
  cordsArr.forEach(cords => {
    const [x, y] = cords
    const a = L.marker([x, y], { riseOnHover: true }).addTo(map)
    markersState.push(a)
    a.on('contextmenu', function (ev) {
      const { lat, lng } = ev.latlng
      removeMarker(lat, lng, a)
    })
  })
}

export function createMap(pos) {
  const { latitude, longitude } = pos.coords
  const coordinates = [latitude, longitude]
  const localStorageCords = JSON.parse(localStorage.getItem('cords'))
  map.setView(localStorageCords[localStorageCords.length - 1] || coordinates, 13)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
}
