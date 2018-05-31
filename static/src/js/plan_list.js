//渲染界面的
var $me = $("#error_message");
var $mess = $('#process_message');
// 查询方法
function query(currPage, limit) {
    var currPage = 1;
    var keywords = $("#keywords").val();
    var project = $("#proj option:selected").attr("value");
    var userId = $("#creator option:selected").attr("value");
        $.ajax({
          type : "Get",
          url : "/plan/query",
          data : {
            "currPage" : currPage,
            "kw" : keywords,
            "userId" : userId,
            "project" : project
            },
          dataType : "json",
          success : function(data) {
            var data_content = data["data"];
            var totalCount = data["count"];//数据总条数
            var showCount = 10;//显示的页数
            var limit = 10;//每页显示的数据条数
            createTable(1, limit, totalCount, data_content);
            $("#fenye").extendPagination(
            {
              totalCount : totalCount,
              showCount : showCount,
              limit : limit,
              callback : function(currPage,limit,totalCount) {
                $.ajax({
                  type : "Get",
                  url : "/plan/query",
                  data : {
                    "currPage" : currPage,
                    "kw" : keywords,
                    "userId" : userId,
                    "project" : project
                  },
                  dataType : "json",
                  success : function(data) {
                    var data_content = data["data"];
                    createTable(currPage,limit,totalCount,data_content);
                  },
                  error : function(data) {
                    $me.html("系统异常！");
                    $mess.modal({
                     keyboard: true
                   }); 
                  }
                });
              }
            });
          },
          error : function(data) {
           $me.html("系统异常！");
           $mess.modal({
             keyboard: true
           }); 
          }
        });
  }  
// 创建列表
function createTable(currPage,limit, totalCount, data) {
    let html = [], showNum = limit;
    if (totalCount - (currPage * limit) < 0) {
      showNum = totalCount - ((currPage - 1) * limit);  
    }                          
    html.push('<table class="table table-hover">');
    html.push('<thead><tr><th style="width:300px;">计划名称</th><th style="width:150px;">所属项目</th><th style="width:100px;">创建人</th><th style="width:190px;">备注</th><th style="width:190px;">最近测试时间</th><th style="width:100px;">状态</th><th style="width:220px;">操作</th></tr></thead><tbody>');
    for (let i = 0; i < showNum; i++) {
      if (i < data.length) {
        html.push('<tr><td id='+data[i].id+'>'+data[i].name+'</td>');
        html.push('<td>'+data[i].proj+'</td>');
        html.push('<td>'+data[i].user+'</td>');
        html.push('<td>'+data[i].description+'</td>');
        html.push('<td>'+data[i].update_time+'</td>');
        if(data[i].plan_status===0){
          html.push('<td><span class="label label-primary">闲置</span></td>');
          html.push('<td><button type="button" class="btn btn-link table_btn_lef" id="account_pwd_reset" onClick="apiEdit(this)">查看</button><button type="button" class="btn btn-link table_btn_lef" id="delete_account" onClick="apiDelete(this)">删除</button><button type="button" class="btn btn-link table_btn_mid" id="delete_account" onClick="apiTestCase(this)">历史任务</button><button type="button" class="btn btn-link table_btn_mid" id="delete_account" onClick="apiTestCase(this)">创建任务</button></td>');
        }
        else{
          html.push('<td><span class="label label-warning">任务中</span></td>');
          html.push('<td><button type="button" class="btn btn-link table_btn_lef" id="account_pwd_reset" onClick="apiEdit(this)">查看</button><button type="button" class="btn btn-link table_btn_lef" id="delete_account" onClick="apiDelete(this)">删除</button><button type="button" class="btn btn-link table_btn_mid" id="delete_account" onClick="apiTestCase(this)">历史任务</button><button type="button" class="btn btn-link table_btn_mid" id="delete_account" onClick="apiTestCase(this)">创建任务</button></td>');
        }
        html.push('</tr>');
      }
    }
    html.push('</tbody></table>');
    let mainObj = $('#center_content_table');
    mainObj.empty();
    mainObj.html(html.join(''));
    loading(1);
};
//跳转新增界面
function planAdd(){
    window.location.href = "/plan/addinfo/";
}
//跳转查看界面
function planView(id){
    let plan_id = $(id).parent().parent().children().eq(0).attr("id");
     window.location.href = "/plan/"+plan_id+"/view/";
}
//跳转历史任务界面
function planTaskList(id){
    let plan_id = $(id).parent().parent().children().eq(0).attr("id");
     window.location.href = "/plan/"+plan_id+"/takes/";
}
//新增计划
function plan_addinfo(){
  var $b3 = $("#add_table_form");
  $b3.data("bootstrapValidator").validate();  
  let flag = $b3.data("bootstrapValidator").isValid();
  if(flag){
   let pam = decodeURIComponent($("#add_table_form").serialize());
   console.log(pam);
   $.ajax({
    url:'/plan/add/',
    type : "Post",
    async: false,
    data: pam,
    dataType: 'json',
    success:function(data)
    {
      var Data = data["msg"];
      var Status = data["status"];
      if (Status===0){
        window.location.href = "/plan/"+data["data"]["plan"]+"/addcase"; 
      }
      else{
        $me.html(Data);
        $mess.modal({
         keyboard: true
       }); 
      }           
    },
    error:function(data)
    {
      $me.html("系统异常！");
      $mess.modal({
       keyboard: true
     });
    }
  });
 }
}