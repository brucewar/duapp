var EventProxy = require('eventproxy');
var crypto = require('crypto');
var API = require('wechat-api');
var api = new API('wxabd6d9d1509c5f97', '3343c19f34fbfeb9358d4627ca097523');
var wechat = require('wechat');

exports.test = function(req, res){
	var users = [];
	api.getFollowers(function(err, ret){
		if(err){
			res.end(err);
		}
		var openids = ret.data.openid;
		var proxy = new EventProxy();
		proxy.after('get_user_info', openids.length, function(users){
			res.render('test/index', {layout: false, users: users});
		});
		for(var i=0, len=openids.length; i<len; i++){
			api.getUser(openids[i], proxy.group('get_user_info'));
		}
	});
};

exports.doGet = function(req, res){
	if(!checkSignature(req)){
		console.log('check error');
		res.end('error');
	}
	res.end(req.query.echostr);
};

function checkSignature(req){
	var signature = req.query.signature,
		timestamp = req.query.timestamp,
		nonce = req.query.nonce,
		shasum = crypto.createHash('sha1'),
		arr = ['brucewar', timestamp, nonce];

	shasum.update(arr.sort().join(''), 'utf-8');
	return shasum.digest('hex') == signature;
}


exports.doPost = function(req, res){
	var config = {
		token: 'brucewar',
		appid: 'wxabd6d9d1509c5f97'
	};
	wechat(config, function(req, res){
		var message = req.weixin;
		console.log(message);
		res.reply({
			content: "这是一条自动回复的消息!",
			type: 'text'
		});
	});
};

exports.sendAll = function(req, res){
	var openids = req.body.openids;
	api.massSendText('This is a message to all.', openids, function(err, result){
		if(err){
			res.json(err);
		}
		res.json(result);
	});
};
