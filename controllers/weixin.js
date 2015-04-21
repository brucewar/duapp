var EventProxy = require('eventproxy');
var crypto = require('crypto');
var API = require('wechat-api');
var api = new API('wxabd6d9d1509c5f97', '3343c19f34fbfeb9358d4627ca097523');
var wechat = require('wechat');
var urllib = require('urllib');

var api_config = {
	appid: 'wxabd6d9d1509c5f97',
	appsecret: '3343c19f34fbfeb9358d4627ca097523',
	prefix: 'https://api.weixin.qq.com/cgi-bin/'
};

var AccessToken = function (accessToken, expireTime) {
  if (!(this instanceof AccessToken)) {
    return new AccessToken(accessToken, expireTime);
  }
  this.accessToken = accessToken;
  this.expireTime = expireTime;
};

/*!
 * 检查AccessToken是否有效，检查规则为当前时间和过期时间进行对比
 *
 * Examples:
 * ```
 * token.isValid();
 * ```
 */
AccessToken.prototype.isValid = function () {
  return !!this.accessToken && (new Date().getTime()) < this.expireTime;
};

exports.test = function(req, res){
	if(checkSignature(req)){
		exports.getAccessToken(function(err, token){
			if(err){
				res.end(err);
			}
			var url = "https://api.weixin.qq.com/cgi-bin/user/get?access_token=" + token.accessToken;
			urllib.request(url, {dataType: 'json'}, function(err, data, res){
				if(err){
					throw err;
				}
				var openids = data.data.openid;
				var proxy = new EventProxy();
				proxy.after('get_user_info', openids.length, function(users){
					res.render('test/index', {layout: false, users: users});
				});
				for(var i=0, len=openids.length; i<len; i++){
					var getUserUrl = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=" + token.accessToken + "&openid= " + openids[i] + "&lang=zh_CN";
					urllib.request(getUserUrl, {dataType: 'json', proxy.group('get_user_info')});
				}
			});
		});
	}
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

function getAccessToken(callback){
	var url = api_config.prefix + 'token?grant_type=client_credential&appid=' + api_config.appid + '&secret=' + api_config.appsecret;

	urllib.request(url, {dataType: 'json'}, function(err, data, res){
		if(err){
			callback(err);
		}
		var expireTime = (new Date().getTime()) + (data.expires_in - 10) * 1000;
    var token = AccessToken(data.access_token, expireTime);
    callback(null, token);
	});
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
