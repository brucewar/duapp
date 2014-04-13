var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ArticleClassSchema = new Schema({
  name: String
});

mongoose.model('ArticleClass', ArticleClassSchema);