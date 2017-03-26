/**
 * Created by TanLiu on 2017/3/3.
 */
var saveUrl=baseUrl+"/orchard/add";
var detailUrl=baseUrl+"/orchard/getOrchardDetail";
var updataUrl=baseUrl+"/orchard/updateOrchard"
var listUrl=baseUrl+"/orchard/showOrchards";
var deleteUrl=baseUrl+"/orchard/deleteOrchard";
var deleteAllUrl=baseUrl+"/orchard/deleteAllOrchard"
var editEnvironmentUrl=baseUrl+"/orchard/updateEnvironment";
var environmentdetailUrl=baseUrl+"/orchard/getEnvironmentDetail";
var productlist=baseUrl+"/orchard/getProductByOrchard";
var productdelete=baseUrl+"/orchard/deleteProduct";
var productsaveUrl=baseUrl+"/orchard/addProduct";


var addHtml="add.html";
var editHtml="edit.html";
var picturesHtml="pictures.html";
var productHtml="producttable.html";
var addproductHtml="addproduct.html";
var environmenteditHtml="editorenvironment.html";
var environmentshowHtml="showenvironment.html";


var editTile="修改果园信息";
var addTitle="增加果园信息";




$(function(){

    addInfoToSelect(baseUrl+"/region/getAllRegionWithAll","list_select_region",{});
    $("#list_select_region").change(function(){
        var id=$("#list_select_region").find("option:selected").attr("id").trim();
        if(id>0){
            var param={"regionId":id}
            addInfoToSelect(baseUrl+"/public/getVillagesByRegionWithAll","list_select_village",param);
        }else{
            removeInfoToSelect("list_select_village");
        }

    });


});


//设置列对应的信息
function setColumns(){
    return  [
        {
            "render": function (data, type, full, meta) {
                return '<input type="checkbox" value="'+ full.id + '" name="checkboxids"/>';
            }
        },
        {data: 'name'},
        {data:'number'},
        {data:'area'},
        {data:'count'},
        {data:'yield'},
        {data:'fname'},
        {data:'vname'},
        {data:'address'},
        {data:'ordernumber'},
        {
            "render": function (data, type, full, meta) {

                operation =full.productSize+"<a href='javascript:shotproduct(" + full.id + ");'><span aria-hidden='true'>&nbsp;&nbsp;&nbsp;&nbsp;查看</span></a>";

                return operation;
            },
            "sWidth": "8%",
        },
        {data:'createTime'},
        {
            "render": function (data, type, full, meta) {

                operation = "<a href='javascript:showEnvironment(" + full.environmentId + ");'><span aria-hidden='true'>查看&nbsp;&nbsp;&nbsp;&nbsp;</span></a>" +
                    "                    <a href='javascript:reviseEnvironment(" + full.environmentId + ");'><span  aria-hidden='true'>修改</span></a>";
                return operation;
            },
            "sWidth": "8%",
        },
        {
            "render": function (data, type, full, meta) {

                operation = "<a href='javascript:deleteInfo(" + full.id + ");'><span title='删除' class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                    "                    <a href='javascript:revise(" + full.id + ");'><span title='修改' class='glyphicon glyphicon-pencil' aria-hidden='true'></span></a>";
                return operation;
            },
            "sWidth": "8%",
        },

    ];
}

