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
  cordsList.forEach(([lat, lng, content]) => {
    const element = document.createElement('div')
    element.dataset.lat = lat
    element.dataset.lng = lng
    element.classList.add('element')
    element.textContent = `${lat}, ${lng}, ${content}`
    goToMarker(lat, lng, element, map)
    elementRightClick(lat, lng, element, markersState)
    activitiesList.appendChild(element)
  })
}

export function drawMarkers() {
  markersState.length = 0
  const cordsArr = JSON.parse(localStorage.getItem('cords')) || []
  cordsArr.forEach(([x, y, content]) => {
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
      .setPopupContent(`${content}`)
      .openPopup()

    markersState.push(marker)
    marker.on('contextmenu', function (ev) {
      const { lat, lng } = ev.latlng
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
    el._popup._container.style.opacity = 0
    setTimeout(() => {
      el._popup._container.style.opacity = 1
    }, 1500)
  })
}

export function makeMarkerBigger(divMarker, element) {
  const width = divMarker.style.width.replace('px', '')
  const height = divMarker.style.height.replace('px', '')
  divMarker.style.width = Number(width) + 10 + 'px'
  divMarker.style.height = Number(height) + 10 + 'px'
  divMarker.classList.add('selected')
  element.style.pointerEvents = 'none'

  setTimeout(() => {
    divMarker.classList.remove('selected')
    divMarker.style.width = width + 'px'
    divMarker.style.height = height + 'px'
    element.style.pointerEvents = 'initial'
  }, 1500)
}
