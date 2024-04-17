const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  ts: Date,
  machine_status: Number,
  vibration: Number
});

const DataModel = mongoose.model('Data', DataSchema);

module.exports = DataModel;