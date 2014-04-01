$(document).ready(function(){
    var url = window.location.href;
    var articleID = url.substring(url.indexOf('=')+1);
    getAllArticleClass();
    showArticle(articleID);
    $('button#saveChange').click(function(){
        var title = $('#title').val();
        var content = $('#editor').html();
        var articleClassID = $('select#className').val();
        $.ajax({
            type:'POST',
            url:'/article/updateArticle',
            contentType:'application/x-www-form-urlencoded',
            dataType:'json',
            data:{'article_id':articleID,'title':title,'content':content,'articleClass_id':articleClassID},
            success:function(){
                alert("博文修改成功！");
            },
            error:function(){
                alert("博文修改失败！");
            }
        });
    });
});

function showArticle(article_id){
    $.ajax({
        type:'GET',
        url:'/article/getArticleByID',
        dataType:'json',
        data:{article_id:article_id},
        success:function(articleResponse){
            var article = articleResponse.entity;
            $('#title').val(article.title);
            $('#editor').html(article.content);
            $('select#className').val(article.articleClass_id);
        }
    });
}

function getAllArticleClass(){
    $.ajax({
        type:'GET',
        url:'/articleclass/getAllClasses',
        dataType:'json',
        success:function(articleClassResponse){
            articleClassResponse.entity.forEach(function(articleClass){
                var option = "<option value='"+ articleClass._id +"'>" + articleClass.name + "</option>";
                $("select#className").append(option);
            });
        }
    });
}