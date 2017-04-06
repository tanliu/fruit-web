/**
 * Created by TanLiu on 2017/3/3.
 */
var saveUrl=baseUrl+"/company/toRegistCompany";
var detailUrl=baseUrl+"/company/getVarietyDetail";
var updataUrl=baseUrl+"/company/updateVariety"
var listUrl=baseUrl+"/company/companyList";
var deleteUrl=baseUrl+"/company/deleteCompany";
var deleteAllUrl=baseUrl+"/company/deleteAllVariety"
var addHtml="add.html";
var editHtml="edit.html";
var picturesHtml="pictures.html";
var editTile="修改品种信息";
var addTitle="增加公司信息";
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
        {data: 'companyCode'},
        {data: 'address'},
        {data: 'phone'},
        {data: 'entrust'},
        {
            "render": function (data, type, full, meta) {

                return getSmpFormatDateByLong(full.createTime,false);
            }
        },
        {data: 'introduction'},
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
                });

            }
        },

    ];
}







//设置查询的请求信息
function setParam(param){
    param.querycon = $("#search_key").val().trim();
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






