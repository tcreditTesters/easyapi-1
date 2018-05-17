// 点击测试按钮轮询方法
function api_testcase_test(){
	let api_no = $("#api_id").attr("data-id");
	let case_no = $("#case_id").attr("data-id");
	let env = $("#get_env option:selected").attr("value");
	console.log(env);
	// let v_count = $("#tab_validations_form").children("div").length;
	let $btn = $("#testButton").button('loading');
	let interval = setInterval(function(){
		$.ajax({
			type : "Post",
			url : "/api/casetest/"+case_no+"/",
			data: {"case_no":case_no,"env":env},
			dataType : "json",
			async : false,
			success : function(data) {
				let result = data["result"];
				let mes = data["message"];
				let html = [];
				let mainObj = $('#tab_validations_form');
				if(data["status"] === 0){
					console.log("111");
					clearInterval(interval);
					//处理测试结果；
					let count = result["count"];
					let response = JSON.stringify(data["result"]["response"]);
					$("#case_response").html(response);
					for (var i = 0; i < count; i++) {
						let desc = result["vals"][i]["is_pass"];
						if (desc == 1) {
							html.push('<div class="form-group case_info_detail" id="validations_area">');
							html.push('<span class="key_name">'+result["vals"][i]["key"]+'</span>');
							html.push('<span class="key_value">'+result["vals"][i]["exp_value"]+'</span>');
							html.push('<span class="key_result">'+result["vals"][i]["value"]+'</span>');
							html.push('<span class="pull-right"><i class="fa fa-check-circle" aria-hidden="true"></i></span>');
							html.push('</div>');
						}
						else{
							html.push('<div class="form-group case_info_detail" id="validations_area">');
							html.push('<span class="key_name">'+result["vals"][i]["key"]+'</span>');
							html.push('<span class="key_value">'+result["vals"][i]["exp_value"]+'</span>');
							html.push('<span class="key_result">'+result["vals"][i]["value"]+'</span>');
							html.push('<span class="pull-right"><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span>');
							html.push('</div>');
						}
				 	}
					$btn.button('reset');
					mainObj.empty();
					mainObj.html(html.join(''));
				} 
				else {
					clearInterval(interval);
					$("#error_mess").html(mes);
					$("#confirm_error").slideDown();
					$btn.button('reset');
				}
			},
			error : function(data) {
				 clearInterval(interval);
				 $("#error_mess").html("Oops!系统异常了");
				 $("#confirm_error").slideDown();
				 $btn.button('reset');
			}
		});
	}, 100);
}