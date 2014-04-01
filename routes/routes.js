/*require controllers here*/
var articleClassController = require('./controllers/articleClass');
var articleController = require('./controllers/article');

module.exports = function(app){
    app.get('/',function(req,res){res.render('index');});
    app.get('/articlecontent',function(req,res){res.render('articlecontent');});
    app.get('/writearticle',function(req,res){res.render('writearticle');});
    app.get('/editarticle',function(req,res){res.render('editarticle');});
    app.get('/articledetail',function(req,res){res.render('articledetail');});

    /*ArticleClassAPI*/
    app.get('/articleclass/getAllClasses',articleClassController.getAllClasses);
    app.post('/articleclass/addClasses',articleClassController.addClasses);
    app.post('/articleclass/updateClasses',articleClassController.updateClasses);
    app.post('/articleclass/removeClasses',articleClassController.removeClasses);
    app.get('/articleclass/getClassByID',articleClassController.getClassByID);

    /*ArticleAPI*/
    app.post('/article/writeArticle',articleController.writeArticle);
    app.get('/article/countArticleByClassID',articleController.countArticleByClassID);
    app.get('/article/getArticleByClassID',articleController.getArticleByClassID);
    app.get('/article/deleteArticleByID',articleController.deleteArticleByID);
    app.get('/article/changeArticleClass',articleController.changeArticleClass);
    app.post('/article/updateArticle',articleController.updateArticle);
    app.get('/article/getArticleByID',articleController.getArticleByID);
};