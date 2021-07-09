$(function () {
	var IsFirstClick = true, IsFastClick = false;
	var msg = null;
	$(document).on("input", ".form-group input", function (e) {
		$(".text-danger").html("");
	})
	$(document).on("change","#pswShow",function () {
		if ($("#Password").attr("type") == "password") {
			$("#Password").attr("type","text");
		} else{
			$("#Password").attr("type","password");
		}
	})
	$(document).on("click", ".unameclick button", function (e) {
		if (IsFirstClick) {
			var userName = $("#Username").val();
			if (userName == null || userName == undefined || userName == "") {
				/*请求接口*/
				msg = JudgeAjax("get", "/v1.0/Api/Judge/LoginError", JSON.stringify({errname: "nameNull"}));
				$(".text-danger").html(msg);
				return false;
			}
			if (!(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(userName))) {
				if (!(/^1[3456789]\d{9}$/.test(userName))) {
					if (!(/^\w{4,16}$/.test(userName))) {
						/*请求接口*/
						msg = JudgeAjax("get", "/v1.0/Api/Judge/LoginError", JSON.stringify({errname: "FormatError"}));
						$(".text-danger").html(msg);
						return false;
					}
				}
			}
			if (INDEXOF(userName, "@") > 1) {
				msg = JudgeAjax("get", "/v1.0/Api/Judge/LoginError", JSON.stringify({errname: "emailFormatError"}));
				$(".text-danger").html(msg);
				return false;
			}
			if (INDEXOF(userName, ".") > 2) {
				msg = JudgeAjax("get", "/v1.0/Api/Judge/LoginError", JSON.stringify({errname: "emailFormatError"}));
				$(".text-danger").html(msg);
				return false;
			}
			IsFirstClick = false;
		}
	})
	$(document).on("click", ".pswclick button", function (e) {
		if (IsFirstClick) {
			if ($("#IsOpenCode").val() != "True") {
				var userPassword = $("#Password").val();
				if (userPassword == null || userPassword == undefined || userPassword == "") {
					/*请求接口*/
					msg = JudgeAjax("get", "/v1.0/Api/Judge/LoginError", JSON.stringify({errname: "pswNull"}));
					$(".text-danger").html(msg);
					return false;
				}
			}
			if ($("#IsOpenTMMVCode").val() == "True") {
				var TMMVCode = $("#TMMVCode").val();
				if (TMMVCode == null || TMMVCode == undefined || TMMVCode == "") {
					msg = JudgeAjax("get", "/v1.0/Api/Judge/LoginError", JSON.stringify({errname: "GraphicCodeNull"}));
					$(".text-danger").html(msg);
					return false;
				}
				if ($(".TMMV i")[0].className != "success") {
					msg = JudgeAjax("get", "/v1.0/Api/Judge/LoginError", JSON.stringify({errname: "GraphicCodeError"}));
					$(".text-danger").html(msg);
					return false;
				}
			}
			if ($("#IsOpenCode").val() == "True") {
				var CodeNumber = $("#Code").val();
				if (CodeNumber == null || CodeNumber == undefined || CodeNumber == "") {
					msg = JudgeAjax("get", "/v1.0/Api/Judge/LoginError", JSON.stringify({errname: "CodeNull"}));
					$(".text-danger").html(msg);
					return false;
				}
			}
			IsFirstClick = false;
		}
	})
	/*发送验证码*/
	$(document).on("click","#SendCode",function () {
		var Graphic = $("#TMMVCode").val();
		if(Graphic == null || Graphic == ""){
			msg = JudgeAjax("get", "/v1.0/Api/Judge/LoginError", JSON.stringify({errname: "GraphicCodeNull"}));
			$(".text-danger").html(msg);
			return false;
		}
		var emailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g;
		var phoneReg = /^1[3456789]\d{9}$/g;
		if (!emailReg.test($("#Username").val()) && !phoneReg.test($("#Username").val())) {
			msg = JudgeAjax("get", "/v1.0/Api/Judge/LoginError", JSON.stringify({errname: "userNumberError"}));
			$(".text-danger").html(msg);
			return false;
		}
		var opt = {
			accountNumber: $("#Username").val(),
			graphic: Graphic,
			btn: $(this),
			switchBtn: null
		}
		zwsoft.SendIdentifycode(opt);
	})
	/*初始化图形验证码按钮*/
	if ($("#IsOpenTMMVCode").val() == "True") {
		$("#TMMV_code img").attr("src", zwsoft.sendGraphicCode());
		$("#TMMVCode").val("");
		$("#graphic_token").val(window.sessionStorage.getItem("graphic_token"));
	}
	if ($("#ClientId").val() == "Cadpockets"){
		console.log("进来了")
		$("#goback").hide();
	}
})
var JudgeAjax = function (type, urls, data) {
	/*
	 * url："/v1.0/Api/Judge/LoginError"
	 * data值(要传字符串json)：{errname: xxx}
	 * 			errname值：	nameNull（账号输入框为空）
	 * 						FormatError（账号格式错误）
	 * 						pswNull（密码输入框为空）
	 * 						emailFormatError（邮箱格式错误）
	 */
	var msg = null;
	$.ajax({
		type: type,
		url: urls,
		dataType: "json",
		data: JSON.parse(data),
		success: function (ret) {
			msg = ret.msg;
		},
		error: function (error) {
			/*console.log(error);*/
			return "error";
		},
		async:false
	});
	return msg;
}
var INDEXOF = function (str, chr) {
	var sum = 0;
	for (var i in str) {
		if (str[i].indexOf(chr) > -1) {
			sum++;
		}
	}
	return sum;
}