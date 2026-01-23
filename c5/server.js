const express = require("express");
const mongoose = require("mongoose");
const pathRoutes = require("./routes/path");
const loadGraph = require("./utils/loadGraph");

const app = express();
app.use(express.json());

let graph = null;

mongoose
  .connect("mongodb://127.0.0.1:27017/campus")
  .then(async () => {
    console.log("✅ MongoDB connected");
    graph = await loadGraph();
    console.log("✅ Graph loaded into memory");
  })
  .catch(err => console.error(err));
 // Test route 
// app.post("/api/find-path", (req, res) => {
//   res.send("ROUTE HIT");
// });

// Inject graph into every request
app.use((req, res, next) => {
  if (!graph) {
    return res.status(503).json({ error: "Graph not loaded yet" });
  }
  req.graph = graph;
  next();
});
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

app.use("/api", pathRoutes);

app.listen(3000, () => console.log("🚀 Server running on port 3000"));

// const express = require("express");
// const app = express();

// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("SERVER IS ALIVE");
// });

// app.post("/api/find-path", (req, res) => {
//   console.log("➡️ /api/find-path HIT");
//   res.json({ ok: true });
// });

// app.listen(3000, () => {
//   console.log("🚀 Server running on port 3000");
// });
