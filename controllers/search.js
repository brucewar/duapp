var config = require('../config').config;
exports.index = function(req, res){
  var q = req.query.q;
  res.redirect('https://www.google.com.hk/#hl=zh-CN&q=site:' + config.host + ' ' + q);
};