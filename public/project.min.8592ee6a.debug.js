// configure marked
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

$(document).ready(function(){
  var $detail = $('#project').find('div.inner');
  var detail = $detail.html();
  detail = detail.replace(/^\s+|\s+$/g, '');
  var html = marked(detail);
  $detail.html(html);
  prettyPrint();
});
