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

$('#editor').keydown(function(event) {
  //阻止textarea中tab键切换焦点
  if (event.keyCode == 9) {
    event.preventDefault();
    insertAtCursor(this, '  ');
    this.returnValue = false;
  }else if(event.keyCode == 13){
    last_blanks = getCurrentLineBlanks(this);
  }
}).keyup(function(event){
  if(event.keyCode == 13){
    insertAtCursor(this, last_blanks);
  }
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
    stored_range.moveToElementText( ctrl );
    // Now move 'dummy' end point to end point of original range
    stored_range.setEndPoint( 'EndToEnd', range );
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
  var i = pos-1;
  while (i>=0) {
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