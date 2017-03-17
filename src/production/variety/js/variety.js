/**
 * Created by TanLiu on 2017/3/3.
 */







$(function(){
    $("#variety_list").DataTable({
        dom: "Blrtip",
        "lengthChange":true,
        "processing" : true,
        "bServerSide" : true,
        "bStateSave" : false,
        "iDisplayLength" : 2,
        "iDisplayStart" : 0,
        "ordering": false,//全局禁用排序
        "paging": true,//开启表格分页
        ajax: function (data, callback, settings) {
            //封装请求参数
            var param = {};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.start = (data.start / data.length)+1;//当前页码
            var mydraw=data.draw;
            //console.log(param);
            //ajax请求数据
            $.ajax({
                type: "GET",
                url: "http://127.0.0.1:8080/variety/showVarieties",
                cache: false, //禁用缓存
                data: param, //传入组装的参数
                dataType: "json",
                success: function (result) {
                    var returnData = {};
                    returnData.draw = mydraw;//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.total;
                    returnData.recordsFiltered = result.total;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data =result.data;
                    callback(returnData);
                }
            });
        },
        buttons: [
            {
                text:"增加",
                className:"btn btn-default",
                action: function ( e, dt, node, config ) {
                    opneModel({url:"add.html",onOK:save});
                    $('#myModal').on('shown.bs.modal', function () {
                        init_validator ();
                        $("#add_pic").click(function(){
                            $("#uploadDiv").append(" <input id=\"file\" class=\"form-control col-md-7 col-xs-12\" name=\"file\"  type=\"file\">");
                        });
                    });

                }
            },
            {
                text:"修改",
                className:"btn btn-default",
                action: function ( e, dt, node, config ) {
                    alert("修改");

                }
            },
            {
                text:"批量删除",
                className:"btn btn-default",
                action: function ( e, dt, node, config ) {
                    alert("批量删除");

                }
            },

        ],
        columns: [
            { data: 'name'},
            { data: 'year' },
            { data: 'number' },
            { data: 'expirationdate' },

            { data: 'grade' },
            { data: 'size' },
            { data: 'storage' },
            { data: 'information' },
            { data: 'createTime' },
            { "render" : function(data, type, full, meta) {

               operation="<a href='javascript:deleteVariety("+full.id+");'><span title='删除' class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>" +
                "                    <a href='javascript:revise("+full.id+");'><span title='修改' class='glyphicon glyphicon-pencil' aria-hidden='true'></span></a>" +
                "                    <a href='javascript:showImages("+full.id+","+full.pictures+");'><span title='查看图片' class='glyphicon glyphicon-picture' aria-hidden='true'></span></a>"
            
            
            
                      return operation;
            },
                "sWidth" : "8%",},

        ],
        "oLanguage" : { // 国际化配置
            "sProcessing" : "正在获取数据，请稍后...",
            "sLengthMenu" : "显示 _MENU_ 条",
            "sZeroRecords" : "没有找到数据",
            "sInfo" : "从 _START_ 到  _END_ 条记录 总记录数为 _TOTAL_ 条",
            "sInfoEmpty" : "记录数为0",
            "sInfoFiltered" : "(全部记录数 _MAX_ 条)",
            "sInfoPostFix" : "",
            "sSearch" : "搜索",
            "sUrl" : "",
            "oPaginate" : {
                "sFirst" : "第一页",
                "sPrevious" : "上一页",
                "sNext" : "下一页",
                "sLast" : "最后一页"
            }
        },
        responsive: true
    });

})


function creatTopPlugin(){
    $("#topPlugin").text("tanliu");
    //创建增加
    //修改
    //批量删除
}

function deleteitem(){

}



function save(){

    var options={
        url:"http://127.0.0.1:8080/variety/add",
        type:"POST",
        dataType:"json",
        success: function(data){
            var status=data.status;
            if(status==200){
                alert("保存成功");
            }
        },
        error:function(){alert("保存失败！");}

    };

    $("#addform").ajaxSubmit(options);
}


function add(){


}

function search(){

}
function editor(){

}
function opneModel(options){
    $.ajax({
        url:options.url,
        type:"GET",
        async:false,
        success:function(data){
            MyDialog({
                title:"添加品种信息",
                content: data,
                onOK:options.onOK
            });
        },
        error:function () {
            MyDialog({
                content:"打开失败",
            });
        }
    });




}




function deleteVariety(id) {

    var meg = "确定删除该品种吗？";
    MyDialog({
        title:"提示信息",
        content:"是否确认删除？",
        onOK:function(){
            alert("删除成功"+id)
        }
    })



}



function revise(id){
    $.ajax({
        type: "post",
        url: "http://127.0.0.1:8080/variety/getVarietyDetail",
        data: {"id":id},
        dataType: "json",
        async:false,
        success: function(data){

               opneModel({url:"edit.html"});
               $('#myModal').on('shown.bs.modal', function () {
                        init_validator ();
                        $("#add_pic").click(function(){
                            $("#uploadDiv").append(" <input id=\"file\" class=\"form-control col-md-7 col-xs-12\" name=\"file\"  type=\"file\">");
                        });
                    });
               addData({
                   id:"editform",
                   ignore:["pictures"]
               },data);

        },
        error : function (XMLHttpRequest, textStatus, errorThrown){
            alert("error");
        }
    });
}

function addData(options,data) {
    for(var o in data){
        if ($.inArray(o, options.ignore)!=-1){
            continue;
        }
        selector="#"+options.id+" input[name=\'"+o+"\']";
        $(selector).val(data[o]);
    }
}

function showImages(id,pictures){

    $.ajax({
        type: "post",
        url: "/logistics/getDetailPage",
        dataType: "html",
        success: function(data){
            $("<div id='window_add'></div>").appendTo("body");
            $("#window_add").html($("#showImages").html());
            var win = $("#window_add").kendoWindow({
                height: 'auto',
                title: "查看图片",
                visible: false,
                width: 800,
                modal: true,
                resizable: false,
                scrollable: false,
                close: function(){
                    $("#window_add").data("kendoWindow").destroy();
                }
            }).data("kendoWindow");
            win.center();
            win.open();
            var pics = pictures.split(';');
            $.each(pics, function (n, pic) {
                if(pic!='')
                    $("#detail_pictures").append("<li ><a href=\"javascript:deleteImage("+id+",'"+pic+"');\" target='_blank'><img width='360px' height='240px' src='/getSmallImage/"+pic+"'  alt='图片'></a>");
            });

        }

    });
}





