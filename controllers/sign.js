var validator = require('validator'),
  utils = require('../libs/utils'),
  User = require('../models').User,
  config = require('../config').config,
  fs = require('fs'),
  Log = require('log');

var stream = fs.createWriteStream('./logs/' + utils.formatDate('YYYYMMDD') + '.log');
var log = new Log(config.log_level, stream);

exports.showLogin = function(req, res) {
  res.render('sign/login');
};

exports.showRegister = function(req, res) {
  res.render('sign/register');
};

exports.register = function(req, res) {
  var userName = validator.trim(req.body.user_name);
  var password = validator.trim(req.body.password);
  var repeatPassword = validator.trim(req.body.repeat_password);

  if ('' === userName || '' === password || '' === repeatPassword) {
    res.render('sign/register', {
      error: '信息不完整!',
      userName: userName
    });
    return;
  }

  if (password !== repeatPassword) {
    res.render('sign/register', {
      error: '两次密码输入不一致!',
      userName: userName
    });
    return;
  }

  User.findOne({user_name: userName}, function(err, user) {
    if (err) {
      log.error('get user error with user_name: ' + userName);
      return;
    }
    if (user) {
      res.render('sign/register', {
        error: '用户名已被使用!',
        userName: userName
      });
      return;
    }
    //new user
    password = utils.md5(password);
    user = new User({
      user_name: userName,
      password: password
    });
    user.save(function(err) {
      if (err) {
        log.error('user register error: ' + err);
        return;
      }
      res.render('sign/register', {
        success: '注册成功!'
      });
    });
  });
};

exports.login = function(req, res) {
  var userName = req.body.user_name;
  userName = validator.trim(userName);
  var password = req.body.password;
  password = validator.trim(password);

  if ('' === userName || '' === password) {
    res.render('sign/login', {
      error: '信息不完整!'
    });
    return;
  }

  User.findOne({user_name: userName}, function(err, user) {
    if (err) {
      log.error('get user error with user_name: ' + userName);
      return;
    }
    if (!user) {
      res.render('sign/login', {
        error: '用户名不存在!'
      });
      return;
    }

    password = utils.md5(password);
    if (user.password !== password) {
      res.render('sign/login', {
        error: '密码不正确!'
      });
      return;
    }
    req.session.userName = userName;
    res.redirect('/');
  });
};

exports.logout = function(req, res) {
  req.session.userName = null;
  res.redirect('/');
};

exports.requireLogin = function(req, res, next) {
  if (!req.session.userName) {
    res.redirect('/login');
    return;
  }
  res.locals({
    userName: req.session.userName
  });
  next();
};

exports.showChangePassword = function(req, res) {
  res.render('sign/change_password');
};

exports.changePassword = function(req, res) {
  var userName = req.session.userName;
  var oldPassword = req.body.old_password;
  oldPassword = validator.trim(oldPassword);
  var newPassword = req.body.new_password;
  newPassword = validator.trim(newPassword);
  var repeatPassword = req.body.repeat_password;
  repeatPassword = validator.trim(repeatPassword);

  if ('' === oldPassword || '' === newPassword || '' === repeatPassword) {
    res.render('sign/change_password', {
      error: '信息输入不完整!'
    });
    return;
  }

  if (newPassword !== repeatPassword) {
    res.render('sign/change_password', {
      error: '两次新密码输入不一致!'
    });
    return;
  }

  oldPassword = utils.md5(oldPassword);
  User.findOne({user_name: userName}, function(err, user) {
    if (err) {
      log.error('get user with user_name: ' + userName);
      return;
    }
    if (oldPassword !== user.password) {
      res.render('sign/change_password', {
        error: '原密码不正确!'
      });
    } else {
      newPassword = utils.md5(newPassword);
      user.password = newPassword;
      user.save(function(err) {
        if (err) {
          log.error('change password error with newPassword: ' + newPassword);
          return;
        }
        res.render('sign/change_password', {
          success: '密码修改成功!'
        });
      });
    }
  });
};