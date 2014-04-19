var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  name: String,
  description: String,
  detail: String,
  time: {type: Date, default: Date.now}
});

mongoose.model('Project', ProjectSchema);