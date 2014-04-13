var ArticleClass = require('../models').ArticleClass;
var Article = require('../models').Article;

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
            res.json({status: 'failed'});
            return err;
          }
          res.json({status: 'success'});
        });
        break;
      case 'modify':
        ArticleClass.findByIdAndUpdate(cl._id, {$set: {name: cl.name}}, function(err){
          if(err){
            res.json({status: 'failed'});
            return err;
          }
          res.json({status: 'success'});
        });
        break;
      case 'delete':
        ArticleClass.findByIdAndRemove(cl._id, function(err) {
          if (err) {
            res.json({status: 'failed'});
            return err;
          }
          Article.update({class_id: cl._id}, {$set: {class_id: ''}}, {multi: true}, function(err){
            if(err){
              res.json({status: 'failed'});
              return err;
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