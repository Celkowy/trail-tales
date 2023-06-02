import { displayActivities, drawMarkers, createMap } from './functions.js'
import { mapOnClick } from './eventListeners.js'

if (!localStorage.getItem('cords')) localStorage.setItem('cords', '[]')

navigator.geolocation.getCurrentPosition(
  function (pos) {
    // L.marker(cords).addTo(map).bindPopup('test').openPopup()
    createMap(pos)
    mapOnClick()
  },
  function () {
    console.log(`Couldn't load location data`)
  }
)

drawMarkers()
displayActivities()
