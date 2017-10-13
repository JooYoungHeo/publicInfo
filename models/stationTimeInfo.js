const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let subwaySchema = new Schema({
  line: String,
  station: String,
  stationId: String,
  timeTable: Schema.Types.Mixed,
  abbreviation: String,
  dailyType: String,
  upDownType: String,
  type: String
});

module.exports = mongoose.model('Subway', subwaySchema);
