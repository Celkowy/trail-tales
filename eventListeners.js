import {
  removeMarker,
  displayActivities,
  temporarilyHidePopups,
  makeMarkerBigger,
  hidePopups,
  checkbox,
  handleRemoveAllMarkersPopup,
} from './functions.js'
import { map, markersState } from './functions.js'
import html from './htmlPlaceholder.js'
const leftPanel = document.querySelector('.left-panel')
const mapContainer = document.getElementById('map')
const form = document.querySelector('form')
const input = document.querySelector('.marker-title')
const popupToRemove = document.querySelector('.popup-to-remove')
const background = document.querySelector('.background')
const removeAllMarkersButton = document.querySelector('.remove-all-markers')
const legendButton = document.querySelector('.legend')

!localStorage.getItem('hidePopups') ? openPopup('legend') : localStorage.setItem('firstEntry', 'no')

leftPanel.addEventListener('mouseover', function (e) {
  mapContainer.classList.add('expand')
  leftPanel.classList.add('expand')
})

leftPanel.addEventListener('mouseout', function (e) {
  mapContainer.classList.remove('expand')
  leftPanel.classList.remove('expand')
})

mapContainer.addEventListener('contextmenu', function (e) {
  e.preventDefault()
})

export function goToMarker(lat, lng, element, map) {
  element.addEventListener('click', function () {
    markersState.forEach(marker => {
      const { lat: markerLat, lng: markerLng } = marker._latlng
      if (`${element.dataset.lat}, ${element.dataset.lng}` == `${markerLat}, ${markerLng}`) {
        styleMarkerOnElementClick(marker._icon, element, 3000)
      }
    })
    const zoom = map._zoom > 13 ? map._zoom : 13
    map.setView([lat, lng], zoom, {
      animate: true,
      pan: {
        duration: 1,
      },
    })
  })
}

function styleMarkerOnElementClick(divMarker, element, duration) {
  temporarilyHidePopups(duration)
  makeMarkerBigger(divMarker, element, duration)
}

export function elementRightClick(lat, lng, element, markersState) {
  element.addEventListener('contextmenu', function (e) {
    e.preventDefault()
    const elementCords = `${lat}${lng}`

    markersState.forEach(marker => {
      const { lat: markerLat, lng: markerLng } = marker._latlng
      const markerCords = `${markerLat}${markerLng}`
      if (markerCords === elementCords) removeMarker(marker, lat, lng)
    })
  })
}

export function mapOnClick() {
  map.on('click', function (ev) {
    if (input.value) {
      const { lat, lng } = ev.latlng
      const marker = L.marker([lat, lng], { riseOnHover: true })
        .addTo(map)
        .bindPopup(
          L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
          })
        )
        .setPopupContent(`${input.value}`)
        .openPopup()
      marker.on('contextmenu', () => removeMarker(marker, lat, lng))
      const cordsArr = JSON.parse(localStorage.getItem('cords'))
      cordsArr.push([lat, lng, input.value])
      markersState.push(marker)
      localStorage.setItem('cords', JSON.stringify(cordsArr))
      input.value = ''
      input.focus()
      displayActivities()
      hidePopups(checkbox.checked)
    }
  })
}

form.addEventListener('submit', function (e) {
  e.preventDefault()
})

legendButton.addEventListener('click', () => {
  openPopup('legend')
})

background.addEventListener('click', () => {
  popupToRemove.classList.remove('active')
  background.classList.remove('active')
})

removeAllMarkersButton.addEventListener('click', () => {
  openPopup('removeAllMarkers')
})

function openPopup(option) {
  popupToRemove.innerHTML = html(option)

  if (option === 'removeAllMarkers') {
    const yesButton = document.querySelector('.yes')
    const noButton = document.querySelector('.no')
    yesButton.addEventListener('click', handleRemoveAllMarkersPopup.bind(null, popupToRemove, background))
    noButton.addEventListener('click', handleRemoveAllMarkersPopup.bind(null, popupToRemove, background))
  }

  popupToRemove.classList.add('active')
  background.classList.add('active')
  const exit = document.querySelector('.fa-xmark')
  exit.addEventListener('click', handleRemoveAllMarkersPopup.bind(null, popupToRemove, background))
}
