var crypto = require('crypto');
var marked = require('marked');
/**
 * Format the date as you want.
 *
 * @param {Date} date
 * @param {String} format
 * @return {String}
 */

exports.formatDate = function (date, format) {
  if('string' === typeof date){
    format = date;
    date = new Date();
  }
  var regExp = /[^yYmMdDhHsSwW\s:-]/i;
  if('' === format || regExp.test(format)) throw new Error("invalid formation.");
  var formatStr = format;
  var week = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
  formatStr = formatStr.replace(/yyyy|YYYY/, date.getFullYear().toString());
  formatStr = formatStr.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));
  formatStr = formatStr.replace(/MM/, (date.getMonth() + 1) > 9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1));
  formatStr = formatStr.replace(/M/g, (date.getMonth() + 1).toString());
  formatStr = formatStr.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
  formatStr = formatStr.replace(/d|D/g, date.getDate().toString());
  formatStr = formatStr.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
  formatStr = formatStr.replace(/h|H/g, date.getHours().toString());
  formatStr = formatStr.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
  formatStr = formatStr.replace(/m/g, date.getMinutes().toString());
  formatStr = formatStr.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
  formatStr = formatStr.replace(/s|S/g, date.getSeconds().toString());
  formatStr = formatStr.replace(/w|W/g, week[date.getDay()]);
  return formatStr;
};

exports.md5 = function(str){
  var md5Hash = crypto.createHash('md5');
  md5Hash.update(str);
  str = md5Hash.digest('hex');
  return str;
};

var renderer = new marked.Renderer();
renderer.code = function(code, lang) {
  var ret = '<pre class="prettyprint language-' + lang + '">';
  ret+= '<code>' + code + '</code>';
  ret+= '</pre>';
  return ret;
};
marked.setOptions({
  renderer: renderer,
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true
});

exports.markdown = marked;