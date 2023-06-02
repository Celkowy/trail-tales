import { displayActivities, drawMarkers, createMap } from './functions.js'
import { mapOnClick } from './eventListeners.js'

if (!localStorage.getItem('cords')) localStorage.setItem('cords', '[]')

navigator.geolocation.getCurrentPosition(
  function (pos) {
    createMap(pos)
    mapOnClick()
    drawMarkers()
    displayActivities()
  },
  function () {
    console.log(`Couldn't load location data`)
  }
)
