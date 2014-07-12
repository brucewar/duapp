var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlogrollSchema = new Schema({
	webmaster: String,
	domain: String
});

mongoose.model('Blogroll', BlogrollSchema);