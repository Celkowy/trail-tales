import { goToMarker, elementRightClick } from './eventListeners.js'
const activitiesList = document.querySelector('.cords-list')
document.getElementById('map-style').addEventListener('change', changeMapStyle, true)
export const map = L.map('map')
export let markersState = []
let mapStyleState
const mapStyle = {
  Default: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
  Light: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  Dark: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
}
let mapLayer

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
    const [latToDisplay, lngToDisplay] = [lat.toString().slice(0, 5), lng.toString().slice(0, 5)]

    //fix this. Other js file
    element.innerHTML = `
    <div class="popup-msg">${popupMsg}</div>
    <div class="cords-wrapper">
      <div class="lat">
        <span>X</span>
        <div>:&nbsp${latToDisplay}</div>
      </div>
      <div class="lng">
        <span>Y</span>
        <div>:&nbsp${lngToDisplay}</div>
      </div>
    </div>`
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
  if (localStorage.getItem('mapStyleState') === null) {
    localStorage.setItem('mapStyleState', 'Default')
    mapStyleState = 'Default'
  } else {
    mapStyleState = localStorage.getItem('mapStyleState')
  }

  mapLayer = L.tileLayer(mapStyle[mapStyleState], {
    attribution: '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  })
  mapLayer.addTo(map)
  setMapStyleSelectValue()
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

function changeMapStyle(e) {
  e.preventDefault()
  e.stopPropagation()
  const mapStyleValue = e.currentTarget.value
  mapLayer.setUrl(mapStyle[mapStyleValue])
  mapStyleState = mapStyleValue
  localStorage.setItem('mapStyleState', mapStyleValue)
  setMapStyleSelectValue()
}

function setMapStyleSelectValue() {
  const select = document.querySelector('select')
  select.value = mapStyleState
}

//map attribution
//dark - attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
//light - &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors
