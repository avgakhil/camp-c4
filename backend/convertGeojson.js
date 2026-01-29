const fs = require('fs');
const path = require('path');

const geojsonPath = path.join(__dirname, 'data', 'campus.geojson');
const outPath = path.join(__dirname, 'data', 'campusGraph.json');

const geojson = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));

const graph = {};

function addEdge(from, to, distance, accessible) {
  if (!graph[from]) graph[from] = [];
  graph[from].push({ to, distance, accessible });
}

geojson.features.forEach(feature => {
  if (feature.geometry.type === 'LineString') {
    const { from, to, distance, accessible } = feature.properties;

    if (!from || !to || distance == null) return;

    // Undirected campus paths
    const isAccessible =
  accessible === true ||
  accessible === "true" ||
  accessible === 1 ||
  accessible === "1";

addEdge(from, to, distance, isAccessible);

    addEdge(to, from, distance, isAccessible);
  }
});

fs.writeFileSync(outPath, JSON.stringify(graph, null, 2));
console.log('✅ campusGraph.json generated');
