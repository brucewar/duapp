$(document).ready(function(){
    getClasses();
    $("button#write").click(function(){
        var title = $.trim($('#title').val());
        var content = $('#editor').html();
        var articleClass_id = $('select#className').val();
        if(title==null||title==""){
            alert("请输入博文标题！");
        }else{
            writeArticle(title,content,articleClass_id);
        }
    });
});

function getClasses(){
    $.ajax({
        type:'GET',
        url:'/articleclass/getAllClasses',
        contentType:'json',
        success:function(articleClassResponse){
            articleClassResponse.entity.forEach(function(articleClass){
                var option = "<option value='"+ articleClass._id +"'>" + articleClass.name + "</option>";
                $("select#className").append(option);
            });
        }
    });
}
//{'title':title,'content':content,'articleClass_id':articleClass_id}
//"title="+title+"&content="+content+"&articleClass_id="+articleClass_id
function writeArticle(title,content,articleClass_id){
    $.ajax({
        type:'POST',
        url:'/article/writeArticle',
        contentType:'application/x-www-form-urlencoded',
        dataType:'json',
        data:{'title':title,'content':content,'articleClass_id':articleClass_id},
        success:function(){
            alert("博文发表成功！");
            $('#title').val("");
            $('#editor').html('');
            $('select#className').val(1);
        },
        error:function(){
            alert("博文发表失败！");
        }
    });
}