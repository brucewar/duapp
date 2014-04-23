var mongoose = require('mongoose');
var config = require('../config').config;

var connect_string;
//production
connect_string = "mongodb://" + config.db.user_name + ":" + config.db.password + "@" +
  config.db.host + ":" + config.db.port + "/" + config.db.name;

//development
//connect_string = config.local_db;

mongoose.connect(connect_string, function(err){
  if(err){
    console.error("Connect to %s error: ", connect_string, err.message);
    process.exit(1);
  }
});

db = mongoose.connection;
db.on('error', function (err) {
  db.close();
});
db.on('close', function () {
  mongoose.connect(connect_string);
});

//models
require('./user');
require('./article_class');
require('./article');
require('./project');
require('./comment');

exports.User = mongoose.model('User');
exports.ArticleClass = mongoose.model('ArticleClass');
exports.Article = mongoose.model('Article');
exports.Project = mongoose.model('Project');
exports.Comment = mongoose.model('Comment');