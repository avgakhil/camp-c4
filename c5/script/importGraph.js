console.log("SCRIPT STARTED");


const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const haversine = require("../utils/haversine");
const Node = require("../models/node");
const Edge = require("../models/edge");

const geojsonPath = path.join(__dirname, "..", "data", "campus.geojson");
// console.log(
//   "Geometry types:",
//   [...new Set(geojson.features.map(f => f.geometry.type))]
// );

async function importGraph() {
  await mongoose.connect("mongodb://127.0.0.1:27017/campus");
// console.log("DB name:", mongoose.connection.name);
// console.log("Collections:", await mongoose.connection.db.listCollections().toArray());

  console.log("✅ MongoDB connected");

  const geojson = JSON.parse(fs.readFileSync(geojsonPath, "utf8"));

  const nodesSet = new Set();
// console.log(
//   geojson.features.map(f => f.geometry.type)
// );

  for (const feature of geojson.features) {
    if (feature.geometry.type !== "LineString") continue;

    const { from, to, accessible } = feature.properties;
    if (!from || !to || feature.geometry.coordinates.length < 2) continue;

    const coords = feature.geometry.coordinates;
    const [lon1, lat1] = coords[0];
    const [lon2, lat2] = coords[coords.length - 1];

    const distance = Number(haversine(lat1, lon1, lat2, lon2).toFixed(2));
    const isAccessible =
      accessible === true || accessible === "true" || accessible === 1 || accessible === "1";

    // Save edges
    await Edge.create({ from, to, distance, accessible: isAccessible });
    await Edge.create({ from: to, to: from, distance, accessible: isAccessible });

    // Collect nodes
    nodesSet.add(JSON.stringify({ _id: from, lat: lat1, lng: lon1 }));
    nodesSet.add(JSON.stringify({ _id: to, lat: lat2, lng: lon2 }));
  }

  // Save nodes
  for (const nodeStr of nodesSet) {
    const node = JSON.parse(nodeStr);
    await Node.updateOne({ _id: node._id }, node, { upsert: true });
  }

  console.log("✅ Graph imported into MongoDB");
  mongoose.connection.close();
}

importGraph();
