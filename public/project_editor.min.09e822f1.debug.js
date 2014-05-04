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
$('#btn_preview').click(function(event) {
  event.preventDefault();
  var $editor = $('#editor');
  $editor.addClass('sr-only');
  $(this).addClass('sr-only');
  $('#btn_modify').removeClass('sr-only');
  var content = $editor.val();
  var html = marked(content);
  $('.preview').html(html);
  prettyPrint();
});
$('#btn_modify').click(function() {
  event.preventDefault();
  var $editor = $('#editor');
  $editor.removeClass('sr-only').focus();
  $('.preview').html('');
  $(this).addClass('sr-only');
  $('#btn_preview').removeClass('sr-only');
});

