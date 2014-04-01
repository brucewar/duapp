var ArticleClassModel = require('../../db_schema/schemas'),
    ServiceResponse = require('../../response/ServiceResponse'),
    ArticleClassResponse = require('../../response/ArticleClassResponse'),
    constants = require('../../constants');

exports.getAllClasses = function getAllClasses(req,res){
    var acr = new ArticleClassResponse();
    ArticleClassModel.ArticleClass.find(function(err,docs){
        if(docs.length==0){
            acr.status = constants.ARTICLECLASSNOTEXIST;
            res.send(acr);
            return acr;
        }
        acr.entity = docs;
        acr.status = constants.SUCCESS;
        res.send(acr);
        return acr;
    });
};

exports.addClasses = function addClasses(req,res){
    var classes=[{_id:req.body._id,name:req.body.name}];
    var sr = new ServiceResponse();
    classes.forEach(function(err,i){
        var c = new ArticleClassModel.ArticleClass({name:classes[i].name});
        c.save(function(err){
            if(err){
                sr.status = constants.saveError;
                res.send(sr);
                return sr;
            }
            sr.status = constants.SUCCESS;
            res.send(sr);
            return sr;
        });
    });
};

exports.updateClasses = function updateClasses(req,res){
    var classes=[{_id:req.body._id,name:req.body.name}];
    var sr = new ServiceResponse();
    classes.forEach(function(err,i){
        ArticleClassModel.ArticleClass.findByIdAndUpdate(classes[i]._id,{$set:{name:classes[i].name}},function(err){
            if(err){
                sr.status = constants.ARTICLECLASSNOTEXIST;
                res.send(sr);
                return sr;
            }
            sr.status = constants.SUCCESS;
            res.send(sr);
            return sr;
        });
    });
};

exports.removeClasses = function removeClasses(req,res){
    var classes=[{_id:req.body._id,name:req.body.name}];
    var sr = new ServiceResponse();
    classes.forEach(function(err,i){
        ArticleClassModel.ArticleClass.findByIdAndRemove(classes[i]._id,function(err){
            if(err){
                sr.status = constants.ARTICLECLASSNOTEXIST;
                res.send(sr);
                return sr;
            }
            sr.status = constants.SUCCESS;
            res.send(sr);
            return sr;
        });
    });
};

exports.getClassByID = function getClassByID(req,res){
    var articleClass_id = req.query.articleClass_id;
    var acr = new ArticleClassResponse();
    ArticleClassModel.ArticleClass.findById(articleClass_id,function(err,doc){
        if(err){
            acr.entity = null;
            acr.status = constants.ARTICLECLASSNOTEXIST;
            res.send(acr);
            return acr;
        }
        acr.entity = doc;
        acr.status = constants.SUCCESS;
        res.send(acr);
        return acr;
    });
};