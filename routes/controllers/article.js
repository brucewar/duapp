var ArticleModel = require('../../db_schema/schemas'),
    ServiceResponse = require('../../response/ServiceResponse'),
    ArticleResponse = require('../../response/ArticleResponse'),
    constants = require('../../constants');
exports.writeArticle = function writeArticle(req,res){
    var sr = new ServiceResponse();
    var title = req.body.title;
    var content = req.body.content;
    var articleClass_id = req.body.articleClass_id;
    var article;
    if(articleClass_id==1){
        article = new ArticleModel.Article({
            title:title,
            content:content
        });
    }else{
        article = new ArticleModel.Article({
            title:title,
            content:content,
            articleClass_id:articleClass_id
        });
    }
    article.save(function(err){
        if(err){
            sr.status = constants.saveError;
            res.send(sr);
            return sr;
        }
        sr.status = constants.SUCCESS;
        res.send(sr);
        return sr;
    });
};

exports.countArticleByClassID = function countArticleByClassID(req,res){
    var articleClass_id = req.query.articleClass_id;
    var ar = new ArticleResponse();
    if(articleClass_id==0){
        ArticleModel.Article.count(function(err,count){
            if(err){
                ar.status = constants.ARTICLENOTEXIST;
                res.send(ar);
                return ar;
            }
            ar.entity = count;
            ar.status = constants.SUCCESS;
            res.send(ar);
            return ar;
        });
    }else if(articleClass_id==1){
        ArticleModel.Article.count({articleClass_id:undefined},function(err,count){
            if(err){
                ar.status = constants.ARTICLENOTEXIST;
                res.send(ar);
                return ar;
            }
            ar.entity = count;
            ar.status = constants.SUCCESS;
            res.send(ar);
            return ar;
        });
    }else{
        ArticleModel.Article.count({articleClass_id:articleClass_id},function(err,count){
            if(err){
                ar.status = constants.ARTICLENOTEXIST;
                res.send(ar);
                return ar;
            }
            ar.entity = count;
            ar.status = constants.SUCCESS;
            res.send(ar);
            return ar;
        });
    }
};

exports.getArticleByClassID = function getArticleByClassID(req,res){
    var ar = new ArticleResponse();
    var articleClass_id = req.query.articleClass_id;
    if(articleClass_id==0){
        ArticleModel.Article.find(function(err,docs){
            if(err){
                ar.status = constants.ARTICLENOTEXIST;
                ar.entity = null;
                res.send(ar);
                return ar;
            }
            ar.status = constants.SUCCESS;
            ar.entity = docs;
            res.send(ar);
            return ar;
        });
    }else if(articleClass_id==1){
        ArticleModel.Article.find({articleClass_id:undefined},function(err,docs){
            if(err){
                ar.status = constants.ARTICLENOTEXIST;
                ar.entity = null;
                res.send(ar);
                return ar;
            }
            ar.status = constants.SUCCESS;
            ar.entity = docs;
            res.send(ar);
            return ar;
        });
    }else{
        ArticleModel.Article.find({articleClass_id:articleClass_id},function(err,docs){
            if(err){
                ar.status = constants.ARTICLENOTEXIST;
                ar.entity = null;
                res.send(ar);
                return ar;
            }
            ar.status = constants.SUCCESS;
            ar.entity = docs;
            res.send(ar);
            return ar;
        });
    }
};

exports.deleteArticleByID = function deleteArticleByID(req,res){
    var article_id = req.query.article_id;
    var sr = new ServiceResponse();
    ArticleModel.Article.findByIdAndRemove(article_id,function(err){
        if(err){
            sr.status = constants.ARTICLENOTEXIST;
            res.send(sr);
            return sr;
        }
        sr.status = constants.SUCCESS;
        res.send(sr);
        return sr;
    });
};

exports.changeArticleClass = function changeArticleClass(req,res){
    var article_id = req.query.article_id;
    var articleClass_id = req.query.articleClass_id;
    var sr = new ServiceResponse();
    ArticleModel.Article.findByIdAndUpdate(article_id,{$set:{articleClass_id:articleClass_id}},function(err){
        if(err){
            sr.status = constants.ARTICLENOTEXIST;
            res.send(sr);
            return sr;
        }
        sr.status = constants.SUCCESS;
        res.send(sr);
        return sr;
    });
};

exports.updateArticle = function updateArticle(req,res){
    var article_id = req.body.article_id;
    var title = req.body.title;
    var content = req.body.content;
    var articleClass_id = req.body.articleClass_id;
    var sr = new ServiceResponse();
    ArticleModel.Article.findByIdAndUpdate(article_id,{$set:{title:title,content:content,articleClass_id:articleClass_id}},function(err){
        if(err){
            sr.status = constants.ARTICLENOTEXIST;
            res.send(sr);
            return sr;
        }
        sr.status = constants.SUCCESS;
        res.send(sr);
        return sr;
    });
};

exports.getArticleByID = function getArticleByID(req,res){
    var article_id = req.query.article_id;
    var ar = new ArticleResponse();
    ArticleModel.Article.findById(article_id,function(err,doc){
        if(err){
            ar.entity = null;
            ar.status = constants.ARTICLENOTEXIST;
            res.send(ar);
            return ar;
        }
        ar.entity = doc;
        ar.status = constants.SUCCESS;
        res.send(ar);
        return ar;
    });
};