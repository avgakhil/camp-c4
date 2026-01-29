let map;
let geojsonData;
let nodeCoords = {};
let pathLayer;

// initialize map
map = L.map('map').setView([17.1965, 78.5960], 17);

// base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

fetch("/data/nodes.json")
  .then(res => res.json())
  .then(nodes => {
    nodes.forEach(node => {
      if (node.type === "junction") return; // 🚫 hide visually

      L.marker([node.lat, node.lng])
        .bindPopup(node.name)
        .addTo(map);
    });
  });


// load geojson
fetch('http://localhost:3000/geojson')
  .then(res => res.json())
  .then(data => {
    geojsonData = data;
    loadGeoJSON(data);
    populateDropdowns(data);
  });

// draw campus map
function loadGeoJSON(data) {
  L.geoJSON(data, {
    style: { color: '#555', weight: 2 },
    filter: feature => feature.geometry.type !== "Point" || feature.properties.type !== "junction",
    onEachFeature: (feature, layer) => {
      
  if (feature.geometry.type === 'Point' && feature.properties.type !== 'junction') {
    const { node_id, name } = feature.properties;
    const [lon, lat] = feature.geometry.coordinates;

    nodeCoords[node_id] = [lat, lon];

    layer.bindPopup(`${name} (${node_id})`);
  }
}

  }).addTo(map);
}

// function loadGeoJSON(data) {
//   L.geoJSON(data, {
//     filter: feature => {
//       // draw paths always
//       if (feature.geometry.type === "LineString") return true;

//       // draw points except junctions
//       if (
//         feature.geometry.type === "Point" &&
//         feature.properties.type !== "junction"
//       ) {
//         return true;
//       }

//       return false; // 🚫 hide junction points
//     },

//     pointToLayer: (feature, latlng) =>
//       L.marker(latlng).bindPopup(feature.properties.name)
//   }).addTo(map);
// }

// populate dropdowns using Point features
function populateDropdowns(data) {
  const start = document.getElementById('start');
  const end = document.getElementById('end');

  data.features.forEach(f => {
    if (f.geometry.type === 'Point') {
      const opt1 = document.createElement('option');
      const opt2 = document.createElement('option');

      opt1.value = opt2.value = f.properties.node_id;
      opt1.textContent = opt2.textContent = f.properties.name;

      start.appendChild(opt1);
      end.appendChild(opt2);
    }
  });
}




// find shortest path
function findPath() {
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;
  const accessible = document.getElementById('accessible').checked;

  fetch(`http://localhost:3000/path?start=${start}&end=${end}&accessible=${accessible}`)
    .then(res => res.json())
    .then(drawPath);
}

// draw shortest path
function drawPath(result) {
  if (pathLayer) map.removeLayer(pathLayer);

  if (!result.path || result.path.length === 0) {
    alert('No path found');
    return;
  }

  const latlngs = result.path.map(id => nodeCoords[id]);

  pathLayer = L.polyline(latlngs, {
    color: 'red',
    weight: 5
  }).addTo(map);

  map.fitBounds(pathLayer.getBounds());
}
