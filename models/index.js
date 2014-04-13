var mongoose = require('mongoose');
var config = require('../config').config;

var connect_string;
//development
//connect_string = config.local_db;

//production
connect_string = "mongodb://" + config.db.name + ":" + config.db.password + "@" +
  config.db.host + ":" + config.db.port + "/" + config.db.name;

mongoose.connect(connect_string, function(err){
  if(err){
    console.error("Connect to %s error: ", connect_string, err.message);
    process.exit(1);
  }
});

//models
require('./user');
require('./article_class');
require('./article');

exports.User = mongoose.model('User');
exports.ArticleClass = mongoose.model('ArticleClass');
exports.Article = mongoose.model('Article');