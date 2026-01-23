const Edge = require("../models/edge");

async function loadGraphFromDB() {
  const edges = await Edge.find({});
  const graph = {};

  for (const e of edges) {
    if (!graph[e.from]) graph[e.from] = [];
    graph[e.from].push({
      to: e.to,
      distance: e.distance,
      accessible: e.accessible
    });
  }

  return graph;
}

module.exports = loadGraphFromDB;
