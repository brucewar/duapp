var Article = require('../models').Article,
  ArticleClass = require('../models').ArticleClass;

var validator = require('validator'),
  utils = require('../libs/utils');

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

    article.create_time = utils.formatDate(article.time, 'yyyy-MM-dd hh:mm');
    article.class_name = '未分类';
    if(!article.class_id){
      res.render('article/index', {article: article, user: req.session.user});
      return;
    }

    ArticleClass.findById(article.class_id, function(err, cl){
      if(err){
        return err;
      }
      article.class_name = cl.name;
      res.render('article/index', {article: article, user: req.session.user});
    });
  });
};