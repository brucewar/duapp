$(document).ready(function(){
    editClass($);
    //manage article class
    $("#manage").click(function(){
        var $doc;
        if(window.location!=window.parent.location){
            $doc = window.parent.jQuery.noConflict();
        }else{
            $doc = jQuery.noConflict();
        }
        $doc("body").append($("#manageClass"));
        $doc("body").append($("#deleteClass"));
        $doc("body").append($("#confirmSave"));
        $doc("#manageClass").modal({
            keyboard:true
        });
        $doc("#manageClass").on("show",function(){
            $doc("div.form-inline p").hide();
            $doc("#className").val("");
        });
        $doc("#className").attr("maxlength",28).keydown(function(event){
            var keyCode=event.keyCode;
            if(keyCode==32){
                return false;
            }else{
                return true;
            }
        });
        closeMagageClass($doc);

        deleteClass($doc);
        $doc("#addClass").click(function(){
            if($doc("#className").val()==""){
                $doc("div.form-inline p:last").hide();
                $doc("div.form-inline p:first").show();
            }else{
                var flag = true;
                $doc("ul#classes li span:nth-of-type(1)").each(function(){
                    if($doc(this).text()==$doc("#className").val()&& !$(this).parents('li').is(':hidden')){
                        $doc("div.form-inline p:last").show();
                        $doc("div.form-inline p:first").hide();
                        flag = false;
                    }
                });
                if(flag){
                    $doc("#classes").append(
                        "<li class='divider'></li>" +
                        "<li>" +
                            "<span>" + $doc("#className").val() + "</span>" +
                            "<span class='pull-right'>" +
                                "<a class='btn-link'>[编辑]</a>" +
                                "<a class='btn-link'>[删除]</a>" +
                            "</span>" +
                        "</li>"
                    );
                    $doc("#className").val("");
                    $doc("div.form-inline p").hide();
                }
            }
        });
        $doc("#saveClassesChange").click(function(){
            saveClassesChange($doc);
        });
    });
    $("#write").click(function(){
        var $doc;
        if(window.location!=window.parent.location){
            $doc = window.parent.jQuery.noConflict();
        }else{
            $doc = jQuery.noConflict();
        }
        $doc("iframe").attr("src","/writearticle");
    });
    $.ajax({
        type:"GET",
        url:"/articleclass/getAllClasses",
        dataType:"json",
        success:function(articleClassResponse){
            var classList = articleClassResponse.entity;
            classList.forEach(function(cla){
                //articleclass in articlecontent page
                var $newli = $("<li><a href='#' id='" + cla._id + "'>" + cla.name +
                    "<span class='badge badge-info'></span></a>" +
                    "</li>");
                $("div#articleClass ul").append($newli);
                $newli.remove();
                //manage class dialog
                $newli = $(
                    "<li class='divider'></li>" +
                    "<li>" +
                        "<span id='" + cla._id + "' value='"+ cla.name +"'>" + cla.name + "</span>" +
                        "<span class='pull-right'>" +
                            "<a class='btn-link'>[编辑]</a>" +
                            "<a class='btn-link'>[删除]</a>" +
                        "</span>" +
                    "</li>");
                $("ul#classes").append($newli);
                //changeclass dialog
                $newli = $("<option value='"+ cla._id +"'>"+ cla.name +"</option>");
                $("select#chooseClass").append($newli);
            });
            countArticleByClassID();
            showContentByClassId();
            $("ul#classInfo li:eq(1) a:eq(0)").click();
        }
    });
});

function deleteClass($doc){
    $doc("ul#classes").delegate('li span.pull-right a:nth-of-type(2)','click',function(){
        var $a = $(this);
        $doc("#deleteClass").css({
            'z-index':1070,
            'top':'30%',
            'width':'400px',
            'margin':'0 0 0 -200px'
        }).modal({
                keyboard:true
        });
        $doc("#deleteClass").on('shown',function(){
            $doc("body div:last-child").prev("div").css({'z-index':1060});
        }).on('hidden',function(){
            $doc("body div:last-child").css('z-index',1040);
        });
        $doc("div#deleteClass div.modal-footer button:eq(0)").click(function(){
            $doc("#deleteClass").modal('hide');
            if($a.parents('span').prev('li span:eq(0)').attr('id')==undefined){
                $a.parents('li').prev("li.divider").remove();
                $a.parents('li').remove();
            }else{
                $a.parents('li').prev("li.divider").hide();
                $a.parents('li').hide();
            }
        });
    });
}

