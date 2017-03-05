/**
 * Created by TanLiu on 2017/3/3.
 */
$(function(){
    initNavHtml();
});

function initNavHtml(){
    $.ajax({
        url:"http://127.0.0.1:8088/fruit-web/src/js/base.html",
        type:"post",
        dataType:'text',
        async:false,
        success: function(data){
            if(data!=null){
                $mynav=$(data)
                $("#Tnav").append($mynav)
            }


        },
        error:function(){alert("失败！");}

    });

    $.ajax({
        url:"http://127.0.0.1:8088/fruit-web/src/js/top_nav.html",
        type:"post",
        dataType:'text',
        async:false,
        success: function(data){
            if(data!=null){
                $mynav=$(data)
                $(".top_nav").append($mynav)
            }


        },
        error:function(){alert("失败！");}

    });




}