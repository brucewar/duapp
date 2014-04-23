var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CommentSchema = new Schema({
  name: String,
  email: String,
  comment: String,
  site: String,
  time: {type: Date, default: Date.now},
  gravatar: String,
  article_id: {type: ObjectId},
  comment_id: {type: ObjectId}
});

mongoose.model('Comment', CommentSchema);