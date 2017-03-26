/**
 * Created by TanLiu on 2017/3/3.
 */
var saveUrl=baseUrl+"/tree/addRfidAndTree";
var detailUrl=baseUrl+"/tree/getVarietyDetail";
var updataUrl=baseUrl+"/tree/updateVariety"
var listUrl=baseUrl+"/tree/showTreeAndRfid";
var deleteUrl=baseUrl+"/tree/deleteTreeAdnRfid";
var deleteAllUrl=baseUrl+"/tree/deleteRfids"
var addHtml="add.html";
var editHtml="edit.html";
var picturesHtml="pictures.html";
var editTile="修改果树信息";
var addTitle="增加果树信息";
//设置列对应的信息
function setColumns(){
    return  [
        {
            "render": function (data, type, full, meta) {



                return '<input type="checkbox" value="'+ full.id + '" name="checkboxids"/>';
            }
        },
        {data: 'id'},
        {data: 'treeNumber'},
        {data: 'vname'},
        {data: 'oname'},
        {data: 'viname'},
        {data: 'rname'},
        {data: 'paname'},
        {
            "render": function (data, type, full, meta) {

                operation = "<a href='javascript:deleteInfo(" + full.id + ");'><span title='删除' class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>";
                return operation;
            },
            "sWidth": "8%",
        },

    ];
}

//设置按钮的信息
function setButtons(){
    return  [
        {
            text: "增加",
            className: "btn btn-default",
            action: function (e, dt, node, config) {
                opneModel({url: addHtml, onOK: save, title: addTitle});
                $('#myModal').on('shown.bs.modal', function () {
                    init_validator();
                    setAddOrEditSeletor();
                });

            }
        },
        {
            text: "批量删除",
            className: "btn btn-default",
            action: function (e, dt, node, config) {
                deleteAllInfo();

            }
        },

    ];
}

$(function(){
    setSearchSeletor();
});




//设置查询的请求信息
function setParam(param){
    var times=$("#reportrange").val().split(" - ");
    param.select_time_begin = times[0];
    param.select_time_end = times[1];
    param.search_key = $("#search_key").val().trim();
    param.select_region=$("#list_select_region").find("option:selected").attr("id");
    param.select_village=$("#list_select_village").find("option:selected").attr("id");
    param.select_orchard=$("#list_select_orchard").find("option:selected").attr("id");
    param.select_product=$("#list_select_productinformation").find("option:selected").attr("id");
    return param;
}


//设置删除的信息
function setDeleteInfo(id){
    return {"id":id};
}
//设置批量删除的信息
function setDeleteAllInfo(){
    var info=$("#userIds").val().trim();
    if(info.length>1){
        alert(info);
        return {"ids":info};
    }
    return 0;
}

//对信息的设置
function setReviseInfo(id){
    return {"id":id};
}
function setFormInfo(){
    return {
        id:"editform",
       /* ignore:["pictures"]*/
    };
}






