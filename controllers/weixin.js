var crypto = require('crypto');

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