function setMySeletor(){
    addInfoToSelect(baseUrl+"/region/getAllRegionWithAll","regionsSelect",{});
    $("#regionsSelect").change(function(){
        var id=$("#regionsSelect").find("option:selected").attr("id").trim();
        if(id>-1){
            var param={"regionId":id}
            addInfoToSelect(baseUrl+"/public/getVillagesByRegionWithAll","villageSelect",param);
        }else{
            removeInfoToSelect("villageSelect");
        }

    });
    $("#regionsSelect").change(function(){
        var id=$("#regionsSelect").find("option:selected").attr("id").trim();
        if(id>-1){
            var param={"regionId":id}
            addInfoToSelect(baseUrl+"/public/getVillagesByRegion","villageSelect",param);
        }else{
            removeInfoToSelect("villageSelect");
        }

    });

}
function setSearchSeleteToInput() {
    selectInfoToInput("list_select_region","list_input_select_region");
    selectInfoToInput("list_select_village","list_input_select_village");
}
//设置按钮的信息
function setButtons(){
    return  [
        {
            text: "增加",
            className: "btn btn-default",
            action: function (e, dt, node, config) {
                opneModel({url: addHtml, onOK: setSelectto, title: addTitle});
                $('#myModal').on('shown.bs.modal', function () {
                    init_validator();
                    if(typeof (setMySeletor) =="function"){
                        setMySeletor();
                    }


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
        }, {
            text: "批量增加品种",
            className: "btn btn-default",
            action: function (e, dt, node, config) {
                addproduct();

            }
        },

    ];
}

function editEnvironment() {
    var options={
        url:editEnvironmentUrl,
        type:"POST",
        dataType:"json",
        success: function(data){
            var status=data.status;
            if(status==200){
                alert(data.meg);
                closeMyDialog();
                table.ajax.reload();
            }
            else if(status==400){
                alert(data.meg);
            }
        },
        error:function(){alert("修改失败！");}

    };

    $("#editorenvironmentform").ajaxSubmit(options);
}

function reviseEnvironment(id){
    var reviseInfo=setReviseInfo(id);
    var formInfo={
        id:"editorenvironmentform",
        /* ignore:["pictures"]*/
    };
    $.ajax({
        type: "post",
        url: environmentdetailUrl,
        data: reviseInfo,
        dataType: "json",
        async:false,
        success: function(data){
            opneModel({url:environmenteditHtml,onOK:editEnvironment,title:"修改环境信息"});
            $('#myModal').on('shown.bs.modal', function () {
                init_validator ();
/*                $("#add_pic").click(function(){
                    $("#uploadDiv").append(" <input id=\"file\" class=\"form-control col-md-7 col-xs-12\" name=\"file\"  type=\"file\">");
                });*/
            });
            addData(formInfo,data);

        },
        error : function (XMLHttpRequest, textStatus, errorThrown){
            alert("打开失败，认重新打开！");
        }
    });
}
function showEnvironment(id){
    var reviseInfo=setReviseInfo(id);
    var formInfo={
        id:"showenvironmentform",
        /* ignore:["pictures"]*/
    };
    $.ajax({
        type: "post",
        url: environmentdetailUrl,
        data: reviseInfo,
        dataType: "json",
        async:false,
        success: function(data){
            opneModel({url:environmentshowHtml,onOK:function(){closeMyDialog();},title:"修改环境信息"});
            addData(formInfo,data);

        },
        error : function (XMLHttpRequest, textStatus, errorThrown){
            alert("打开失败，认重新打开！");
        }
    });
}
function setSelectto(){
   selectInfoToInput("regionsSelect","regionsIdSelect");
   selectInfoToInput("villageSelect","villageIdSelect");
   selectInfoToInput("farmerSelect","farmerIdSelect");
   save();

}
//设置查询的请求信息
function setParam(param){
    var times=$("#reportrange").val().split(" - ");
    param.select_time_begin = times[0];
    param.select_time_end = times[1];
    param.search_key = $("#search_key").val().trim();
    //param.select_region=$("#select_region").find("option:selected").attr("id");
    param.select_region=$("#list_select_region").find("option:selected").attr("id");
    param.select_village=$("#list_select_village").find("option:selected").attr("id");

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
//-------------------产品信息

var productOptions= {
    dom: "rtip",
    "aLengthMenu": [10, 20, 40, 60],
    "destroy": true,
    "lengthChange": true,
    "processing": true,
    "bServerSide": true,
    "bStateSave": false,
    "iDisplayLength": 5,
    "iDisplayStart": 0,
    "ordering": false,//全局禁用排序
    "paging": true,//开启表格分页
    ajax: function (data, callback, settings) {
        //封装请求参数
        var param = {};
        param.pageSize = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
        param.start = data.start;//开始的记录序号
        param.page = (data.start / data.length) + 1;//当前页码

        param=setproductParam(param);
        var mydraw = data.draw;
        $.ajax({
            type: "post",
            url: productlist,
            cache: false, //禁用缓存
            data: param, //传入组装的参数
            dataType: "json",
            success: function (result) {
                var returnData = {};
                returnData.draw = mydraw;//这里直接自行返回了draw计数器,应该由后台返回
                returnData.recordsTotal = result.total;
                returnData.recordsFiltered = result.total;//后台不实现过滤功能，每次查询均视作全部结果
                returnData.data = result.data;
                callback(returnData);
            },
            error: function () {
                alert("信息加载失败，请刷新！");
            }
        });
    },


    "oLanguage": { // 国际化配置
        "sProcessing": "正在获取数据，请稍后...",
        "sLengthMenu": "显示 _MENU_ 条",
        "sZeroRecords": "没有找到数据",
        "sInfo": "从 _START_ 到  _END_ 条记录 总记录数为 _TOTAL_ 条",
        "sInfoEmpty": "记录数为0",
        "sInfoFiltered": "(全部记录数 _MAX_ 条)",
        "sInfoPostFix": "",
        "sSearch": "搜索",
        "sUrl": "",
        "oPaginate": {
            "sFirst": "第一页",
            "sPrevious": "上一页",
            "sNext": "下一页",
            "sLast": "最后一页"
        }
    },
    responsive: true
}
var mytable;
var myproductid;
function init_product_tableList(){
    productOptions.columns=setproductColumns();
    mytable=$("#product_table_list").DataTable(productOptions);
}
//设置查询的请求信息
function setproductParam(param){

    param.id=myproductid;
    return param;
}
function setproductColumns() {
    return  [

        {data: 'id'},
        {data: 'number'},
        {data: 'vname'},
        {data:'aname'},
        {data:'year'},
        {data:'type'},
        {data:'anumber'},
        {
            "render": function (data, type, full, meta) {

                operation = "<a href='javascript:deleteproduct(" + full.id + ");'><span title='删除' class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>&nbsp;&nbsp;&nbsp;&nbsp;" ;
                return operation;
            },
            "sWidth": "8%",
        },

    ];

}
function deleteproduct(id) {
    var deleteinfo=setDeleteInfo(id);
    var meg = "确定删除该记录吗？";
    alert(meg);
    $.ajax({
        url:productdelete,
        type:"post",
        data: deleteinfo,
        dataType: "json",
        async:false,
        success: function(data){
            alert(data.meg);
            mytable.ajax.reload();

        },
        error : function (XMLHttpRequest, textStatus, errorThrown){
            alert("删除失败，请重新删除！");
        }

    });
}

function shotproduct(id){
    myproductid=id;
    opneModel({url: productHtml, onOK: closeMyDialog(), title: "品种信息"});
    $('#myModal').on('shown.bs.modal', function () {

        init_product_tableList();


    });
}

function addproduct(){
    var productAllinfo=setaddProductAllInfo();
    if (productAllinfo==0){
        alert("请选择！")
        return ;
    }
    opneModel({url: addproductHtml, onOK: saveProduect, title: "为果园增加品种信息"});
    $('#myModal').on('shown.bs.modal', function () {
        addInfoToSelect(baseUrl+"/orchard/getAllAreaByCompany","areaIdSelect",{});
        addInfoToSelect(baseUrl+"/orchard/getAllVarietyByCompany","varietySelect",{});
        $("#addproductids").val(productAllinfo.ids);
    });
}

function saveProduect(){
    selectInfoToInput("areaIdSelect","inputareaIdIdSelect");
    selectInfoToInput("varietySelect","inputvarietyIdSelect");
    var options={
        url:productsaveUrl,
        type:"POST",
        dataType:"json",
        async:false,
        success: function(data){
            var status=data.status;
            if(status==200){
                alert(data.meg);
                closeMyDialog();

                table.ajax.reload();
            }
            else if(status==400){
                alert(data.meg);
            }
        },
        error:function(){alert("保存失败！");}

    };
    $("#addproductform").ajaxSubmit(options);
}


function setaddProductAllInfo(){
    var info=$("#userIds").val().trim();
    if(info.length>0){
        return {"ids":info};
    }
    return 0;
}

function setSelectById(selectId,id){
    $("#"+selectId+" #"+id).attr("selected",true);
}



