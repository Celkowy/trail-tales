import {
  removeMarker,
  displayActivities,
  temporarilyHidePopups,
  makeMarkerBigger,
  hidePopups,
  checkbox,
} from './functions.js'
import { map, markersState } from './functions.js'
const leftPanel = document.querySelector('.left-panel')
const mapContainer = document.getElementById('map')
const form = document.querySelector('form')
const input = document.querySelector('.marker-title')

leftPanel.addEventListener('mouseover', function () {
  mapContainer.classList.add('expand')
  leftPanel.classList.add('expand')
})

leftPanel.addEventListener('mouseout', function () {
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
        styleMarkerOnElementClick(marker._icon, element)
      }
    })
    //option to unset it, so it doesn't zoom when you click an element
    map.setView([lat, lng], 13, {
      animate: true,
      pan: {
        duration: 1,
      },
    })
  })
}

//3. hide popups //switch if they are disabled / localstorage
//4. show last added only

function styleMarkerOnElementClick(divMarker, element) {
  //if tutaj

  temporarilyHidePopups(1500)
  makeMarkerBigger(divMarker, element)
}

export function elementRightClick(lat, lng, element, markersState) {
  element.addEventListener('contextmenu', function (e) {
    e.preventDefault()
    const elementCords = `${lat}${lng}`

    markersState.forEach(marker => {
      const { lat: markerLat, lng: markerLng } = marker._latlng
      const markerCords = `${markerLat}${markerLng}`
      if (markerCords === elementCords) removeMarker(lat, lng, marker)
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
      marker.on('contextmenu', () => removeMarker(lat, lng, marker))
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
