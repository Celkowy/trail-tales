export function elementLayout(latToDisplay, lngToDisplay, popupMsg) {
  return `
  <div>
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
  </div>
  </div>
  `
}
