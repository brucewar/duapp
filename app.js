/**
 * Module dependencies.
 */

var express = require('express'),
  http = require('http'),
  path = require('path'),
  fs = require('fs'),
  ejs = require('ejs'),
  partials = require('express-partials'),
  config = require('./config').config,
  routes = require('./routes'),
  utils = require('./libs/utils');
Loader = require('loader');
var app = express();

// all environments
app.set('port', config.port);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(partials());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({
  secret: config.session_secret,
  cookie: {
    maxAge: config.max_age
  }
}));

var assets = {};
if (config.mini_assets) {
  assets = JSON.parse(fs.readFileSync(path.join(__dirname, 'assets.json')));
}

app.locals({
  config: config,
  Loader: Loader,
  assets: assets,
  markdown: utils.markdown
});

routes(app);

app.use(function(req, res, next) {
  var err = new Error('页面不存在!');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    status: err.status
  });
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;