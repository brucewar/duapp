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
