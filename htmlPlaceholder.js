export default function html(option) {
  if (option === 'legend') {
    return `
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
  } else if ('removeAllMarkers') {
    return `
    <i class="fa-solid fa-xmark"></i>
    <div>Do you want to remove all the markers?</div>
    <div class="button-container"><button class="yes">Yes</button> <button class="no">No</button></div>
    `
  }
}
