var models = require('../models');
var ArticleClass = models.ArticleClass,
  Article = models.Article,
  Project = models.Project;

var utils = require('../libs/utils'),
  EventProxy = require('eventproxy'),
  config = require('../config').config;

exports.index = function(req, res){
  var latest = 5;
  var options = {limit: latest, sort: [['time', 'desc']]};
  var render = function(articles){
    res.render('index', {user: req.session.user, articles: articles});
  };

  var proxy = EventProxy.create('articles', render);
  proxy.fail(function(err){
    if(err){
      return err;
    }
  });

  Article.find({}, null, options, function(err, articles){
    var classProxy = new EventProxy();
    classProxy.after('class', articles.length, function(classes){
      for(var i = 0, len = articles.length; i < len; i++){
        articles[i].class_name = classes[i].name;
        articles[i].create_time = utils.formatDate(articles[i].time, 'yyyy-MM-dd');
      }
      proxy.emit('articles', articles);
    });
    for(var i = 0, len = articles.length; i < len ; i++){
      ArticleClass.find({_id: articles.class_id}, classProxy.group('class'));
    }
  });
};

exports.showArticleContent = function(req, res){
  var classId = req.query.class_id;
  var current_page = req.query.page || 1;

  var limit = config.page_limit;

  var render = function(noClassCount, classes, articles, pages){
    res.render('content', {
      user: req.session.user,
      class_id: classId,
      noClass_count: noClassCount,
      classes: classes,
      articles: articles,
      current_page: current_page,
      pages: pages
    });
  };

  var proxy = EventProxy.create('noClassCount', 'classes', 'articles', 'pages', render);
  proxy.fail(function(err){
    if(err){
      return err;
    }
  });

  //获取总页数
  switch(classId){
    case undefined:
      Article.count(function(err, count){
        if(err){
          return err;
        }
        var pages = Math.ceil(count / limit);
        proxy.emit('pages', pages);
      });
      break;
    case '0':
      Article.count({class_id: undefined}, function(err, count){
        if(err){
          return err;
        }
        var pages = Math.ceil(count / limit);
        proxy.emit('pages', pages);
      });
      break;
    default :
      Article.count({class_id: classId}, function(err, count){
        if(err){
          return err;
        }
        var pages = Math.ceil(count / limit);
        proxy.emit('pages', pages);
      });
      break;
  }

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

  var options = {skip: (current_page - 1) * limit, limit: limit, sort: [['time', 'desc']]};
  //获取博文信息
  switch(classId){
    case undefined:
      Article.find({}, null, options, function(err, articles){
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
      Article.find({class_id: undefined}, null, options, function(err, articles){
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
      Article.find({class_id: classId}, null, options, function(err, articles){
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

exports.showProjectList = function(req, res){
  Project.find(function(err, projects){
    if(err){
      return err;
    }
    projects.forEach(function(project){
      project.start_time = utils.formatDate(project.time, 'yyyy-MM');
      project.detail = project.detail ? project.detail.substr(0, 20) : '';
    });
    res.render('project', {user: req.session.user, projects: projects});
  });
};

exports.showAbout = function(req, res){
  res.render('about', {user: req.session.user});
};