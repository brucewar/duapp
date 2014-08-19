var models = require('../models');
var Article = models.Article,
  ArticleClass = models.ArticleClass,
  Comment = models.Comment,
  Blogroll = models.Blogroll;

var validator = require('validator'),
  utils = require('../libs/utils'),
  config = require('../config').config,
  log = require('../libs/log'),
  EventProxy = require('eventproxy');

exports.showWrite = function(req, res, next) {
  if (!req.session || !req.session.userName) {
    res.redirect('/login');
    return;
  }
  ArticleClass.find(function(err, classes) {
    if (err) {
      log.error('get ArticleClasses failed');
      next(err);
    }
    res.render('article/edit', {
      classes: classes
    });
  });
};
exports.write = function(req, res, next) {
  var title = validator.trim(req.body.title);
  var content = req.body.content;
  var classId = req.body.class_id;

  var error = '' == title ? '标题不能为空!' :
    title.length >= 5 && title.length <= 100 ? '' :
    '标题字数太多或太少!';

  if (error) {
    ArticleClass.find(function(err, classes) {
      if (err) {
        log.error('get ArticleClasses failed');
        next(err);
      }
      res.render('article/edit', {
        classes: classes,
        title: title,
        content: content,
        error: error
      });
    });
  } else {
    var article = new Article({
      title: title,
      content: content
    });
    if (0 != classId) {
      article.class_id = classId;
    }
    article.save(function(err, article) {
      if (err) {
        log.error('write new article failed');
        next(err);
      }
      res.redirect('/article/' + article._id + '/edit');
    });
  }
};

exports.showEdit = function(req, res, next) {
  var articleId = req.params.aid;

  Article.findById(articleId, function(err, article) {
    if (err) {
      log.error('get article by articleId %s failed', articleId);
      next(err);
    }
    ArticleClass.find(function(err, classes) {
      if (err) {
        log.error('get ArticleClasses failed');
        next(err);
      }
      res.render('article/edit', {
        article_id: article._id,
        title: article.title,
        content: article.content,
        class_id: article.class_id,
        classes: classes
      });
    });
  });
};

exports.update = function(req, res, next) {
  var article_id = req.params.aid;
  var title = validator.trim(req.body.title);
  var content = req.body.content;
  var classId = req.body.class_id;

  var error = '' == title ? '标题不能为空!' :
    title.length >= 5 && title.length <= 100 ? '' :
    '标题字数太多或太少!';

  if (error) {
    ArticleClass.find(function(err, classes) {
      if (err) {
        log.error('get ArticleClasses failed');
        next(err);
      }
      res.render('article/edit', {
        classes: classes,
        article_id: article_id,
        title: title,
        content: content,
        error: error
      });
    });
  } else {
    var update = {
      title: title,
      content: content
    };
    if (0 != classId) {
      update.class_id = classId;
    }
    Article.findByIdAndUpdate(article_id, {
      $set: update
    }, function(err) {
      if (err) {
        log.error('update article failed with articleId: ' + articleId);
        next(err);
      }
      res.redirect('/article/' + article_id + '/edit');
    });
  }
};

exports.deleteArticleByID = function(req, res, next) {
  var article_id = req.body.article_id;
  Article.findByIdAndRemove(article_id, function(err) {
    if (err) {
      log.error('delete article by articleId %s failed', article_id);
      res.json({
        status: 'failed'
      });
      return;
    }
    res.json({
      status: 'success'
    });
  });
};

exports.changeArticleClass = function(req, res, next) {
  var article_id = req.body.article_id;
  var class_id = req.body.class_id;
  if (0 == class_id) {
    class_id = '';
  }
  Article.findByIdAndUpdate(article_id, {
    $set: {
      class_id: class_id
    }
  }, function(err) {
    if (err) {
      log.error('change article class failed with article_id: ' + article_id);
      res.json({
        status: 'failed'
      });
      return;
    }
    res.json({
      status: 'success'
    });
  });
};

exports.getArticleByID = function(req, res, next) {
  var article_id = req.params.aid;
  var options = {
    limit: config.recent_limit,
    sort: [
      ['time', 'desc']
    ]
  };

  Article.findById(article_id, function(err, article) {
    if (err) {
      log.error('get article by id %s failed', article_id);
      next(err);
    }
    //filter spider and author read count
    var userAgent = req.header('user-agent');
    if (!req.session.userName && (userAgent.indexOf('Googlebot') == -1 || userAgent.indexOf('Baiduspider') == -1)) {
      article.read_count++;
      article.save(function(err) {
        if (err) {
          log.error('update article read_count failed');
          next(err);
        }
      });
    }
    var render = function(className, commentCount, ret, hotArticles, comments, blogrolls) {
      article.create_time = utils.formatDate(article.time, 'yyyy-MM-dd hh:mm');
      article.class_name = className;
      res.render('article/index', {
        userName: req.session.userName,
        commentUser: req.session.comment,
        article: article,
        commentCount: commentCount,
        ret: ret,
        hotArticles: hotArticles,
        comments: comments,
        blogrolls: blogrolls
      });
    };
    var proxy = EventProxy.create('classname', 'comment_count', 'ret', 'hot_articles', 'new_comments', 'blogrolls', render);
    proxy.fail(function(err) {
      if (err) {
        log.error('get info for article index view failed');
        next(err);
      }
    });

    //当文章有class_id时,获取文章分类名
    if (article.class_id) {
      ArticleClass.findById(article.class_id, function(err, cl) {
        if (err) {
          log.error('get ArticleClass name failed with classId ' + article.class_id);
          next(err);
        }
        proxy.emit('classname', cl.name);
      });
    } else {
      proxy.emit('classname', '未分类');
    }
    //获取文章一级评论
    Comment.find({
      article_id: article_id
    }, '', {
      sort: [
        ['time', 'asc']
      ]
    }, function(err, comments) {
      if (err) {
        log.error('get comment failed with articleId ' + article_id);
        next(err);
      }
      proxy.emit('comment_count', comments.length);
      comments.forEach(function(comment) {
        comment.create_time = utils.formatDate(comment.time, 'yyyy-MM-dd hh:mm');
      });

      //获得子评论的数组
      var childComments = comments.filter(function(comment) {
        return comment.comment_id ? true : false;
      });

      //获得一级评论的数组
      comments = comments.filter(function(comment) {
        return comment.comment_id ? false : true;
      });

      var ret = {
        tree: 'root',
        comments: comments
      };

      //构造评论树
      function createTree(ret, comment) {
        if (ret.comments) {
          var i = -1;
          var length = ret.comments.length;
          while (++i < length) {
            if (comment.comment_id.toString() == ret.comments[i]._id.toString()) {
              if (ret.comments[i].comments == undefined) {
                ret.comments[i].comments = [];
              }
              ret.comments[i].comments.push(comment);
              return;
            } else {
              createTree(ret.comments[i], comment);
            }
          }
        }
      }
      childComments.forEach(function(comment) {
        createTree(ret, comment);
      });
      proxy.emit('ret', ret);
    });

    //获取热门文章
    var hotOptions = {
      sort: [
        ['read_count', 'desc']
      ],
      limit: config.recent_limit
    };
    Article.find({}, 'title', hotOptions, function(err, hotArticles) {
      proxy.emit('hot_articles', hotArticles);
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
  });
};