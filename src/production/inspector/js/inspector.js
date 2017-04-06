/**
 * Created by TanLiu on 2017/3/3.
 */
var saveUrl=baseUrl+"/employee/addInspector";
var detailUrl=baseUrl+"/employee/getInspectorDetail";
var updataUrl=baseUrl+"/employee/updateInspector";
var changPwdUrl=baseUrl+"/employee/resetInspectorPassword";
var listUrl=baseUrl+"/employee/showInspectors";
var deleteUrl=baseUrl+"/employee/inspectorChangeStatus";
var addHtml="add.html";
var editHtml="edit.html";
var pwdHtml="changpassword.html";
var picturesHtml="pictures.html";
var editTile="修改用户信息";
var addTitle="增加用户信息";




//设置列对应的信息
function setColumns(){
    return  [
        {data: 'id'},
        {data: 'username'},
        {data: 'name'},
        {data: 'phone'},
        {data: 'qq'},
        {data: 'email'},
        {data: 'contractStart'},
        {data: 'contractEnd'},
        {data: 'address'},
        {data: 'createTime'},
        {
            "render": function (data, type, full, meta) {
                var mystatus="激活";
                if(!full.status)mystatus="禁用"
                operation = "<a href='javascript:changPassword(" + full.id + ");'>改密</span></a>&nbsp;|&nbsp;" +
                    "                    <a href='javascript:revise(" + full.id + ");'><span title='修改' class='glyphicon glyphicon-pencil' aria-hidden='true'></span></a>&nbsp;|&nbsp;";
                var aoperation = "<a href='javascript:changStatus(" + full.id + ");'><span  aria-hidden='true'>"+mystatus+"</span></a>";

                return operation+aoperation;
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
                opneModel({url: addHtml, onOK: mySave, title: addTitle});
                $('#myModal').on('shown.bs.modal', function () {
                    init_validator();
                    init_daterangepicker_single_call();
                    if(typeof (setMySeletor) =="function"){
                        setMySeletor();
                    }
                });

            }
        }

    ];
}


function mySave(){
    //判断合同时间
    var canSave=$("#time_begin").val()<$("#time_end").val();
    if(canSave){
        save();
    }else{
        alert("合同时间不正确！")
    }
}



//设置查询的请求信息
function setParam(param){
    var times=$("#reportrange").val().split(" - ");
    param.select_time_begin = times[0];
    param.select_time_end = times[1];
    param.search_key = $("#search_key").val().trim();
    param.select_status=$("#list_select_status").find("option:selected").attr("id");
/*    param.select_village=$("#list_select_village").find("option:selected").attr("id");
    param.select_orchard=$("#list_select_orchard").find("option:selected").attr("id");
    param.select_product=$("#list_select_productinformation").find("option:selected").attr("id");*/
    return param;
}


//设置删除的信息
function setDeleteInfo(id){
    return {"id":id};
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

function setEditTime(data){
    $('#time_begin').daterangepicker({
        autoUpdateInput:false,
        singleDatePicker: true,
        singleClasses: "picker_1",
        defaultDate:"",
        locale: {
            format: 'YYYY-MM-DD'
        }
    }, function(start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });
    $('#time_end').daterangepicker({
        singleDatePicker: true,
        singleClasses: "picker_1",
        locale: {
            format: 'YYYY-MM-DD'
        }
    }, function(start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });
    $("#time_begin").val(data.contractStart);
    $("#time_end").val(data.contractEnd);
}


function changStatus(id){
    var deleteinfo=setDeleteInfo(id);
    MyDialog({
        title:"提示信息",
        content:"确定更新状态吗？",
        onOK:function(){

            $.ajax({
                url:deleteUrl,
                type:"post",
                data: deleteinfo,
                dataType: "json",
                async:false,
                success: function(data){
                    closeMyDialog();
                    alert(data.meg);
                    table.ajax.reload();

                },
                error : function (XMLHttpRequest, textStatus, errorThrown){
                    closeMyDialog();
                    alert("更新失败，请重新更新！");
                }

            });

        }
    })
}

function changPassword(id){
    opneModel({url:pwdHtml,onOK:changpwd,title:editTile});
    $('#myModal').on('shown.bs.modal', function () {
        init_validator ();
    });
    $("#editpwdform input[name='id']").val(id);
}
function changpwd(){
    var options={
        url:changPwdUrl,
        type:"POST",
        dataType:"json",
        success: function(data){
            var status=data.status;
            if(status==200){
                alert(data.meg);
                closeMyDialog();
                //table.ajax.reload();
            }
            else if(status==400){
                alert(data.meg);
            }
        },
        error:function(){alert("修改失败！");}

    };

    $("#editpwdform").ajaxSubmit(options);
}