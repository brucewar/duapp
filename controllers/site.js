var models = require('../models');
var ArticleClass = models.ArticleClass,
  Article = models.Article;

var utils = require('../libs/utils');
var EventProxy = require('eventproxy');

exports.index = function(req, res){
  res.render('index', {user: req.session.user});
};

exports.showArticleContent = function(req, res){
  var classId = req.query.class_id;
  var current_page = req.query.page;

  var render = function(noClassCount, classes, articles){
    res.render('article/content', {
      user: req.session.user,
      class_id: classId,
      noClass_count: noClassCount,
      classes: classes,
      articles: articles
    });
  };

  var proxy = EventProxy.create('noClassCount', 'classes', 'articles', render);
  proxy.fail(function(err){
    if(err){
      return err;
    }
  });

  //获取未分类博文篇数
  Article.count({class_id: undefined}, proxy.done('noClassCount'));

  //获取分类信息
  ArticleClass.find(function(err, classes){
    if(err){
      return err;
    }
    var classProxy = new EventProxy();
    classProxy.after('count', classes.length, function(counts){
      for(var i = 0, len = classes.length; i < len; i++){
        classes[i].count = counts[i];
      }
      proxy.emit('classes', classes);
    });

    for(var i = 0, len = classes.length; i < len; i++){
      Article.count({class_id: classes[i]._id}, classProxy.group('count'));
    }
  });

  //获取博文信息
  switch(classId){
    case undefined:
      Article.find(function(err, articles){
        if(err){
          return err;
        }
        articles.forEach(function(article){
          article.create_time = utils.formatDate(article.time, 'yyyy-MM-dd hh:mm');
        });
        proxy.emit('articles', articles);
      });
      break;
    case '0':
      Article.find({class_id: undefined}, function(err, articles){
        if(err){
          return err;
        }
        articles.forEach(function(article){
          article.create_time = utils.formatDate(article.time, 'yyyy-MM-dd hh:mm');
        });
        proxy.emit('articles', articles);
      });
      break;
    default :
      Article.find({class_id: classId}, function(err, articles){
        if(err){
          return err;
        }
        articles.forEach(function(article){
          article.create_time = utils.formatDate(article.time, 'yyyy-MM-dd hh:mm');
        });
        proxy.emit('articles', articles);
      });
      break;
  }
};

exports.showAbout = function(req, res){
  res.render('about', {user: req.session.user});
};