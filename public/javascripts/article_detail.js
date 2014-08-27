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
$('#btn_submit').click(function(event) {
  event.preventDefault();
  var realName = $('#real_name').val(),
    email = $('#email').val(),
    site = $('#site').val(),
    comment = $('#comment').val();
  var articleId = location.pathname.substr('/article/'.length);
  var commentId = '';
  var $parent = $('#create_comment').parent().parent().parent();
  if ($parent.hasClass('media')) {
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
  $.post('/comment/create', newComment, function(data) {
    if (data.status == 'failed') {
      var $alert = $('div.alert-danger');
      $alert.find('strong').text(data.message);
      $alert.removeClass('sr-only');
    } else {
      location.reload();
    }
  }, 'json');
});
var $commentList = $('#comment_list');
$commentList.find('div.reply').click(function() {
  var $reply = $('#create_comment');
  $(this).parent().siblings('.comment').append($reply);
  $('#cancel_reply').removeClass('sr-only');
});
$commentList.find('div.delete').click(function() {
  if (confirm('确定删除此条评论及其子评论吗?')) {
    var $parentComment = $(this).parent().parent().parent();
    var commentIds = [];
    commentIds.push($parentComment.attr('id'));
    $parentComment.find('div.media').each(function() {
      commentIds.push($(this).attr('id'));
    });
    $.post('/comment/delete', {
      comment_ids: commentIds
    }, function(data) {
      data.status == 'failed' ? alert('删除失败!') : alert('删除成功!');
      location.reload();
    }, 'json');
  }
});
$('#cancel_reply').click(function() {
  var $reply = $('#create_comment');
  $('#cancel_reply').addClass('sr-only');
  $('#comment_list').parent().parent().append($reply);
});

$(document).ready(function() {
  prettyPrint();
});

/*------selection operations-------*/
function insertAtCursor(obj, txt) {
  obj.focus();
  //IE support
  if (document.selection) {
    sel = document.selection.createRange();
    sel.text = txt;
  }
  //MOZILLA/NETSCAPE support
  else {
    var startPos = obj.selectionStart;
    var scrollTop = obj.scrollTop;
    var endPos = obj.selectionEnd;
    obj.value = obj.value.substring(0, startPos) + txt + obj.value.substring(endPos, obj.value.length);
    startPos += txt.length;
    obj.setSelectionRange(startPos, startPos);
    obj.scrollTop = scrollTop;
  }
}

function getCaretPos(ctrl) {
  var caretPos = 0;
  if (document.selection) {
    // IE Support
    var range = document.selection.createRange();
    // We'll use this as a 'dummy'
    var stored_range = range.duplicate();
    // Select all text
    stored_range.moveToElementText(ctrl);
    // Now move 'dummy' end point to end point of original range
    stored_range.setEndPoint('EndToEnd', range);
    // Now we can calculate start and end points
    ctrl.selectionStart = stored_range.text.length - range.text.length;
    ctrl.selectionEnd = ctrl.selectionStart + range.text.length;
    caretPos = ctrl.selectionStart;
  } else if (ctrl.selectionStart || ctrl.selectionStart == '0')
  // Firefox support
    caretPos = ctrl.selectionStart;
  return (caretPos);
}

function getCurrentLineBlanks(obj) {
  var pos = getCaretPos(obj);
  var str = obj.value;
  var i = pos - 1;
  while (i >= 0) {
    if (str.charAt(i) == '\n')
      break;
    i--;
  }
  i++;
  var blanks = "";
  while (i < str.length) {
    var c = str.charAt(i);
    if (c == ' ' || c == '\t')
      blanks += c;
    else
      break;
    i++;
  }
  return blanks;
}

$('#comment').keydown(function(event) {
  //阻止textarea中tab键切换焦点
  if (event.keyCode == 9) {
    event.preventDefault();
    insertAtCursor(this, '  ');
    this.returnValue = false;
  } else if (event.keyCode == 13) {
    last_blanks = getCurrentLineBlanks(this);
  }
}).keyup(function(event) {
  if (event.keyCode == 13) {
    insertAtCursor(this, last_blanks);
  }
});