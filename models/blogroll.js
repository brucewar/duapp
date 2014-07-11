var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlogrollSchema = new Schema({
	name: String,
	domain: String
});

mongoose.model('Blogroll', BlogrollSchema);