function editClass($doc){
    $doc("ul#classes").delegate('li span.pull-right a:nth-of-type(1)','click',function(){
        var $li = $(this).parents('li');
        $li.hide();
        var $editli = $("<li><input class='span2' type='text' /><button class='btn'>确定</button><button class='btn'>取消</button>" +
            "<p class='help-block' style='color: #b94a48;display: none'>分类名称不能为空</p><p class='help-block' style='color: #b94a48;display: none'>您已经添加过此分类</p></li>");
        $editli.children('input').val($li.children('span:eq(0)').text());
        $editli.children('button:eq(0)').click(function(){
            var newclassname = $(this).prev('input').val();
            if(newclassname==""){
                $editli.children('p:eq(1)').hide();
                $editli.children('p:eq(0)').show();
            }else{
                var flag = true;
                var liindex = $doc("ul#classes li span:nth-of-type(1)").index($li.children('span:eq(0)'));
                $doc("ul#classes li span:nth-of-type(1)").each(function(i){
                    if($(this).text()==newclassname && i!=liindex && !$(this).parents('li').is(':hidden')){
                        $editli.children('p:eq(1)').show();
                        $editli.children('p:eq(0)').hide();
                        flag = false;
                    }
                });
                if(flag){
                    $li.children('span:eq(0)').text(newclassname);
                    $editli.remove();
                    $li.show();
                }
            }
        });
        $editli.children('button:eq(1)').click(function(){
            $editli.remove();
            $li.show();
        });
        $editli.children("input").attr("maxlength",28).keydown(function(event){
            var keyCode=event.keyCode;
            if(keyCode==32){
                return false;
            }else{
                return true;
            }
        });
        $editli.insertAfter($li);
    });
}

function closeMagageClass($doc){
    $doc('div#confirmSave div.modal-footer button:eq(0)').click(function(){
        $doc("div#manageClass").modal({keyboard:true});
        saveClassesChange($doc);
        $('div#confirmSave').modal('hide');
    });
    $doc('div#confirmSave div.modal-footer button:eq(1)').click(function(){
        $doc("div#confirmSave").modal('hide');
    });
    $doc("div#manageClass div.modal-header a").click(function(){
        $doc("div#manageClass").modal('hide');
        $doc("div#confirmSave").modal({keyboard:true});
    });
    $doc("div#confirmSave div.modal-header a").click(function(){
        $doc("div#manageClass").modal({keyboard:true});
        $doc("div#confirmSave").modal('hide');
    });
}

function saveClassesChange($doc){
    var flag = false;
    $doc("ul#classes li span:nth-of-type(1)").each(function(i){
        var id = $(this).attr('id');
        var classname = $(this).text();
        if(id==undefined){
            $.ajax({
                type:'POST',
                url:'/articleclass/addClasses',
                dataType:'json',
                data:{_id:id,'name':classname}
            });
        }
        if($(this).parents('li').is(':hidden')){
            $.ajax({
                type:'POST',
                url:'/articleclass/removeClasses',
                dataType:'json',
                data:{_id:id,'name':classname}
            });
        }
        if(classname!=$(this).attr('value')){
            $.ajax({
                type:'POST',
                url:'/articleclass/updateClasses',
                dataType:'json',
                data:{_id:id,'name':classname}
            });
        }
        if(i==$doc("ul#classes li span:nth-of-type(1)").length-1){
            flag=true;
        }
        /*if(){
         $doc('#manageClass').modal('hide');
         $doc("iframe").attr("src","/articlecontent");
         }*/
    });
    if(flag){
        $doc('#manageClass').modal('hide');
        window.parent.location.reload();
    }
}

function countArticleByClassID(){
    $("ul#classInfo li:gt(0)").each(function(i){
        var articleClass_id = $(this).children("a").attr('id');
        var articlecount;
        $.ajax({
            type:'GET',
            async:false,
            dataType:'json',
            url:'/article/countArticleByClassID',
            data:{articleClass_id:articleClass_id},
            success:function(article){
                articlecount = article.entity;
            }
        });
        $(this).children('a').children('span').text(articlecount);
    });
}

