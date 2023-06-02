import { goToMarker, elementRightClick } from './eventListeners.js'
const activitiesList = document.querySelector('.cords-list')
export const map = L.map('map')
export const markersState = []

export function removeMarker(markersLat, markersLng, marker) {
  const cordsArr = JSON.parse(localStorage.getItem('cords'))
  const indexToRemove = cordsArr.findIndex(([x, y]) => x === markersLat && y === markersLng)
  cordsArr.splice(indexToRemove, 1)
  localStorage.setItem('cords', JSON.stringify(cordsArr))
  marker.remove()
  displayActivities()
}

export function displayActivities() {
  activitiesList.innerHTML = ''
  activitiesList.classList.add('active')
  const cordsList = JSON.parse(localStorage.getItem('cords')) || []
  cordsList.forEach(([lat, lng, popupMsg]) => {
    const element = document.createElement('div')
    element.dataset.lat = lat
    element.dataset.lng = lng
    element.classList.add('element')
    element.textContent = `${lat}, ${lng}, ${popupMsg}`
    goToMarker(lat, lng, element, map)
    elementRightClick(lat, lng, element, markersState)
    activitiesList.appendChild(element)
  })
}

export function drawMarkers() {
  markersState.length = 0
  const cordsArr = JSON.parse(localStorage.getItem('cords')) || []
  cordsArr.forEach(([x, y, popupMsg]) => {
    const marker = L.marker([x, y], { riseOnHover: true })
      .addTo(map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
        })
      )
      .setPopupContent(popupMsg)
      .openPopup()

    markersState.push(marker)
    marker.on('contextmenu', function (latlng) {
      const { lat, lng } = latlng
      removeMarker(lat, lng, marker)
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

export function temporarilyHidePopups() {
  markersState.forEach(el => {
    const { _popup: popup } = el
    popup._container.style.opacity = 0
    setTimeout(() => {
      popup._container.style.opacity = 1
    }, 1500)
  })
}

export function makeMarkerBigger(divMarker, element) {
  const { width, height } = divMarker.style
  divMarker.style.width = parseInt(width) + 10 + 'px'
  divMarker.style.height = parseInt(height) + 10 + 'px'
  divMarker.classList.add('selected')
  element.style.pointerEvents = 'none'

  setTimeout(() => {
    divMarker.classList.remove('selected')
    divMarker.style.width = width
    divMarker.style.height = height
    element.style.pointerEvents = 'initial'
  }, 1500)
}
