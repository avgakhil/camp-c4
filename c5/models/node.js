const mongoose = require("mongoose");

const nodeSchema = new mongoose.Schema({
  _id: String,              // e.g. "N012"
  name: String,             // e.g. "Bus Parking"
  lat: Number,
  lng: Number,
  type: String              // parking, building, junction
});

module.exports = mongoose.model("node", nodeSchema);
