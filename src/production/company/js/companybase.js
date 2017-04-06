/**
 * Created by TanLiu on 2017/3/19.
 */
//基本抽取
//把数据装到form(可以抽取)
function addData(options,data) {
    if(typeof (setEditTime) =="function"){
        setEditTime(data);
    }
    for(var o in data){
        if ($.inArray(o, options.ignore)!=-1){
            continue;
        }
        selector="#"+options.id+" input[name=\'"+o+"\']";
        $(selector).val(data[o]);
    }

}
//修改信息的js(可以抽取)
function revise(id){
    var reviseInfo=setReviseInfo(id);
    var formInfo=setFormInfo();
    $.ajax({
        type: "post",
        url: detailUrl,
        data: reviseInfo,
        dataType: "json",
        async:false,
        success: function(data){
            opneModel({url:editHtml,onOK:edit,title:editTile});
            $('#myModal').on('shown.bs.modal', function () {
                init_validator ();
                $("#add_pic").click(function(){
                    $("#uploadDiv").append(" <input id=\"file\" class=\"form-control col-md-7 col-xs-12\" name=\"file\"  type=\"file\">");
                });
            });
            addData(formInfo,data);

        },
        error : function (XMLHttpRequest, textStatus, errorThrown){
            alert("打开失败，认重新打开！");
        }
    });
}

