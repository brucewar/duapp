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
  var $comment = $('#comment');
  $comment.addClass('sr-only');
  $(this).addClass('sr-only');
  $('#btn_modify').removeClass('sr-only');
  var comment = $comment.val();
  var html = marked(comment);
  $('.preview').html(html);
  prettyPrint();
});
$('#btn_modify').click(function() {
  event.preventDefault();
  var $comment = $('#comment');
  $comment.removeClass('sr-only').focus();
  $('.preview').html('');
  $(this).addClass('sr-only');
  $('#btn_preview').removeClass('sr-only');
});
$('#btn_submit').click(function(event){
  event.preventDefault();
  var realName = $('#real_name').val(),
    email = $('#email').val(),
    site = $('#site').val(),
    comment = $('#comment').val();
  var articleId = location.pathname.substr('/article/'.length);
  var commentId = '';
  var $parent = $('#create_comment').parent().parent().parent();
  if($parent.hasClass('media')){
    commentId = $parent.attr('id') || '';
  }
  var newComment = {
    real_name: realName,
    email: email,
    site: site,
    comment: comment,
    article_id: articleId,
    comment_id: commentId
  };
  $.post('/comment/create', newComment, function(data){
    if(data.status == 'failed'){
      var $alert = $('div.alert-danger');
      $alert.find('strong').text(data.message);
      $alert.removeClass('sr-only');
    }else{
      location.reload();
    }
  }, 'json');
});
var $commentList = $('#comment_list');
$commentList.find('div.reply').click(function(){
  var $reply = $('#create_comment');
  $(this).parent().siblings('.comment').append($reply);
  $('#cancel_reply').removeClass('sr-only');
});
$commentList.find('div.delete').click(function(){
  if(confirm('确定删除此条评论及其子评论吗?')){
    var $parentComment = $(this).parent().parent().parent();
    var commentIds = [];
    commentIds.push($parentComment.attr('id'));
    $parentComment.find('div.media').each(function(){
      commentIds.push($(this).attr('id'));
    });
    $.post('/comment/delete', {comment_ids: commentIds}, function(data){
      data.status == 'failed' ? alert('删除失败!') : alert('删除成功!');
      location.reload();
    }, 'json');
  }
});
$('#cancel_reply').click(function(){
  var $reply = $('#create_comment');
  $('#cancel_reply').addClass('sr-only');
  $('#comment_list').parent().parent().append($reply);
});

$(document).ready(function(){
  $('div.comment').each(function(){
    var comment = $(this).html();
    $(this).html(marked(comment));
  });
  prettyPrint();
});