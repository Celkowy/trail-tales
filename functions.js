import { goToMarker, elementRightClick } from './eventListeners.js'
import { elementLayout } from './elementLayout.js'

const activitiesList = document.querySelector('.cords-list')
const clipboardInfo = document.querySelector('.clipboard-info')

document.getElementById('map-style').addEventListener('change', changeMapStyle, true)

export const map = L.map('map')
export let markersState = []
let mapStyleState
export const checkbox = document.querySelector('.hide-popups')
export let hidePopupsState = localStorage.getItem('hidePopups') || localStorage.setItem('hidePopups', 'false')
if (hidePopupsState === 'true') checkbox.checked = true
const mapStyle = {
  Default: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
  Light: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  Dark: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
}
let mapLayer

export function removeMarker(marker, markersLat, markersLng) {
  const cordsArr = JSON.parse(localStorage.getItem('cords'))
  const indexToRemove = cordsArr.findIndex(([x, y]) => x === markersLat && y === markersLng)
  cordsArr.splice(indexToRemove, 1)
  localStorage.setItem('cords', JSON.stringify(cordsArr))
  marker.remove()
  displayActivities()
}

export function displayActivities() {
  activitiesList.innerHTML = ''
  const cordsList = JSON.parse(localStorage.getItem('cords')) || []
  cordsList.forEach(([lat, lng, popupMsg]) => {
    const element = document.createElement('div')
    element.dataset.lat = lat
    element.dataset.lng = lng
    element.classList.add('element')
    const [latToDisplay, lngToDisplay] = [lat.toString().slice(0, 5), lng.toString().slice(0, 5)]
    element.innerHTML = elementLayout(latToDisplay, lngToDisplay, popupMsg)
    const img = document.createElement('img')
    img.addEventListener('click', function () {
      navigator.clipboard.writeText(`${lat} ${lng}`)
      clipboardInfo.classList.add('active')
      setTimeout(() => {
        clipboardInfo.classList.remove('active')
      }, 3000)
    })
    img.classList.add('clipboard')
    img.src = './fav/clipboard.png'
    element.appendChild(img)

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
      removeMarker(marker, lat, lng)
    })
  })
  if (checkbox.checked) hidePopups(checkbox.checked)
}

export function createMap(pos) {
  const { latitude, longitude } = pos
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

export function temporarilyHidePopups(duration) {
  markersState.forEach(el => {
    const { _popup: popup } = el
    popup._container.style.opacity = 0
    if (!checkbox.checked) {
      setTimeout(() => {
        popup._container.style.opacity = 1
      }, duration)
    }
  })
}

export function hidePopups(switcher) {
  markersState.forEach(el => {
    const { _popup: popup } = el
    popup._container.style.opacity = switcher ? 0 : 1
  })
}

export function makeMarkerBigger(divMarker, element, duration) {
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
  }, duration)
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

export function handleRemoveAllMarkersPopup(popupToRemove, background, e) {
  popupToRemove.classList.remove('active')
  background.classList.remove('active')
  if (e.srcElement.className === 'yes') {
    removeAllMarkers()
  }
}

function removeAllMarkers() {
  localStorage.setItem('cords', '[]')
  markersState.forEach(marker => {
    removeMarker(marker)
  })
  markersState.length = 0
}

checkbox.addEventListener('change', function () {
  hidePopups(checkbox.checked)
  localStorage.setItem('hidePopups', checkbox.checked)
})

//map attribution
//dark - attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
//light - &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors
