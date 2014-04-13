var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ArticleSchema = new Schema({
  title: String,
  content: String,
  time: {type: Date, default: Date.now},
  read_count: {type: Number, default: 0},
  class_id: {type: ObjectId}
});

mongoose.model('Article', ArticleSchema);