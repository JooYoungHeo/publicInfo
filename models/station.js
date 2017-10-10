const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let stationSchema = new Schema({
  line: String,
  stationName: String,
  stationId: String,
  type: String
});

module.exports = mongoose.model('Station', stationSchema);
