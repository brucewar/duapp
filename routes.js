/**
 * require controllers here
 */
var site = require('./controllers/site');
var sign = require('./controllers/sign');
var articleClass = require('./controllers/article_class');
var article = require('./controllers/article');
var project = require('./controllers/project');
var comment = require('./controllers/comment');
var search = require('./controllers/search');

module.exports = function (app) {

  //page
  app.get('/', site.index);
  app.get('/content', site.showArticleContent);
  app.get('/project', site.showProjectList);
  app.get('/about', site.showAbout);

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
  app.get('/article/:aid', article.getArticleByID);

  //article_class
  app.post('/class/manage', articleClass.saveClassesChange);

  //project
  app.get('/project/create', sign.requireLogin, project.showCreate);
  app.get('/project/:pid/edit', sign.requireLogin, project.showEdit);
  app.post('/project/create', sign.requireLogin, project.create);
  app.post('/project/:pid/edit', sign.requireLogin, project.update);
  app.get('/project/:pid', project.getProjectByID);

  //comment
  app.post('/comment/create', comment.create);
  app.post('/comment/delete', comment.deleteComment);

  //search
  app.get('/search', search.index);
};