const express = require('express');
const cors = require('cors');
const graph = require('./graph');
const dijkstra = require('./dijkstra');

const app = express();
app.use(cors());



app.get('/path', (req, res) => {
  const { start, end, accessible } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: 'start and end required' });
  }

  const result = dijkstra(
    graph,
    start,
    end,
    accessible === 'true'
  );

  res.json(result);
});

const fs = require('fs');
const path = require('path');

// serve geojson to frontend
app.get('/geojson', (req, res) => {
  const geojsonPath = path.join(__dirname, 'data', 'campus.geojson');
  const data = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));
  res.json(data);
});

app.listen(3000, () => {
  console.log('✅ Backend running on http://localhost:3000');
});
