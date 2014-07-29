var nodemailer = require('nodemailer');
var util = require('util');
var config = require('../config').config,
  utils = require('../libs/utils'),
  fs = require('fs'),
  Log = require('log');

var stream = fs.createWriteStream('../logs/' + utils.formatDate('YYYYMMDD') + '.log');
var log = new Log(config.log_level, stream);

var transport = nodemailer.createTransport('SMTP', config.mail_opts);

var sendMail = function (data) {
  // 遍历邮件数组，发送每一封邮件，如果有发送失败的，就再压入数组，同时触发mailEvent事件
  transport.sendMail(data, function (err) {
    if (err) {
      // 写为日志
      log.error('failed to send email to %s', data.to);
    }else {
      log.info('%s sends email to %s', data.from, data.to);
    }
  });
};

exports.sendReplyMail = function (who, comment) {
  var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
  var to = who;
  var subject = config.name + ' 新消息';
  var url = config.host + '/article/' + comment.article_id + '#' + comment._id;
  var html = '<p>您好：<p/> \
    <p> \
      <a href="' + comment.site + '">' + comment.name + '</a> \
      在我的博文 ' + '<a href="' + url + '">' + url + '</a> \
      中回复了您: \
    </p> \
    <hr/> \
    <p>若您没有在' + config.name + '主页发表过任何评论信息，说明有人滥用了您的电子邮箱，请删除此邮件，我对给您造成的打扰感到抱歉。</p>';

  sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};