function showContentByClassId(){
    $("ul#classInfo li:gt(0) a:nth-of-type(1)").each(function(){
        $(this).click(function(){
            $("ul#classInfo li").removeClass('active');
            $(this).parent('li').addClass('active');
            var id = $(this).attr('id');
            var className = $(this).html();
            $.ajax({
                type:'GET',
                url:'/article/getArticleByClassID',
                dataType:'json',
                data:{articleClass_id:id},
                success:function(articleResponse){
                    $("ul#articleContent li:gt(1)").remove();
                    $("ul#articleContent li:eq(0) span:eq(0)").html(className);
                    var content = "";
                    for(var i=0;i<articleResponse.entity.length;i++){
                        content+="<li>" +
                            "<div class='container-fluid'>" +
                                "<a class='span6' target='_blank' href='/articledetail?article_id="+articleResponse.entity[i]._id+"'id='"+ articleResponse.entity[i]._id +"'>"+articleResponse.entity[i].title+"</a>" +
                                "<div class='pull-right'><span class='time'>"+new Date(articleResponse.entity[i].time).Format("yyyy-MM-dd hh:mm")+"</span>" +
                                    "<div class='btn-group'>" +
                                        "<a class='btn-mini' target='_blank' href='/editarticle?article_id="+articleResponse.entity[i]._id+"'>"+"[编辑]</a>" +
                                        "<a class='btn-small dropdown-toggle' data-toggle='dropdown' href='#'>更多<span class='caret'></span></a>" +
                                        "<ul class='dropdown-menu'><li><a>修改分类</a></li><li><a>删除</a></li></ul>" +
                                    "</div>" +
                                "</div>" +
                            "</div></li>" +
                            "<li class='divider'></li>";
                    }
                    $("ul#articleContent").append(content);
                    deleteArticle();
                    changeArticleClass();
                    editArticle();
                }
            });
            return false;
        });
    });
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};

function deleteArticle(){
    //delete article
    $('ul.dropdown-menu').delegate('li:nth-of-type(2)','click',function(){
        var $doc;
        if(window.location!=window.parent.location){
            $doc = window.parent.jQuery.noConflict();
        }else{
            $doc = jQuery.noConflict();
        }
        $doc("body").append($("#delete"));
        $doc("#delete").css({"top":"30%"}).modal({
            keyboard:true
        });
        var articleID = $(this).parent('ul').parent('div').parent('div').parent('div.container-fluid').children('a').attr('id');
        $doc("div#delete div.modal-footer button:eq(0)").click(function(){
            $.ajax({
                type:'GET',
                url:'/article/deleteArticleByID',
                dataType:'json',
                data:{article_id:articleID},
                success:function(){
                    window.parent.location.reload();
                }
            });
        });
    });
}

function changeArticleClass(){
    //change article class
    $("ul.dropdown-menu").delegate('li:nth-of-type(1)','click',function(){
        var $doc;
        if(window.location!=window.parent.location){
            $doc = window.parent.jQuery.noConflict();
        }else{
            $doc = jQuery.noConflict();
        }
        $doc("body").append($("#changeClass"));
        $doc("#changeClass").css({"top":"30%"}).modal({
            keyboard:true
        });
        var articleID = $(this).parent('ul').parent('div').parent('div').parent('div.container-fluid').children('a').attr('id');
        $doc("div#changeClass div.modal-footer button:eq(0)").click(function(){
            var articleClassID = $doc('select#chooseClass').val();
            $.ajax({
                type:'GET',
                url:'/article/changeArticleClass',
                dataType:'json',
                data:{article_id:articleID,articleClass_id:articleClassID},
                success:function(){
                    window.parent.location.reload();
                }
            });
        });
    });
}

function editArticle(){
    //edit article
//    $("div.btn-group").delegate('a.btn-mini','click',function(){
//        var article_id = $(this).parent()
//        $(this).attr({'href':'/editarticle?article_id='+111,'target':'_blank'});
//    });
}