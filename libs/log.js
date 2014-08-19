var fs = require('fs'),
	utils = require('./utils'),
  Log = require('log'),
  config = require('../config').config;

var stream = fs.createWriteStream('./logs/' + utils.formatDate('YYYYMMDD') + '.log', {
	flags: 'a'
});
var log = new Log(config.log_level, stream);

module.exports = log;