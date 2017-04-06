/**
 * Created by TanLiu on 2017/3/3.
 */
var saveUrl=baseUrl+"/user/saveUser";
var detailUrl=baseUrl+"/user/getUserDetail";
var updataUrl=baseUrl+"/user/editorPwd";
var listUrl=baseUrl+"/user/userList";
var deleteUrl=baseUrl+"/user/deleteRole";
var deleteAllUrl=baseUrl+"/user/deleteRole";
var validUrl=baseUrl+"/user/vilidationUserID";
var changStatusUrl=baseUrl+"/user/transform";
var getAllRoleUrl=baseUrl+"/role/getAllRole"
var addHtml="user_add.html";
var editHtml="user_edit.html";
var picturesHtml="pictures.html";
var editTile="修改信息";
var addTitle="增加用户信息";
//设置列对应的信息
function setColumns(){
    return  [
        {data: 'employNo'},
        {
            "render": function (data, type, full, meta) {

               var userTypy={
                   "1":"超级管理员",
                   "2":"后台管理员",
                   "3":"果农",
                   "4":"质检员",
                   "5":"运输员",
                   "6":"经销商"
               }
               return typeof (userTypy[full.userType])=="undefined"?"":userTypy[full.userType];
            }
        },
        {
            "render": function (data, type, full, meta) {

                var userTypy={
                    "1":"是",
                    "0":"否",

                }
                return userTypy[full.status];
            }
        },

        {
            "render": function (data, type, full, meta) {

                return getSmpFormatDateByLong(full.createTime,false);
            }
        },
        {
            "render": function (data, type, full, meta) {
                var info="激活"
                if(full.status){
                    info="禁用"
                }
                operation = "  <a href=\"javascript:changStatus(\'" + full.userId+ "\');\"><span  aria-hidden='true'>"+info+"</span></a>"
                return operation;
            }
        },
        {
            "render": function (data, type, full, meta) {

                operation = "  <a href=\"javascript:revise(\'" + full.userId+ "\');\"><span title='修改' class='glyphicon glyphicon-pencil' aria-hidden='true'></span></a>"


                return operation;
            },

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
                    roadTree();
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






function changStatus(id){
    $.ajax({
        type: "post",
        url: changStatusUrl,
        data: {"userId":id},
        dataType: "json",
        async:false,
        success: function(data){

            table.ajax.reload();

        },
        error : function (XMLHttpRequest, textStatus, errorThrown){
            alert("打开失败，认重新打开！");
        }
    });
}


//设置查询的请求信息
function setParam(param){
    param.querycon = $("#search_key").val().trim();
    return param;
}


//设置删除的信息
function setDeleteInfo(id){
    return {"userId":id};
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
    return {"userId":id};
}
function setFormInfo(){
    return {
        id:"editform",
       /* ignore:["pictures"]*/
    };
}

function addCheckBox(param){
     var $form_roleIds= $("#form_roleIds")
    for(var i=0;i<param.length;i++){
        var $check=$("<input type='checkbox' id=\'"+param[i].roleId+"\' value=\'"+param[i].roleId+"\' name='roleIds'/>");
        alert(param[i].roleName);
        $check.text(param[i].roleName);
        $form_roleIds.append($check);

    }

}

function getAllRole(){
    $.ajax({
        type: "post",
        url: getAllRoleUrl,
        dataType: "json",
        async:false,
        success: function(data){
            addCheckBox(data);
        },
        error : function (XMLHttpRequest, textStatus, errorThrown){
            alert("打开失败，认重新打开！");
        }
    });
}

function setRoleChockBox(){

}


