var Comment = require('../models').Comment;

var validator = require('validator'),
  utils = require('../libs/utils'),
  mail = require('./email'),
  config = require('../config').config;

exports.create = function(req, res){
  var articleId = req.body.article_id,
    commentId = req.body.comment_id,
    realName = validator.trim(req.body.real_name),
    email = validator.trim(req.body.email),
    site = validator.trim(req.body.site || ''),
    comment = validator.trim(req.body.comment);

  var error = '';
  if('' == realName || '' == email){
    error = '姓名或者邮箱不能为空!';
    res.json({status: 'failed', message: error});
    return;
  }

  if(!validator.isEmail(email)){
    error = '邮箱格式不正确!';
    res.json({status: 'failed', message: error});
    return;
  }

  if('' == comment){
    error = '评论内容不能为空!';
    res.json({status: 'failed', message: error});
    return;
  }

  var gravatar = 'http://www.gravatar.com/avatar/' + utils.md5(email) + '?s=32';
  var newComment = new Comment({
    name: realName,
    email: email,
    site: site,
    comment: comment,
    gravatar: gravatar,
    article_id: articleId
  });

  if(commentId !== ''){
    newComment.comment_id = commentId
  }

  newComment.save(function(err, comment){
    if(err){
      error = '评论失败!';
      res.json({status: 'failed', message: error});
      return err;
    }
    req.session.comment = comment;
    res.json({status: 'success', comment: comment});
    if(!comment.comment_id){
      //发送消息提示给博主
      mail.sendReplyMail(config.email, comment)
    }else {
      Comment.findById(comment.comment_id, function(err, parentComment){
        if(err){
          return err;
        }
        mail.sendReplyMail(parentComment.email, comment);
      });
    }
  });
};

exports.deleteComment = function(req, res){
  var commentIds = req.body.comment_ids;
  Comment.remove({_id: {$in: commentIds}}, function(err){
    if(err){
      res.json({status: 'failed'});
      return err;
    }
    res.json({status: 'success'});
  });
};