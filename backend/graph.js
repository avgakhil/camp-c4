const fs = require('fs');
const path = require('path');

const graphPath = path.join(__dirname, 'data', 'campusGraph.json');
const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));

module.exports = graph;
