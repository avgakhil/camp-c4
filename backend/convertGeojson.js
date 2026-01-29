const fs = require("fs");
const path = require("path");

const geojsonPath = path.join(__dirname, "data", "campus.geojson");
const outPath = path.join(__dirname, "data", "campusGraph.json");

const geojson = JSON.parse(fs.readFileSync(geojsonPath, "utf8"));

const graph = {};

function addEdge(from, to, distance, accessible) {
  if (!graph[from]) graph[from] = [];
  graph[from].push({ to, distance, accessible });
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = deg => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

geojson.features.forEach(feature => {
  if (feature.geometry.type !== "LineString") return;

  const { from, to, accessible } = feature.properties;
  const coords = feature.geometry.coordinates;

  if (!from || !to || coords.length < 2) return;

  // Use first and last coordinate of the line
  const [lon1, lat1] = coords[0];
  const [lon2, lat2] = coords[coords.length - 1];

  const distance = Number(
    haversine(lat1, lon1, lat2, lon2).toFixed(2)
  );

  const isAccessible =
    accessible === true ||
    accessible === "true" ||
    accessible === 1 ||
    accessible === "1";

  addEdge(from, to, distance, isAccessible);
  addEdge(to, from, distance, isAccessible);
});

fs.writeFileSync(outPath, JSON.stringify(graph, null, 2));
console.log("✅ campusGraph.json generated with Haversine distances");
