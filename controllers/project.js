var Project = require('../models').Project;

var validator = require('validator');

exports.showCreate = function(req, res){
  res.render('project/edit');
};

exports.create = function(req, res){
  var projectName = validator.trim(req.body.proj_name);
  var description = req.body.description;
  var detail = req.body.detail;

  var error = '' == projectName || '' == description ? '项目名称或者描述不能为空!' :
    projectName.length < 5 || projectName.length > 20 ? '项目名称字数太多或太少!' :
    description.length >= 5 && description.length <= 100 ? '' :
    '项目描述字数太多或太少!';

  if(error){
    res.render('project/edit', {projectName: projectName, description: description, detail: detail, error: error});
  }else{
    var project = new Project({
      name: projectName,
      description: description,
      detail: detail
    });
    project.save(function (err, project) {
      if (err) {
        return err;
      }
      res.redirect('/project/' + project._id + '/edit');
    });
  }
};

exports.showEdit = function(req, res){
  var projectId = req.params.pid;

  Project.findById(projectId, function(err, project){
    if(err){
      return err;
    }
    res.render('project/edit', {
      projectId: project._id,
      projectName: project.name,
      description: project.description,
      detail: project.detail
    });
  });
};

exports.update = function(req, res){
  var projectId = req.params.pid;
  var projectName = validator.trim(req.body.proj_name);
  var description = req.body.description;
  var detail = req.body.detail;

  var error = '' == projectName || '' == description ? '项目名称或者描述不能为空!' :
      projectName.length < 5 || projectName.length > 20 ? '项目名称字数太多或太少!' :
      description.length >= 5 && description.length <= 100 ? '' :
    '项目描述字数太多或太少!';

  if(error){
    res.render('project/edit', {
      projectId: projectId,
      projectName: projectName,
      description: description,
      detail: detail,
      error: error
    });
  }else{
    var update = {
      name: projectName,
      description: description,
      detail: detail
    };
    Project.findByIdAndUpdate(projectId, {$set: update}, function(err){
      if(err){
        return err;
      }
      res.redirect('/project/' + projectId + '/edit');
    });
  }
};

exports.getProjectByID = function(req, res){
  var projectId = req.params.pid;

  Project.findById(projectId, function(err, project){
    if(err){
      return err;
    }
    res.render('project/index', {project: project, userName: req.session.userName});
  });
};