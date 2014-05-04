var config = require('../config').config;
exports.index = function(req, res){
  var q = req.query.q;
  res.redirect('https://www.google.com.hk/#hl=zh-CN&q=site:' + config.host + ' ' + q);
<<<<<<< HEAD
};
=======
};
>>>>>>> 7003c6d85d27a20336e9b9f260f6a6e576b7be56
