/**
 * Created by TanLiu on 2017/3/3.
 */
$(function(){
    $("#variety_list").DataTable({
        dom: "Brtip",
        "lengthChange":true,
        "bServerSide" : true,
        "bStateSave" : false,
        buttons: [
            {
                text:"增加",
                className:"btn btn-default",
                action: function ( e, dt, node, config ) {
                    alert("增加");

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
        ajax: {
            url: "http://127.0.0.1:8088/fruit-web/src/js/variety.json",
            type:"post",
            dataType:"json",//返回数据类
            dataSrc: function(data){
                return data.data;

            }
            ,
            error:function(){
                alert("error");
            }

        },
        columns: [
            {
                "render" : function(data, type, full, meta) {
                    return mydelete="<input type='checkbox' name='allChecked' />";
                },
                "sWidth" : "1%",
                "orderable" : false, // 禁用排序
            },
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
                      return mydelete="<button type='button' class='btn btn-round btn-danger'>删除</button>";
                     // mydelete="<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>";
            },
                "sWidth" : "3%",},

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