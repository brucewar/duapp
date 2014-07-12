var models = require('../models'),
	Blogroll = models.Blogroll;
var validator = require('validator');

exports.add = function(req, res) {
	var webmaster = validator.trim(req.body.webmaster);
	var domain = validator.trim(req.body.domain);

	var msg = '';
	if ('' == webmaster || '' == domain) {
		msg = '站长名或域名不能为空!';
		res.json({
			status: 'failed',
			msg: msg
		});
		return;
	}
	var newBlogroll = new Blogroll({
		webmaster: webmaster,
		domain: domain
	});

	newBlogroll.save(function(err) {
		if (err) {
			res.json({
				status: 'failed',
				msg: '添加失败!'
			});
			return err;
		}
		res.json({
			status: 'success',
			msg: '添加成功!'
		});
	});
};

exports.getAll = function(req, res) {
	Blogroll.find(function(err, blogrolls) {
		if (err) {
			return err;
		}
		res.render('blogroll/list', {
			blogrolls: blogrolls
		});
	});
};

exports.deleteById = function(req, res) {
	var blogrollId = req.query.blogroll_id;
	Blogroll.findByIdAndRemove(blogrollId, function(err) {
		if (err) {
			res.json({
				status: 'failed',
				msg: '删除失败!'
			});
			return err;
		}
		res.json({
			status: 'success',
			msg: '删除成功!'
		});
	});
};

exports.updateById = function(req, res) {
	var blogrollId = req.body.blogroll_id;
	var webmaster = validator.trim(req.body.webmaster);
	var domain = validator.trim(req.body.domain);

	var error = '';
	if ('' == webmaster || '' == domain) {
		error = '站长名或域名不能为空!';
		res.json({
			status: 'failed',
			msg: error
		});
		return;
	}

	var update = {
		webmaster: webmaster,
		domain: domain
	};

	Blogroll.findByIdAndUpdate(blogrollId, {$set: update}, function(err) {
		if (err) {
			res.json({
				status: 'failed',
				msg: '更新失败!'
			});
			return err;
		}
		res.json({
			status: 'success',
			msg: '更新成功!'
		});
	});
};