//打开窗口（可以抽取）
function opneModel(options){
    $.ajax({
        url:options.url,
        type:"GET",
        async:false,
        success:function(data){
            MyDialog({
                title:options.title,
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


//增加信息可以抽取，同时注意增加的form的id一定是“addform”
function save(){
    var options={
        url:saveUrl,
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
    $("#addform").ajaxSubmit(options);
}
//修改信息提示可以抽取
function edit(){
    var options={
        url:updataUrl,
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

    $("#editform").ajaxSubmit(options);
}
//可以抽取
function deleteInfo(id){
    var deleteinfo=setDeleteInfo(id);
    var meg = "确定删除该记录吗？";
    MyDialog({
        title:"提示信息",
        content:"是否确认删除？",
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
                    alert("删除失败，请重新删除！");
                }

            });

        }
    })
}

function deleteAllInfo(){
    var deleteAllinfo=setDeleteAllInfo();
    if (deleteAllinfo==0){
        alert("请选择！")
        return ;
    }
    var meg = "确定删除该记录吗？";
    MyDialog({
        title:"提示信息",
        content:"是否确认删除？",
        onOK:function(){

            $.ajax({
                url:deleteAllUrl,
                type:"post",
                data: deleteAllinfo,
                dataType: "json",
                async:false,
                success: function(data){
                    closeMyDialog();
                    alert(data.meg);
                    table.ajax.reload();

                },
                error : function (XMLHttpRequest, textStatus, errorThrown){
                    closeMyDialog();
                    alert("删除失败，请重新删除！");
                }

            });

        }
    })
}

var baseUrl="http://127.0.0.1:8080"
var table;
var tableOptions= {
    dom: "Blrtip",
    "aLengthMenu": [10, 20, 40, 60],
    "destroy": true,
    "lengthChange": true,
    "processing": true,
    "bServerSide": true,
    "bStateSave": false,
    "iDisplayLength": 10,
    "iDisplayStart": 0,
    "ordering": false,//全局禁用排序
    "paging": true,//开启表格分页
    ajax: function (data, callback, settings) {
        //封装请求参数
        var param = {};
        param.pageSize = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
        param.start = data.start;//开始的记录序号
        param.page = (data.start / data.length) + 1;//当前页码

        param=setParam(param);
        var mydraw = data.draw;
        $.ajax({
            type: "post",
            url: listUrl,
            cache: false, //禁用缓存
            data: param, //传入组装的参数
            dataType: "json",
            success: function (result) {
                var returnData = {};
                returnData.draw = mydraw;//这里直接自行返回了draw计数器,应该由后台返回
                returnData.recordsTotal = result.totalCount;
                returnData.recordsFiltered = result.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                returnData.data = result.items;
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

function init_tableList(){
    tableOptions.buttons=setButtons();
    tableOptions.columns=setColumns();
    table=$("#table_list").DataTable(tableOptions);
}
$(function(){
    init_tableList();

});
//显示图片(可以抽取)
function showImages(id,pictures){
    // alert(pictures);

    opneModel({url:picturesHtml,onOK:closeMyDialog,title:"显示图片"});
    $('#myModal').on('shown.bs.modal', function () {
        var pics = pictures.split(';');
        $.each(pics, function (n, pic) {
            if(pic!='')
                $("#detail_pictures").append("<li ><a href=\"javascript:deleteImage("+id+",'"+pic+"');\" target='_blank'><img width='360px' height='240px' src='"+baseUrl+"/getSmallImage/"+pic+"'  alt='图片'></a>");
        });
    });
}
//可以抽取（？）
$("#search").on("click",function(){
    table.ajax.reload();
});




/**
 * 多选选中和取消选中,同时选中第一个单元格单选框,并联动全选单选框
 */
$('#table_list').on('click', 'tr', function(event) {
    var allChecked=$('input[name=allChecked]')[0];//关联全选单选框
    $($(this).children()[0]).children().each(function(){
        if(this.type=="checkbox" && (!$(event.target).is(":checkbox") && $(":checkbox",this).trigger("click"))){
            if(!this.checked){
                this.checked = true;
                addValue(this);
                var selected=table.rows('.selected').data().length;//被选中的行数
                //全选单选框的状态处理
                var recordsDisplay=table.page.info().recordsDisplay;//搜索条件过滤后的总行数
                var iDisplayStart=table.page.info().start;// 起始行数
                if(selected === table.page.len()||selected === recordsDisplay||selected === (recordsDisplay - iDisplayStart)){
                    allChecked.checked = true;
                }
            }else{
                this.checked = false;
                cancelValue(this);
                allChecked.checked = false;
            }
        }
    });
    $(this).toggleClass('selected');//放在最后处理，以便给checkbox做检测

});



/**
 * 全选按钮被点击事件
 */
$('input[name=allChecked]').click(function(){

    $('input[name=checkboxids]').attr("checked", false);
    $("input[name=userIds]").val("");
    if(this.checked){
        $('input[name=checkboxids]').each(function(){
            $(this).click();
            addValue(this);
        });
    }
});

/**
 * 单选框被选中时将它的value放入隐藏域
 */
function addValue(para) {
    var userIds = $("input[name=userIds]");
    if(userIds.val() === ""){
        userIds.val($(para).val());
    }else{
        userIds.val(userIds.val()+","+$(para).val());
    }
}

/**
 * 单选框取消选中时将它的value移除隐藏域
 */
function cancelValue(para){
    //取消选中checkbox要做的操作
    var userIds = $("input[name=userIds]");
    var array = userIds.val().split(",");
    userIds.val("");
    for (var i = 0; i < array.length; i++) {
        if (array[i] === $(para).val()) {
            continue;
        }
        if (userIds.val() === "") {
            userIds.val(array[i]);
        } else {
            userIds.val(userIds.val() + "," + array[i]);
        }
    }
}

function addInfoToSelect(url,id,param){
    removeInfoToSelect(id);
    $.ajax({
        url:url,
        type:"post",
        data: param,
        dataType: "json",
        async:false,
        success: function(data){
            $select=$("#"+id);
            /*$select.append($("<option id='-1'>所有</option>"));*/
            for(var o in data){
                $option=$("<option id="+data[o].id+">"+data[o].name+"</option>");
                $select.append($option);
            }

        },

    });

}

function removeInfoToSelect(id) {
    $("#"+id+" option").each(function(){
        $(this).remove();
    });
}
function selectInfoToInput(selectid,inputId){
    $("#"+inputId).val($("#"+selectid).find("option:selected").attr("id").trim());
}



//对于select的处理
//设置打开添加时对seletor的加载
function setAddOrEditSeletor(){
    addInfoToSelect(baseUrl+"/public/getAllRegionWithAll","select_region",{});
    $("#select_region").change(function(){
        var id=$("#select_region").find("option:selected").attr("id").trim();
        if(id>0){
            var param={"regionId":id}
            addInfoToSelect(baseUrl+"/public/getVillagesByRegionWithAll","select_village",param);
        }else{
            removeInfoToSelect("select_village");
        }
        removeInfoToSelect("select_orchard");
        removeInfoToSelect("select_productinformation");

    });
    $("#select_village").change(function(){
        var id=$("#select_village").find("option:selected").attr("id").trim();
        if(id>0){
            var param={"villageId":id}
            addInfoToSelect(baseUrl+"/public/getOrchardByVillageWithAll","select_orchard",param);
        }else{
            removeInfoToSelect("select_orchard");
        }
        removeInfoToSelect("select_productinformation");

    });
    $("#select_orchard").change(function(){
        var id=$("#select_village").find("option:selected").attr("id").trim();
        if(id>0){
            var param={"orchardId":id}
            addInfoToSelect(baseUrl+"/public/getProductByOrchardWithAll","select_productinformation",param);
        }else{
            removeInfoToSelect("select_productinformation");
        }
    });
    $("#select_productinformation").change(function(){
        selectInfoToInput("select_productinformation","select_input_productinformation");
    });

}
function setSearchSeletor(){
    addInfoToSelect(baseUrl+"/public/getAllRegionWithAll","list_select_region",{});
    $("#list_select_region").change(function(){
        var id=$("#list_select_region").find("option:selected").attr("id").trim();
        if(id>0){
            var param={"regionId":id}
            addInfoToSelect(baseUrl+"/public/getVillagesByRegionWithAll","list_select_village",param);
        }else{
            removeInfoToSelect("list_select_village");
        }
        removeInfoToSelect("list_select_orchard");
        removeInfoToSelect("list_select_productinformation");

    });
    $("#list_select_village").change(function(){
        var id=$("#list_select_village").find("option:selected").attr("id").trim();
        if(id>0){
            var param={"villageId":id}
            addInfoToSelect(baseUrl+"/public/getOrchardByVillageWithAll","list_select_orchard",param);
        }else{
            removeInfoToSelect("list_select_orchard");
        }
        removeInfoToSelect("list_select_productinformation");

    });
    $("#list_select_orchard").change(function(){
        var id=$("#list_select_orchard").find("option:selected").attr("id").trim();
        if(id>0){
            var param={"orchardId":id}
            addInfoToSelect(baseUrl+"/public/getProductByOrchardWithAll","list_select_productinformation",param);
        }else{
            removeInfoToSelect("list_select_productinformation");
        }
    });



}