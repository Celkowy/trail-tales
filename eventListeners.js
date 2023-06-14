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
const leftPanel = document.querySelector('.left-panel')
const mapContainer = document.getElementById('map')
const form = document.querySelector('form')
const input = document.querySelector('.marker-title')
const popupToRemove = document.querySelector('.popup-to-remove')
const background = document.querySelector('.background')
const removeAllMarkersButton = document.querySelector('.remove-all-markers')
const legendButton = document.querySelector('.legend')

!localStorage.getItem('hidePopups') ? openLegend() : localStorage.setItem('firstEntry', 'no')

//legend what to do -> button with popup
//hide click check it
//show legend on the first entry of the page / localstorage

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

removeAllMarkersButton.addEventListener('click', () => {
  popupToRemove.innerHTML = `
  <i class="fa-solid fa-xmark"></i>
  <div>Do you want to remove all the markers?</div>
  <div class="button-container"><button class="yes">Yes</button> <button class="no">No</button></div>
  `
  popupToRemove.classList.add('active')
  background.classList.add('active')

  const yesButton = document.querySelector('.yes')
  const noButton = document.querySelector('.no')
  const exit = document.querySelector('.fa-xmark')

  yesButton.addEventListener('click', handleRemoveAllMarkersPopup.bind(null, popupToRemove, background))
  noButton.addEventListener('click', handleRemoveAllMarkersPopup.bind(null, popupToRemove, background))
  exit.addEventListener('click', handleRemoveAllMarkersPopup.bind(null, popupToRemove, background))
})

legendButton.addEventListener('click', () => {
  openLegend()
})

background.addEventListener('click', () => {
  popupToRemove.classList.remove('active')
  background.classList.remove('active')
})

function openLegend() {
  popupToRemove.innerHTML = `
  <i class="fa-solid fa-xmark"></i>
  <div class="legend-content">
    <ul>
      <li>
        <span class="underline">To create marker</span> - write a name in the input first and then left click on the map.
        Once created, activity with the name and coordinates will be displayed on the left panel
      </li>
      <li>
        <span class="underline">To remove marker</span> - right click the marker on the map or right click the activity on
        the left panel
      </li>
      <li>
        <span class="underline">Copy coordinates to clipboard</span> - hover over the left panel to expand the activities.
        Once expanded, click a clipboard icon
      </li>
      <li><span class="underline">Center the marker</span> - left click on the activity on the left panel</li>
      <li><span class="underline">Available options</span></li>
      <ul>
        <li>Show legend</li>
        <li>Remove all markers</li>
        <li>Hide markers popups</li>
        <li>Change map style</li>
      </ul>
      <li>
        <span class="underline">All data is stored in local storage</span> - so you can come back to the page anytime and
        your saved activities and all settings will persist
      </li>
    </ul>
  </div>
  `
  popupToRemove.classList.add('active')
  background.classList.add('active')
  const exit = document.querySelector('.fa-xmark')
  exit.addEventListener('click', handleRemoveAllMarkersPopup.bind(null, popupToRemove, background))
}
