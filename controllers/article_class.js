var ArticleClass = require('../models').ArticleClass;
var Article = require('../models').Article;

var config = require('../config').config,
  utils = require('../libs/utils'),
  fs = require('fs'),
  Log = require('log');

var stream = fs.createWriteStream('./logs/' + utils.formatDate('YYYYMMDD') + '.log');
var log = new Log(config.log_level, stream);

exports.saveClassesChange = function (req, res) {
  var classes = req.body.classes;

  classes.forEach(function(cl){
    switch (cl.condition) {
      case 'add':
        var newClass = new ArticleClass({
          name: cl.name
        });
        newClass.save(function(err){
          if(err){
            log.error('add new class %s failed', cl.name);
            res.json({status: 'failed'});
            return;
          }
          res.json({status: 'success'});
        });
        break;
      case 'modify':
        ArticleClass.findByIdAndUpdate(cl._id, {$set: {name: cl.name}}, function(err){
          if(err){
            log.error('modify class %s failed', cl.name);
            res.json({status: 'failed'});
            return;
          }
          res.json({status: 'success'});
        });
        break;
      case 'delete':
        ArticleClass.findByIdAndRemove(cl._id, function(err) {
          if (err) {
            log.error('delete class %s failed', cl.name);
            res.json({status: 'failed'});
            return;
          }
          Article.update({class_id: cl._id}, {$unset: {class_id: ''}}, {multi: true}, function(err){
            if(err){
              log.error('update article class_id %s to null failed', cl._id);
              res.json({status: 'failed'});
              return;
            }
            res.json({status: 'success'});
          });
        });
        break;
      default :
        break;
    }
  });
};