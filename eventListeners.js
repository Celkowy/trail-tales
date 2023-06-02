import { removeMarker, displayActivities } from './functions.js'
import { map, markersState } from './functions.js'
const leftPanel = document.querySelector('.left-panel')
const mapContainer = document.getElementById('map')
const form = document.querySelector('form')

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
    map.setView([lat, lng], 13)
  })
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
    form.classList.add('active')
    const marker = L.marker([ev.latlng.lat, ev.latlng.lng], { riseOnHover: true }).addTo(map)
    const { lat, lng } = ev.latlng
    const cordsArr = JSON.parse(localStorage.getItem('cords'))
    cordsArr.push([lat, lng])
    markersState.push(marker)

    marker.on('contextmenu', function () {
      removeMarker(lat, lng, marker)
    })

    localStorage.setItem('cords', JSON.stringify(cordsArr))
    displayActivities()
  })
}
