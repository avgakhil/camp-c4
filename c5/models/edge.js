const mongoose = require("mongoose");

const edgeSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  distance: { type: Number, required: true },
  accessible: { type: Boolean, default: true }
});

module.exports = mongoose.model("Edge", edgeSchema);
