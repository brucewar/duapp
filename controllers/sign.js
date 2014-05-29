var validator = require('validator');
var utils = require('../libs/utils');
var User = require('../models').User;

exports.showLogin = function(req, res){
  res.render('sign/login');
};

exports.showRegister = function(req, res){
  res.render('sign/register');
};

exports.register = function(req, res){
  var userName = validator.trim(req.body.user_name);
  var password = validator.trim(req.body.password);
  var repeatPassword = validator.trim(req.body.repeat_password);

  if('' === userName || '' === password || '' === repeatPassword){
    res.render('sign/register', {error: '信息不完整!', userName: userName});
    return;
  }

  if(password !== repeatPassword){
    res.render('sign/register', {error: '两次密码输入不一致!', userName: userName});
    return;
  }

  User.findOne({user_name: userName}, function(err, user){
    if(err){
      return err;
    }
    if(user){
      res.render('sign/register', {error: '用户名已被使用!', userName: userName});
      return;
    }
    //new user
    password = utils.md5(password);
    user = new User({
      user_name: userName,
      password: password
    });
    user.save(function(err){
      if(err){
        return err;
      }
      res.render('sign/register', {success: '注册成功!'});
    });
  });
};

exports.login = function(req, res){
  var userName = req.body.user_name;
  userName = validator.trim(userName);
  var password = req.body.password;
  password = validator.trim(password);

  if('' === userName || '' === password){
    res.render('sign/login', {error: '信息不完整!'});
    return;
  }

  User.findOne({user_name: userName}, function(err, user){
    if(err){
      return err;
    }
    if(!user){
      res.render('sign/login', {error: '用户名不存在!'});
      return;
    }

    password = utils.md5(password);
    if(user.password !== password){
      res.render('sign/login', {error: '密码不正确!'});
      return;
    }
    req.session.user = user;
    res.redirect('/');
  });
};

exports.logout = function(req, res){
  req.session.user = null;
  res.redirect('/');
};

exports.requireLogin = function(req, res, next){
  if(!req.session.user){
    res.redirect('/login');
    return;
  }
  res.locals({user: req.session.user});
  next();
};

exports.showChangePassword = function(req, res){
  res.render('sign/change_password');
};

exports.changePassword = function(req, res){
  var oldPassword = req.body.old_password;
  oldPassword = validator.trim(oldPassword);
  var newPassword = req.body.new_password;
  newPassword = validator.trim(newPassword);
  var repeatPassword = req.body.repeat_password;
  repeatPassword = validator.trim(repeatPassword);

  if('' === oldPassword || '' === newPassword || '' === repeatPassword){
    res.render('sign/change_password', {error: '信息输入不完整!'});
    return;
  }

  oldPassword = utils.md5(oldPassword);
  if(oldPassword !== req.session.user.password){
    res.render('sign/change_password', {error: '原密码不正确!'});
    return;
  }

  if(newPassword !== repeatPassword){
    res.render('sign/change_password', {error: '两次新密码输入不一致!'});
    return;
  }

  newPassword = utils.md5(newPassword);
  User.findOneAndUpdate({user_name: req.session.user.user_name}, {$set: {password: newPassword}}, function(err){
    if(err){
      return err;
    }
    res.render('sign/change_password', {success: '密码修改成功!'});
  });
};