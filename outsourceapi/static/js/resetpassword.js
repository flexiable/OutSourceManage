var isFastClick = false,isFirstClick = true;
$(function () {
	$(document).on("change","#pswShow",function () {
		if ($("#Password").attr("type") == "password") {
			$("#Password").attr("type","text");
		} else{
			$("#Password").attr("type","password");
		}
	})
	$(document).on("change","#cfpswShow",function () {
		if ($("#ConfirmPassword").attr("type") == "password") {
			$("#ConfirmPassword").attr("type","text");
		} else{
			$("#ConfirmPassword").attr("type","password");
		}
	})
	$(document).on("click",".btn",function (e) {
		if (isFirstClick) {
			var inpVal = null;
			/*新密码输入框*/
			inpVal = $("#Password").val().replace(/\s/g,"");
			$("#Password").val(inpVal);
			if (inpVal == null || inpVal == undefined || inpVal == "") {
				msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "pswNull"}));
				$(".text-danger").html(msg);
				return false;
			}
			if (inpVal.length < 6 || inpVal.length > 20) {
				msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "pswLengthError"}));
				$(".text-danger").html(msg);
				return false;
			}
			if (!(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[\^\!\@\#\$\%\&\*\(\)\_\-\=\+\/\?\.\,\<\>\;\:\~]).{6,20}$/).test(inpVal)) {
				msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "pswFormatError"}));
				$(".text-danger").html(msg);
				return false;
			}
			/*检测新密码是否与旧密码相同*/
			msg = VerifyOldPsw(inpVal);
			if (msg.status == "0") {
				$(".text-danger").html(msg.msg);
				return false;
			}
			/*确认密码输入框*/
			inpVal = $("#ConfirmPassword").val().replace(/\s/g,"");
			$("#ConfirmPassword").val(inpVal);
			if (inpVal == null || inpVal == undefined || inpVal == "") {
				msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "confirmPswNull"}));
				$(".text-danger").html(msg);
				return false;
			}
			if (inpVal != $("#Password").val()) {
				msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "newAndConfirmNotMatch"}));
				$(".text-danger").html(msg);
				return false;
			}
			/*验证码输入框*/
			inpVal = $("#Code").val();
			if ($("#TMMVCode").val() == "" || $("#TMMVCode").val() == null) {
				msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "graphicCodeNull"}));
				$(".text-danger").html(msg);
				$("#TMMV_code img").attr("src", zwsoft.sendGraphicCode());
				return false;
			}
			if (inpVal == null || inpVal == undefined || inpVal == "") {
				msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "CodeNull"}));
				$(".text-danger").html(msg);
				return false;
			}
			if (!(/^\d+$/.test(inpVal))) {
				msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "CodeFormatError"}));
				$(".text-danger").html(msg);
				return false;
			}
			$(this).attr("disabled", true);
			CheckVerificationCode($(this));
			return false;
		}
	})
	$(document).on("click","#SendCode",function () {
		var Graphic = $("#TMMVCode").val();
		if(Graphic == null || Graphic == ""){
			msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "GraphicCodeNull"}));
			$(".text-danger").html(msg);
			return false;
		}
		var opt = {
			accountNumber: $(".zwsoft-userNumber").val(),
			graphic: Graphic,
			btn: $(this),
			switchBtn: null
		}
		zwsoft.SendIdentifycode(opt);
	})
})
var JudgeAjax = function (type, urls, data) {
	/*
	 * url："/v1.0/Api/Judge/ResetPasswordError"
	 * data值(要传字符串json)：{errname: xxx}	
	 * 						pswNull（密码输入框为空）
	 * 						pswLengthError（密码位数不足或超出报错）
	 * 						pswFormatError（密码格式错误）
	 * 						CodeNull（验证码输入框为空）
	 * 						CodeFormatError（输入的验证码格式错误）
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
var VerifyOldPsw = function (psw) {
	var msg = null;
	var VerifyInfo = {
		oldpsw: psw,
		accountNumber: $("#Username").val(),
		__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
	}
	$.ajax({
		type:"post",
		url:"/v1.0/Api/User/VerifyOldPsw",
		dataType: "json",
		data: VerifyInfo,
		success: function (ret) {
			msg = ret
		},
		error: function (error) {
			console.log(error);
			return "error";
		},
		async:false
	});
	return msg;
}
var CheckVerificationCode = function (btnEl) {
	var CheckInfo = {
		IsEmailOrTelphone: $("#IsEmailOrTelphone").val(),
		Code: $("#Code").val(),
		graphic: $("#TMMVCode").val(),
		userNumber: $(".zwsoft-userNumber").val(),
		countryCode: $(".zwsoft-countryCode").val(),
		graphic_token: window.sessionStorage.getItem("graphic_token"),
		__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
	}
	$.ajax({
		type:"post",
		url:"/v1.0/Api/User/CheckVerificationCode",
		dataType: "json",
		data: CheckInfo,
		success: function (ret) {
			if (ret.status == "1") {
				isFirstClick = false;
				ResetAccountPassword(btnEl);
			} else{
				isFirstClick = true;
				zwsoft.toast(ret.msg, "errorColor");
				if (ret.status == "2") {
					$("#TMMV_code img").attr("src", zwsoft.sendGraphicCode());
				}
				btnEl.removeAttr("disabled");
			}
		},
		error: function (error) {
			/*console.log(error);*/
			isFirstClick = true;
			btnEl.removeAttr("disabled");
		},
		async:false
	});
}
var ResetAccountPassword = function (btnEl) {
	var newInfo = {
		username: $("#Username").val(),
		newPassword: $("#Password").val(),
		returnUrl: $("#returnUrl").val(),
		__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
	}
	$.ajax({
		type:"post",
		url:"/v1.0/Api/User/ResetAccountPassword",
		dataType: "json",
		data: newInfo,
		success: function (ret) {
			if (ret.status == "1") {
				zwsoft.toast(ret.msg, "successColor");
				sessionStorage.setItem("sendBtnTime_i", 0);
				setTimeout(function () {
					window.location.href = ret.data.returnUrl;
				},3600)
			} else{
				zwsoft.toast(ret.msg, "errorColor");
				isFirstClick = true;
				btnEl.removeAttr("disabled");
				setTimeout(function () {
				},1000);
			}
		},
		error: function (error) {
			/*console.log(error);*/
			if (error.status == 404) {
				if (error.responseJSON.error.innerError.code == "1") {
					zwsoft.toast(error.responseJSON.error.innerError.message, "errorColor");
				}
			}
			isFirstClick = true;
			btnEl.removeAttr("disabled");
		},
		async:false
	});
}