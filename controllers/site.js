var models = require('../models');
var ArticleClass = models.ArticleClass,
  Article = models.Article,
  Project = models.Project,
  Comment = models.Comment,
  Blogroll = models.Blogroll;

var utils = require('../libs/utils'),
  EventProxy = require('eventproxy'),
  config = require('../config').config,
  log = require('../libs/log');

exports.index = function(req, res) {
  var options = {
    limit: config.recent_limit,
    sort: [
      ['time', 'desc']
    ]
  };
  var render = function(articles, comments, blogrolls) {
    res.render('index', {
      userName: req.session.userName,
      articles: articles,
      comments: comments,
      blogrolls: blogrolls
    });
  };

  var proxy = EventProxy.create('articles', 'new_comments', 'blogrolls', render);
  proxy.fail(function(err) {
    if (err) {
      log.error('get data for home page error: ' + err);
      return;
    }
  });

  //获取最新5篇博文
  Article.find({}, null, options, function(err, articles) {
    var classProxy = new EventProxy();
    classProxy.after('class', articles.length, function(classes) {
      for (var i = 0, len = articles.length; i < len; i++) {
        if (classes[i]) {
          articles[i].class_name = classes[i].name;
        }
        articles[i].create_time = utils.formatDate(articles[i].time, 'yyyy-MM-dd');
      }
    });
    for (var i = 0, len = articles.length; i < len; i++) {
      ArticleClass.findOne({_id: articles[i].class_id}, classProxy.group('class'));
    }
    //取评论数
    var commentProxy = new EventProxy();
    commentProxy.after('comment_count', articles.length, function(comment_counts) {
      for (var i = 0, len = articles.length; i < len; i++) {
        articles[i].comment_count = comment_counts[i];
      }
      proxy.emit('articles', articles);
    });
    for (var j = 0; j < len; j++) {
      Comment.count({article_id: articles[j]._id}, commentProxy.group('comment_count'));
    }
  });

  //获取最新评论
  Comment.find({}, null, options, function(err, comments) {
    if (0 < comments.length) {
      for (var i = 0, len = comments.length; i < len; i++) {
        comments[i].create_time = utils.formatDate(comments[i].time, 'yyyy-MM-dd');
      }
    }
    proxy.emit('new_comments', comments);
  });

  //获取友情链接
  Blogroll.find(function(err, blogrolls) {
    proxy.emit('blogrolls', blogrolls);
  });
};

exports.showArticleContent = function(req, res) {
  var classId = req.query.class_id;
  var current_page = req.query.page || 1;

  var limit = config.page_limit;

  var render = function(noClassCount, classes, articles, pages) {
    res.render('content', {
      userName: req.session.userName,
      class_id: classId,
      noClass_count: noClassCount,
      classes: classes,
      articles: articles,
      current_page: current_page,
      pages: pages
    });
  };

  var proxy = EventProxy.create('noClassCount', 'classes', 'articles', 'pages', render);
  proxy.fail(function(err) {
    if (err) {
      log.error('get data for article content view error: ' + err);
      return;
    }
  });

  //获取总页数
  switch (classId) {
    case undefined:
      Article.count(function(err, count) {
        if (err) {
          log.error('get the count of artilces error.');
          return err;
        }
        var pages = Math.ceil(count / limit);
        proxy.emit('pages', pages);
      });
      break;
    case '0':
      Article.count({class_id: undefined}, function(err, count) {
        if (err) {
          log.error('get the count of unclassified articles error.');
          return;
        }
        var pages = Math.ceil(count / limit);
        proxy.emit('pages', pages);
      });
      break;
    default:
      Article.count({class_id: classId}, function(err, count) {
        if (err) {
          log.error('get the count of articles with class_id' + classId);
          return;
        }
        var pages = Math.ceil(count / limit);
        proxy.emit('pages', pages);
      });
      break;
  }

  //获取未分类博文篇数
  Article.count({class_id: undefined}, proxy.done('noClassCount'));

  //获取分类信息
  ArticleClass.find(function(err, classes) {
    if (err) {
      log.error('get classes error: ' + err);
      return;
    }
    var classProxy = new EventProxy();
    classProxy.after('count', classes.length, function(counts) {
      for (var i = 0, len = classes.length; i < len; i++) {
        classes[i].count = counts[i];
      }
      proxy.emit('classes', classes);
    });

    for (var i = 0, len = classes.length; i < len; i++) {
      Article.count({class_id: classes[i]._id}, classProxy.group('count'));
    }
  });

  var options = {
    skip: (current_page - 1) * limit,
    limit: limit,
    sort: [
      ['time', 'desc']
    ]
  };
  //获取博文信息
  switch (classId) {
    case undefined:
      Article.find({}, null, options, function(err, articles) {
        if (err) {
          log.error('get all articles error: ' + err);
          return;
        }
        articles.forEach(function(article) {
          article.create_time = utils.formatDate(article.time, 'yyyy-MM-dd hh:mm');
        });
        proxy.emit('articles', articles);
      });
      break;
    case '0':
      Article.find({class_id: undefined}, null, options, function(err, articles) {
        if (err) {
          log.error('get unclassified articles error: ' + err);
          return;
        }
        articles.forEach(function(article) {
          article.create_time = utils.formatDate(article.time, 'yyyy-MM-dd hh:mm');
        });
        proxy.emit('articles', articles);
      });
      break;
    default:
      Article.find({class_id: classId}, null, options, function(err, articles) {
        if (err) {
          log.error('get articles with class_id: ' + classId);
          return;
        }
        articles.forEach(function(article) {
          article.create_time = utils.formatDate(article.time, 'yyyy-MM-dd hh:mm');
        });
        proxy.emit('articles', articles);
      });
      break;
  }
};

exports.showProjectList = function(req, res) {
  Project.find(function(err, projects) {
    if (err) {
      log.error('get all projects error: ' + error);
      return;
    }
    projects.forEach(function(project) {
      project.start_time = utils.formatDate(project.time, 'yyyy-MM');
      project.detail = project.detail ? project.detail.substr(0, 20) : '';
    });
    res.render('project', {
      userName: req.session.userName,
      projects: projects
    });
  });
};

exports.showAbout = function(req, res) {
  res.render('about', {
    userName: req.session.userName
  });
};