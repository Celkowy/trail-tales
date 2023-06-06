import { displayActivities, drawMarkers, createMap } from './functions.js'
import { mapOnClick } from './eventListeners.js'

if (!localStorage.getItem('cords')) localStorage.setItem('cords', '[]')
const centralParkCoords = { latitude: 40.785091, longitude: -73.968285 }
navigator.geolocation.getCurrentPosition(
  function (pos) {
    createMap(pos.coords)
    mapOnClick()
    drawMarkers()
    displayActivities()
  },
  function () {
    createMap(centralParkCoords)
    mapOnClick()
    drawMarkers()
    displayActivities()
    console.log(`Couldn't load location data`)
  }
)
