import { removeMarker, displayActivities } from './functions.js'
import { map, markersState } from './functions.js'
const leftPanel = document.querySelector('.left-panel')
const mapContainer = document.getElementById('map')
const form = document.querySelector('form')
const input = document.querySelector('input')

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
        styleMarkerOnElementClick(marker, element)
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

function styleMarkerOnElementClick(marker, element) {
  const divMarker = marker._icon
  divMarker.classList.add('selected')
  element.style.pointerEvents = 'none'

  //the marker you selected by clicking an element should have z-index and be visible in the foreground
  const width = divMarker.style.width.replace('px', '')
  const height = divMarker.style.height.replace('px', '')
  divMarker.style.width = Number(width) + 10 + 'px'
  divMarker.style.height = Number(height) + 10 + 'px'

  setTimeout(() => {
    divMarker.classList.remove('selected')
    divMarker.style.width = width + 'px'
    divMarker.style.height = height + 'px'
    element.style.pointerEvents = 'initial'
  }, 1500)
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
    const { lat, lng } = ev.latlng
    const marker = L.marker([lat, lng], { riseOnHover: true }).addTo(map).bindPopup(input.value).openPopup()
    marker.on('contextmenu', () => removeMarker(lat, lng, marker))
    const cordsArr = JSON.parse(localStorage.getItem('cords'))
    cordsArr.push([lat, lng, input.value])
    markersState.push(marker)
    localStorage.setItem('cords', JSON.stringify(cordsArr))
    input.value = ''
    input.focus()
    displayActivities()
  })
}

form.addEventListener('submit', function (e) {
  e.preventDefault()
})

// L.marker(cords).addTo(map).bindPopup('test').openPopup()
