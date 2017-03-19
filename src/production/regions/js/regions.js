/**
 * Created by TanLiu on 2017/3/3.
 */
var saveUrl=baseUrl+"/region/addRegion";
var detailUrl=baseUrl+"/region/getRegionDetail";
var updataUrl=baseUrl+"/region/reviseRegion"
var listUrl=baseUrl+"/region/showRegions";
var deleteUrl=baseUrl+"/region/deleteRegion";
var deleteAllUrl=baseUrl+"/region/deleteAllRegion"
var addHtml="add.html";
var editHtml="edit.html";
var picturesHtml="pictures.html";
var editTile="修改行政区信息";
var addTitle="增加行政区信息";
//设置列对应的信息
function setColumns(){
    return  [
        {
            "render": function (data, type, full, meta) {
                return '<input type="checkbox" value="'+ full.id + '" name="checkboxids"/>';
            }
        },
        {data: 'id'},
        {data: 'name'},
        {data: 'number'},
        {data: 'createTime'},
        {
            "render": function (data, type, full, meta) {

                operation = "<a href='javascript:deleteInfo(" + full.id + ");'><span title='删除' class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>" +
                    "                    <a href='javascript:revise(" + full.id + ");'><span title='修改' class='glyphicon glyphicon-pencil' aria-hidden='true'></span></a>" +
                    "                    <a href=\"javascript:showImages(" + full.id + ",\'" + full.pictures + "\');\"><span title='查看图片' class='glyphicon glyphicon-picture' aria-hidden='true'></span></a>"


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
                    $("#add_pic").click(function () {
                        $("#uploadDiv").append(" <input id=\"file\" class=\"form-control col-md-7 col-xs-12\" name=\"file\"  type=\"file\">");
                    });
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







//设置查询的请求信息
function setParam(param){
    var times=$("#reportrange").val().split(" - ");
    param.select_time_begin = times[0];
    param.select_time_end = times[1];
    param.search_key = $("#search_key").val().trim();
    return param;
}


//设置删除的信息
function setDeleteInfo(id){
    return {"id":id};
}
//设置批量删除的信息
function setDeleteAllInfo(){
    var info=$("#userIds").val().trim();
    if(info.length>0){
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






