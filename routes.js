/**
 * require controllers here
 */
var site = require('./controllers/site');
var sign = require('./controllers/sign');
var articleClass = require('./controllers/article_class');
var article = require('./controllers/article');

module.exports = function (app) {

  //page
  app.get('/', site.index);
  app.get('/content', site.showArticleContent);

  //sign
  app.get('/register', sign.showRegister);
  app.post('/register', sign.register);
  app.get('/login', sign.showLogin);
  app.post('/login', sign.login);
  app.get('/logout', sign.logout);

  //article
  app.get('/article/write', sign.requireLogin, article.showWrite);
  app.post('/article/write', sign.requireLogin, article.write);
  app.get('/article/:aid/edit', sign.requireLogin, article.showEdit);
  app.post('/article/:aid/edit', sign.requireLogin, article.update);
  app.post('/article/change', article.changeArticleClass);
  app.post('/article/delete', article.deleteArticleByID);

  //article_class
  app.post('/class/manage', articleClass.saveClassesChange);
};