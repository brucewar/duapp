$(document).ready(function(){
  var $articleList = $('#article_list'),
    $changeClassDialog = $('#change_class'),
    $deleteClassDialog = $('#delete_dialog');

  var classId = '',
    articleId = '';

  $articleList.find('button.change').click(function(){
    classId = $(this).val();
    var val = $(this).siblings('a').attr('href');
    //'/article/:aid/edit'
    articleId = val.substr(9, 24);
    var $classSelect = $('#class_id');
    classId != 'undefined' ? $classSelect.val(classId) : $classSelect.val(0);
    $changeClassDialog.modal();
  });

  $articleList.find('button.delete').click(function(){
    var val = $(this).siblings('a').attr('href');
    //'/article/:aid/edit'
    articleId = val.substr(9, 24);
    $deleteClassDialog.modal();
  });

  $('#save_class').click(function(){
    $changeClassDialog.modal('hide');
    var newClassId = $('#class_id').val();
    if(newClassId !== classId){
      $.post('/article/change', {article_id: articleId, class_id: newClassId}, function(data){
        data.status == 'success' ? alert('分类修改成功!') : alert('分类修改失败!');
        location.href = '/content';
      }, 'json');
    }
  });

  $('#delete_article').click(function(){
    $deleteClassDialog.modal('hide');
    $.post('/article/delete', {article_id: articleId}, function(data){
      data.status == 'success' ? alert('博文删除成功!') : alert('博文删除失败失败!');
      location.href = '/content';
    }, 'json');
  });
});