var models = require('../models');
var ArticleClass = models.ArticleClass,
  Article = models.Article;

var utils = require('../libs/utils');

exports.index = function(req, res){
  res.render('index', {user: req.session.user});
};

exports.showArticleContent = function(req, res){
  ArticleClass.find(function(err, classes){
    if(err){
      return err;
    }
    classes.forEach(function(cl){
      Article.count({class_id: cl._id}, function(err, count){
        if(err){
          return err;
        }
        cl.count = count;
      });
    });
    Article.find(function(err, articles){
      if(err){
        return err;
      }
      //TODO 为什么不能直接设置article.time的值
      articles.forEach(function(article){
        article.create_time = utils.formatDate(article.time, 'yyyy-MM-dd hh:mm');
      });
      res.render('article/content', {user: req.session.user, classes: classes, articles: articles});
    });
  });
};

exports.showAbout = function(req, res){
  res.render('about', {user: req.session.user});
};