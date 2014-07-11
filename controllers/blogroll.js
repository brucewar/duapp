var models = require('../models'),
	Blogroll = models.Blogroll;
var validator = require('validator');

exports.add = function(req, res) {
	var name = validator.trim(req.body.name);
	var domain = validator.trim(req.body.domain);

	var error = '';
	if ('' == name || '' == domain) {
		error = '站长名或域名不能为空!';
		res.render('blogroll/index', {
			name: name,
			domain: domain,
			error: error
		});
		return;
	}
	var newBlogroll = new Blogroll({
		name: name,
		domain: domain
	});

	newBlogroll.save(function(err) {
		if (err) {
			return err;
		}
		res.render('blogroll/index', {
			success: '添加成功!'
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
	var id = req.body.id;
	Blogroll.findByIdAndRemove(function(err) {
			if (err) {
				res.json({
					status: 'failed'
				});
				return err;
			}
			res.json({
					status: 'success');
			});
	};

	exports.updateById = function(req, res) {
		var name = validator.trim(req.body.name);
		var domain = validator.trim(req.body.domain);

		var error = '';
		if ('' == name || '' == domain) {
			error = '站长名或域名不能为空!';
			res.json({
				status: 'failed',
				msg: error
			});
			return;
		}

		Blogroll.findByIdAndUpdate(function(err) {
			if (err) {
				res.json({
					status: 'failed'
				});
				return err;
			}
			res.json({
				status: 'success'
			});
		});
	};