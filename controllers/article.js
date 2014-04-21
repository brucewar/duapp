var models = require('../models');
var Article = models.Article,
  ArticleClass = models.ArticleClass,
  Comment  = models.Comment;

var validator = require('validator'),
  utils = require('../libs/utils'),
  EventProxy = require('eventproxy');

exports.showWrite = function(req, res){
  if(!req.session || !req.session.user){
    res.redirect('/login');
    return;
  }
  ArticleClass.find(function(err, classes){
    if(err){
      return err;
    }
    res.render('article/edit', {classes: classes});
  });
};
exports.write = function (req, res) {
  var title = validator.trim(req.body.title);
  var content = req.body.content;
  var classId = req.body.class_id;

  var error = '' == title ? '标题不能为空!' :
    title.length >= 5 && title.length <= 100 ? '' :
      '标题字数太多或太少!';

  if(error){
    ArticleClass.find(function(err, classes){
      if(err){
        return err;
      }
      res.render('article/edit', {classes: classes, title: title, content: content, error: error});
    });
  }else{
    var article = new Article({
      title: title,
      content: content
    });
    if(0 != classId){
      article.class_id = classId;
    }
    article.save(function (err, article) {
      if (err) {
        return err;
      }
      res.redirect('/article/' + article._id + '/edit');
    });
  }
};

exports.showEdit = function(req, res){
  var articleId = req.params.aid;

  Article.findById(articleId, function(err, article){
    if(err){
      return err;
    }
    ArticleClass.find(function(err, classes){
      if(err){
        return err;
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

exports.update = function(req, res){
  var article_id = req.params.aid;
  var title = validator.trim(req.body.title);
  var content = req.body.content;
  var classId = req.body.class_id;

  var error = '' == title ? '标题不能为空!' :
      title.length >= 5 && title.length <= 100 ? '' :
    '标题字数太多或太少!';

  if(error){
    ArticleClass.find(function(err, classes){
      if(err){
        return err;
      }
      res.render('article/edit', {
        classes: classes,
        article_id:article_id,
        title: title,
        content: content,
        error: error
      });
    });
  }else{
    var update = {
      title: title,
      content: content
    };
    if(0 != classId){
      update.class_id = classId;
    }
    Article.findByIdAndUpdate(article_id, {$set: update}, function (err) {
      if (err) {
        return err;
      }
      res.redirect('/article/' + article_id + '/edit');
    });
  }
};

exports.deleteArticleByID = function (req, res) {
  var article_id = req.body.article_id;
  Article.findByIdAndRemove(article_id, function (err) {
    if (err) {
      res.json({status: 'failed'});
      return err;
    }
    res.json({status: 'success'});
  });
};

exports.changeArticleClass = function (req, res) {
  var article_id = req.body.article_id;
  var class_id = req.body.class_id;
  console.log(class_id);
  if(0 == class_id){
    class_id = '';
  }
  Article.findByIdAndUpdate(article_id, {$set: {class_id: class_id}}, function (err) {
    if (err) {
      res.json({status: 'failed'});
      return err;
    }
    res.json({status: 'success'});
  });
};

exports.getArticleByID = function (req, res) {
  var article_id = req.params.aid;

  Article.findById(article_id, function (err, article) {
    if (err) {
      return err;
    }
    article.read_count++;
    article.save(function(err){
      if(err){
        return err;
      }
    });
    var render = function(className, comments){
      article.create_time = utils.formatDate(article.time, 'yyyy-MM-dd hh:mm');
      article.class_name = className;
      res.render('article/index', {user: req.session.user, article: article, comments: comments});
    };
    var proxy = EventProxy.create('classname', 'comments', render);
    proxy.fail(function(err){
      if(err) return err;
    });

    //当文章有class_id时,获取文章分类名
    if(article.class_id){
      ArticleClass.findById(article.class_id, function(err, cl){
        if(err) {
          return err;
        }
        proxy.emit('classname', cl.name);
      });
    }else{
      proxy.emit('classname', '未分类');
    }
    //获取文章评论
    Comment.find({article_id: article_id}, function(err, comments){
      if(err){
        return err;
      }
      comments.forEach(function(comment){
        comment.create_time = utils.formatDate(comment.time, 'yyyy-MM-dd hh:mm');
      });
      proxy.emit('comments', comments);
    });
  });
};