// routes/path.js
const express = require("express");
const router = express.Router();
const dijkstra = require("../algorithm/dijkstra");

/**
 * POST /api/find-path
 * Body: { start: "N012", end: "N014", accessibleOnly: true/false }
 */
// router.get("/find-path", (req, res) => {
//   res.send("✅ Path API is alive");
// });

router.post("/find-path", (req, res) => {
  const { start, end, accessibleOnly = false } = req.body;
  const graph = req.graph; // 👈 FROM DB

  // Validation
  if (!start || !end) {
    return res.status(400).json({ error: "start and end nodes are required" });
  }

  if (!graph[start]) {
    return res.status(404).json({ error: `Start node ${start} not found` });
  }

  if (!graph[end]) {
    return res.status(404).json({ error: `End node ${end} not found` });
  }

  const result = dijkstra(graph, start, end, accessibleOnly);

  if (result.path.length === 0) {
    return res.status(404).json({
      error: "No path found",
      start,
      end,
      accessibleOnly
    });
  }

  res.json(result);
});

module.exports = router;
