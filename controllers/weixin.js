var crypto = require('crypto');
var API = require('wechat-api');
var api = new API('wxabd6d9d1509c5f97', '3343c19f34fbfeb9358d4627ca097523');

exports.test = function(req, res){
	res.render('test/index', {layout: false});
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
	api.getFollowers(function(err, result){
		if(err){
			res.json(err);
		}
		res.json(result);
	});
};