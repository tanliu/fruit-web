/**
 * Created by TanLiu on 2017/3/3.
 */
var saveUrl=baseUrl+"/role/addRole";
var detailUrl=baseUrl+"/role/getRoleDetail";
var updataUrl=baseUrl+"/role/updateRole"
var listUrl=baseUrl+"/role/showRole";
var deleteUrl=baseUrl+"/role/deleteRole";
var deleteAllUrl=baseUrl+"/role/deleteRole"
var addHtml="role_add.html";
var editHtml="role_edit.html";
var picturesHtml="pictures.html";
var editTile="修改品种信息";
var addTitle="增加回品种信息";
//设置列对应的信息
function setColumns(){
    return  [
        {
            "render": function (data, type, full, meta) {



                return '<input type="checkbox" value="'+ full.roleId + '" name="checkboxids"/>';
            }
        },
        {data: 'roleName'},
        {data: 'createTime'},
        {data: 'memo'},
        {
            "render": function (data, type, full, meta) {

                operation = "  <a href=\"javascript:revise(\'" + full.roleId + "\');\"><span title='修改' class='glyphicon glyphicon-pencil' aria-hidden='true'></span></a>"



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
                opneModel({url: addHtml, onOK: mySave, title: addTitle});
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



function mySave() {
    setAddAuthority();
    save();
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
    return {"roleId":id};
}
function setFormInfo(){
    return {
        id:"editform",
       /* ignore:["pictures"]*/
    };
}



var setting = {
    view: {
        dblClickExpand: false,
        showLine: true, <!--是否显示线性-->
        selectedMulti: false,
        showIcon:true,<!--是否显示图标-->
    },
    check:{
        enable: true,
        autoCheckTrigger : true,
        chkStyle : "checkbox",
        chkboxType : {"Y": "ps", "N": "s"},
    },
    data: {
        simpleData: {
            enable:true,
            idKey: "id",
            pIdKey: "pId",
            rootPId: ""
        }
    },
    callback: {

        beforeCheck: zTreeBeforeCheck,
        onCheck: zTreeOnCheck
    }
};

var zNodes =[
];
var zTree;

function zTreeBeforeCheck(treeId, treeNode) {
    return true;
};
function zTreeOnCheck(event, treeId, treeNode) {

};




function roadTree(roleId){

    $.ajax({
        url:baseUrl+"/authority/treeData",
        type:"post",
        dataType:"json",//返回数据类型
        success: function(data){
            var t = $("#tree");
            if(data!=null){
                $.fn.zTree.destroy("tree");
                zNodes =[
                ];

                var dataObj=eval(data);//转换为json对象
                //把数据输入到Znodes
                for(var i=0;i<dataObj.length;i++){
                    var val = {id:dataObj[i].authorityId, pId:dataObj[i].parentId, name:dataObj[i].authorityName, open:true};
                    zNodes.push(val);
                }
            }
            //加载树
            var t = $("#tree");
            t = $.fn.zTree.init(t, setting, zNodes);
            // demoIframe = $("#testIframe");
            /// demoIframe.bind("load", loadReady);
            var zTree = $.fn.zTree.getZTreeObj("tree");
            //zTree.selectNode(zTree.getNodeByParam("id", 101));

            if(typeof (roleId) != "undefine"){
                $.ajax({
                    url:baseUrl+"/role/check",
                    type:"post",
                    data:{"roleId":roleId},
                    dataType:"json",//返回数据类型
                    async:false,
                    success: function(data){
                        if(data!=null){
                            var dataObj=eval(data);//转换为json对象

                            //var zTree = $.fn.zTree.getZTreeObj("tree");
                            //把数据输入到Znodes
                            for(var i=0;i<dataObj.length;i++){
                                var node = zTree.getNodeByParam("id",dataObj[i].authorityId);
                               // var node = zTree.getNodeByParam("id","8a8fa1e0556cc0a301556d228b340019");
                                zTree.checkNode(node, true, false);
                            }
                        }

                    },
                    error:function(){}

                });
            }



        },
        error:function(){alert("失败！");}

    });
}
function setCheck(roleId){
    $.ajax({
        url:baseUrl+"/role/check",
        type:"post",
        data:{"roleId":roleId},
        dataType:"json",//返回数据类型
        async:false,
        success: function(data){
            if(data!=null){
                var dataObj=eval(data);//转换为json对象

                var zTree = $.fn.zTree.getZTreeObj("tree");
                //把数据输入到Znodes
                for(var i=0;i<dataObj.length;i++){
                    //var node = zTree.getNodeByParam("id",dataObj[i].authorityId);
                    var node = zTree.getNodeByParam("id","8a8fa1e0556cc0a301556d228b340019");
                    zTree.checkNode(node, true, false);
                }
            }

        },
        error:function(){}

    });
}

function loadReady() {
    var bodyH = demoIframe.contents().find("body").get(0).scrollHeight,
        htmlH = demoIframe.contents().find("html").get(0).scrollHeight,
        maxH = Math.max(bodyH, htmlH), minH = Math.min(bodyH, htmlH),
        h = demoIframe.height() >= maxH ? minH:maxH ;
    if (h < 530) h = 530;
    demoIframe.height(h);
}

function setAddAuthority(){
    var $roleForm=$("#addform");
    //获取勾选到的节点
    var zTree = $.fn.zTree.getZTreeObj("tree");
    var nodes = zTree.getCheckedNodes(true);
    for (var i=0, l=nodes.length; i < l; i++) {
        var $input=$("<input type='hidden' id='authoritys' name='authoritys' value="+nodes[i].id+">");
        $roleForm.append($input);
    }
}
function setEditAuthority(){
    var $roleForm=$("#editform");
    //获取勾选到的节点
    var zTree = $.fn.zTree.getZTreeObj("tree");
    var nodes = zTree.getCheckedNodes(true);
    for (var i=0, l=nodes.length; i < l; i++) {
        var $input=$("<input type='hidden' id='authoritys' name='authoritys' value="+nodes[i].id+">");
        $roleForm.append($input);
    }
}


