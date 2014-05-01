exports.index = function(req, res){
  var q = req.query.q;
  res.redirect('https://www.google.com.hk/#hl=zh-CN&q=site:brucewar.duapp.com+' + q);
};