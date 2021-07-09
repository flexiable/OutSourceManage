var IsFirstClick_security = true,IsFastClick_security = false;
$(function () {
	var msg = null;
	/* 安全认证区 */
	var routeLink = window.location.href;
	var tempAuths = JSON.parse(sessionStorage.getItem(".AspNetCore.Auth"));
	if ($("#OpenFloatName").val() != "BingPhoneGetCode"){
		if (tempAuths && 
			$("#IsAuthstr").val() != tempAuths.IsAuth && 
			$("#IsAuthstr").val() != null && 
			$("#IsAuthstr").val() != "") {
			sessionStorage.setItem(".AspNetCore.Auth", JSON.stringify({IsAuth: $("#IsAuthstr").val(), timer: tempAuths.timer}));
			tempAuths = JSON.parse(sessionStorage.getItem(".AspNetCore.Auth"));
		}
		if (tempAuths && routeLink.indexOf("IsAuth") < 0) {
			if ($("#IsAuthstr").val() == null || $("#IsAuthstr").val() == "") {
				sessionStorage.removeItem(".AspNetCore.Auth");
				return false;
			}
			window.location.href = "/UserCenter/Security?tid=" + tempAuths.timer + "&IsAuth=" + encodeURIComponent(tempAuths.IsAuth);
			return false;
		}
		if (tempAuths && routeLink.indexOf("IsAuth") > -1) {
			var hrefInfoArr = window.location.href.split("?")[1].split("&");
			for (var i in hrefInfoArr) {
				if (hrefInfoArr[i].indexOf("IsAuth") > -1) {
					if (hrefInfoArr[i].split("=")[1] == "" || hrefInfoArr[i].split("=")[1] == undefined) {
						window.location.href = "/UserCenter/Security?tid=" + tempAuths.timer + "&IsAuth=" + encodeURIComponent(tempAuths.IsAuth);
						return false;
					}
				}
			}
		}
		if (!tempAuths && routeLink.indexOf("IsAuth") > -1){
			window.location.href = "/UserCenter/Security";
			return false;
		}
	}
	/* == end == */
	$(document).on("input", ".form-group input", function (e) {
		$(".text-danger").html("");
		if ($(this)[0].id == "tempPhone" || $(this)[0].id == "code") {
			if (e.originalEvent.data == " ") {
				e.target.value = e.target.value.split(" ").join("");
				return false;
			}
			if (!/\d/.test(e.originalEvent.data)) {
				e.target.value = e.target.value.split(e.originalEvent.data).join("");
				return false;
			}
		}
		if ($(this)[0].id == "oldPassword" || $(this)[0].id == "tempPassword" || $(this)[0].id == "tempPassword_confirm") {
			$("#securitySubmit[value=ResetPasswordSubmit]").removeAttr("disabled");
		}
	})
	$(".zwsoft-Security").on("click", ".form-group button", function (e) {
		if (IsFirstClick_security) {
			var inpVal = null;
			var obj = null;
			if ($(this)[0].name == "security") {
				/*计时器初始化*/
				if ($(this).val() == "ResetUsrName" ||
					$(this).val() == "ResetEmail" ||
					$(this).val() == "ResetTelphone" ||
					$(this).val() == "ResetPassword" ||
					$(this).val() == "AuthenSetting" ||
					$(this).val() == "Destroy") {
					sessionStorage.setItem("sendBtnTime_i", 0);
				}
				/*提交按钮*/
				/* 1.绑定手机   2.修改手机*/
				if ($(this).val() == "BingPhoneGetCode" ||
					$(this).val() == "ResetTelphoneToGetCodeNext") {
					inpVal = $("#tempPhone").val();
					if (inpVal.length != 11) {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "phoneFormatError"}));
						$(".text-danger").html(msg);
						return false;
					}
					if (!(/^1[3456789]\d{9}$/.test(inpVal))) {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "phoneFormatError"}));
						$(".text-danger").html(msg);
						return false;
					}
				}
				
				/*
				 * 检测验证码：
				 * 1. 绑定手机    2.首次登陆验证    3.修改手机    4.修改邮箱    5.修改密码
				 */
				if ($(this).val() == "BingNewPhoneSubmit" ||
					$(this).val() == "VerifyPhoneSubmit" ||
					$(this).val() == "ResetTelphoneSubmit" ||
					$(this).val() == "ResetEmailSubmit" ||
					$(this).val() == "AuthenSettingNext") {
					inpVal = $("#code").val();
					if ($("#TMMVCode").val() == "" || $("#TMMVCode").val() == null) {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "graphicCodeNull"}));
						$(".text-danger").html(msg);
						$("#TMMV_code img").attr("src", zwsoft.sendGraphicCode());
						return false;
					}
					if (inpVal == null || inpVal == "") {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "CodeNull"}));
						$(".text-danger").html(msg);
						return false;
					}
				}
				
				
				/*绑定手机后，短信验证 提交*/
				if ($(this).val() == "VerifyPhoneSubmit"){
					msg = VerifyPhone($("#tempAccount").val());
					if (msg == "success") {
						$(this).attr("disabled", true);
						securitySettingAjax(
							"post", 
							"/v1.0/Api/User/CheckVerificationCodeHasToken",
							JSON.stringify({
								IsEmailOrTelphone: $("#IsEmailOrTelphone").val(),
								code: $("#code").val(),
								graphic: $("#TMMVCode").val(),
								userNumber: $("#tempAccount").val(),
								OpenFloatName: $("#OpenFloatName").val(),
								graphic_token: window.sessionStorage.getItem("graphic_token"),
								__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
							}),
							$(this),
							"Verify"
						);
						return true;
					}
					$(".text-danger").html(msg);
					return false;
				}
				
				/*修改手机*/
				if($(this).val() == "ResetTelphoneSubmit"){
					$(this).attr("disabled", true);
					securitySettingAjax(
						"post", 
						"/v1.0/Api/User/SetTelphoneNumber",
						JSON.stringify({
							phoneNumber: $("#tempAccount").val().replace(/\s/g,""),
							code: $("#code").val().replace(/\s/g,""),
							graphic: $("#TMMVCode").val(),
							graphic_token: window.sessionStorage.getItem("graphic_token"),
							tid: $("#tid").val(),
							AuthenType: $("#IsDoubleAuthentication").val() == "True"? "ON":"OFF",
							__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
						}),
						$(this)
					);
					return false;
				}
				
				/*修改用户名*/
				if($(this).val() == "ResetUsrNameSubmit"){
					$(this).attr("disabled", true);
					securitySettingAjax(
						"post",
						"/v1.0/Api/User/SetUserName",
						JSON.stringify({
							username: $("#tempName").val().replace(/\s/g,""),
							tid: $("#tid").val(),
							AuthenType: $("#IsDoubleAuthentication").val() == "True"? "ON":"OFF",
							__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
						}),
						$(this)
					);
					return false;
				}
				
				/*修改邮箱*/
				if ($(this).val() == "ResetEmailSubmit") {
					$(this).attr("disabled", true);
					securitySettingAjax(
						"post",
						"/v1.0/Api/User/ResetEmail",
						JSON.stringify({
							email: $("#tempAccount").val().replace(/\s/g,""),
							code: $("#code").val().replace(/\s/g,""),
							graphic: $("#TMMVCode").val(),
							graphic_token: window.sessionStorage.getItem("graphic_token"),
							tid: $("#tid").val(),
							AuthenType: $("#IsDoubleAuthentication").val() == "True"? "ON":"OFF",
							__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
						}),
						$(this)
					);
					return false;
				}
				
				/*修改密码*/
				if ($(this).val() == "ResetPasswordSubmit") {
					/*检测是否输入旧密码*/
					inpVal = $("#oldPassword").val().replace(/\s/g,"");
					$("#oldPassword").val(inpVal);
					$(this).attr("disabled", true);
					if (inpVal == null || inpVal == undefined || inpVal == "") {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "oldPswNull"}));
						$(".text-danger").html(msg);
						return false;
					}
					/*检测旧密码是否输入正确*/
					obj = VerifyOldPsw(inpVal);
					if (obj.status != "1") {
						$(this).removeAttr("disabled");
						$(".text-danger").html(obj.msg);
						return false;
					}
					/*检测是否输入新密码*/
					inpVal = $("#tempPassword").val().replace(/\s/g,"");
					$("#tempPassword").val(inpVal);
					if (inpVal == null || inpVal == undefined || inpVal == "") {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "newPswNull"}));
						$(".text-danger").html(msg);
						return false;
					}
					/*检测输入的密码位数是否合规*/
					if (inpVal.length < 6 || inpVal.length > 20) {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "pswLengthError"}));
						$(".text-danger").html(msg);
						return false;
					}
					/*检测输入的密码强度是否合规*/
					if (!(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[\^\!\@\#\$\%\&\*\(\)\_\-\=\+\/\?\.\,\<\>\;\:\~]).{6,20}$/).test(inpVal)) {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "pswFormatError"}));
						$(".text-danger").html(msg);
						return false;
					}
					/*检测输入的新密码是否与旧密码相同*/
					if (inpVal == $("#oldPassword").val()) {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "oldAndNewSame"}));
						$(".text-danger").html(msg);
						return false;
					}
					/*检测是否输入确认密码*/
					inpVal = $("#tempPassword_confirm").val().replace(/\s/g,"");
					$("#tempPassword_confirm").val(inpVal);
					if (inpVal == null || inpVal == undefined || inpVal == "") {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "confirmPswNull"}));
						$(".text-danger").html(msg);
						return false;
					}
					/*检测确认密码是否与新密码相同*/
					if (inpVal != $("#tempPassword").val()) {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "newAndConfirmNotMatch"}));
						$(".text-danger").html(msg);
						return false;
					}
					securitySettingAjax(
						"post",
						"/v1.0/Api/User/ChangePassword",
						JSON.stringify({
							phone: $("#tempAccount").val(),
							code: $("#code").val(),
							graphic: $("#TMMVCode").val(),
							graphic_token: window.sessionStorage.getItem("graphic_token"),
							psw: $("#tempPassword").val(),
							tid: $("#tid").val(),
							AuthenType: $("#IsDoubleAuthentication").val() == "True"? "ON":"OFF",
							__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
						}),
						$(this)
					);
					return false;
				}
				
				/*开启双重认证前验证手机号*/
				if ($(this).val() == "AuthenSettingNext" && $("#IsDoubleAuthentication").val() != "True") {
					securitySettingAjax(
						"post",
						"/v1.0/Api/User/SetAuthenVerify",
						JSON.stringify({
							types: $("#IsDoubleAuthentication").val() == "True"? "ON":"OFF",
							btnName: $(this).val(),
							phone: $("#tempAccount").val(),
							code: $("#code").val(),
							graphic: $("#TMMVCode").val(),
							graphic_token: window.sessionStorage.getItem("graphic_token"),
							tid: $("#tid").val(),
							__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
						}),
						$(this)
					);
					return false;
				}
				if ($(this).val() == "AuthenSettingSubmit") {
					securitySettingAjax(
						"post",
						"/v1.0/Api/User/SetAuthen",
						JSON.stringify({
							AuthenType: $("#IsDoubleAuthentication").val() == "True"? "OFF":"ON",
							__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
						})
					);
					return false;
				}
				/*关闭双重认证前验证手机号*/
				if ($(this).val() == "AuthenSettingNext" && $("#IsDoubleAuthentication").val() == "True") {
					securitySettingAjax(
						"post",
						"/v1.0/Api/User/CheckVerificationCode",
						JSON.stringify({
							userNumber: $("#tempAccount").val(),
							IsEmailOrTelphone: "telphone",
							code: $("#code").val(),
							graphic: $("#TMMVCode").val(),
							graphic_token: window.sessionStorage.getItem("graphic_token"),
							__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
						}),
						$(this)
					);
					return false;
				}
				/*未开启双重认证，注销账户  下一步*/
				if ($(this).val() == "DestroyNext" && $("#IsDoubleAuthentication").val() != "True") {
					securitySettingAjax(
						"post",
						"/v1.0/Api/User/NotOpenAuthToDestroy",
						JSON.stringify({
							btnName: $(this).val(),
							phone: $("#tempAccount").val(),
							code: $("#code").val(),
							graphic: $("#TMMVCode").val(),
							graphic_token: window.sessionStorage.getItem("graphic_token"),
							tid: $("#tid").val(),
							__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
						}),
						$(this)
					);
					return false;
				}
				/*注销账户*/
				if ($(this).val() == "DestroySubmit") {
					securitySettingAjax(
						"post",
						"/v1.0/Api/User/Destroy",
						JSON.stringify({
							tid: $("#tid").val(),
							__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
						}),
						null,
						"Destroy"
					);
					return false;
				}
				/*验证邮箱格式*/
				if ($(this).val() == "ResetEmailToGetCodeNext") {
					inpVal = $("#tempEmail").val().replace(/\s/g,"");
					$("#tempEmail").val(inpVal);
					if (!(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(inpVal))) {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "emailFormatError"}));
						$(".text-danger").html(msg);
						return false;
					}
					if (INDEXOF(inpVal, "@") > 1) {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "emailFormatError"}));
						$(".text-danger").html(msg);
						return false;
					}
					if (INDEXOF(inpVal, ".") > 2) {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "emailFormatError"}));
						$(".text-danger").html(msg);
						return false;
					}
				}
				/*验证用户名格式*/
				if ($(this).val() == "ResetUsrNameNext") {
					inpVal = $("#tempName").val().replace(/\s/g,"");
					$("#tempName").val(inpVal);
					if (!(/^\w{4,16}$/.test(inpVal))) {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/Editor", JSON.stringify({errorname: "userNameFormatError"}));
						$(".text-danger").html(msg);
						return false;
					}
				}
			}
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
			accountNumber: $("#tempAccount").val(),
			graphic: Graphic,
			btn: $(this),
			switchBtn: $("#SwitchAccount")
		}
		zwsoft.SendIdentifycode(opt);
	})
})
var JudgeAjax = function (type, urls, data) {
	/*
	 * url：/v1.0/Api/Judge/RegisterError"
	 * data值(要传字符串json)：{errname: xxx}	
	 * 			errname值：	emailNameNull（邮箱账号输入框为空）
	 * 						phoneNameNull（邮箱账号输入框为空）
	 * 						emailFormatError（邮箱账号格式错误）
	 * 						phoneFormatError（手机号账号格式错误）
	 * 						pswNull（密码输入框为空）
	 * 						pswLengthError（密码位数不足或超出报错）
	 * 						pswFormatError（密码格式错误）
	 * 						lastNameNull（姓氏输入框为空）
	 * 						firstNameNull（名字输入框为空）
	 * 						NameFormatError（输入的姓名格式错误）
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
var securitySettingAjax = function (type, urls, data, btn = null, Auth = null) {
	/*
	 * btn: 点击的按钮
	 * type: 请求类型
	 * urls: 接口地址
	 * data: json字符串
	 */
	$.ajax({
		type: type,
		url: urls,
		dataType: "json",
		data: JSON.parse(data),
		success: function (ret) {
			if (ret.status == "1") {
				sessionStorage.setItem("sendBtnTime_i", 0);
				if (ret.msg != "success") {
					zwsoft.toast(ret.msg, "successColor");
				}
				if (Auth == "Destroy") {
					sessionStorage.removeItem(".AspNetCore.Auth");
					setTimeout(function () {
						window.location.href = ret.data.returnUrl;
					},2000);
					return false;
				}
				if (ret.data.otherInfo == "next"){
					IsFirstClick_security = false;
					btn.removeAttr("disabled");
					btn.click();
					return false;
				}
				if (ret.data.otherInfo == "success") {
					sessionStorage.removeItem(".AspNetCore.Auth");
					setTimeout(function () {
						window.location.href = "/UserCenter/Security";
					},1000);
					return false;
				}
				if (ret.data.auth_token && ret.data.auth_token != "") {
					var tempAuth = ret.data.auth_token.split(":");
					sessionStorage.setItem(".AspNetCore.Auth", JSON.stringify({IsAuth: tempAuth[1], timer: tempAuth[0]}));
					if (btn) {

						$("#IsAuthstr").val(tempAuth[1]);
					
						setTimeout(function () {
							window.location.href = "/UserCenter/Security?tid=" + tempAuth[0] + "&IsAuth=" + encodeURIComponent(tempAuth[1]);
						},1000);
					}else{
						window.location.href = "/UserCenter/Security?tid=" + tempAuth[0] + "&IsAuth=" + encodeURIComponent(tempAuth[1]);
					}
				}
			} else{
				zwsoft.toast(ret.msg, "errorColor");
				if (ret.status == "2") {
					$("#TMMV_code img").attr("src", zwsoft.sendGraphicCode());
				}
				btn.removeAttr("disabled");
			}
		},
		error: function (error) {
			/*console.log(error);*/
		},
		async:true
	});
}
var VerifyPhone = function (accountNumber) {
	var msg = null;
	$.ajax({
		type:"post",
		url:"/v1.0/Api/User/VerifyPhone",
		dataType: "json",
		data: {
			accountNumber: accountNumber,
			__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
		},
		success: function (ret) {
			msg = ret.msg;
		},
		error: function (error) {
			/*console.log(error);*/
		},
		async:false
	});
	return msg;
}
var VerifyOldPsw = function (psw) {
	var msg = null;
	$.ajax({
		type:"post",
		url:"/v1.0/Api/User/VerifyOldPsw",
		dataType: "json",
		data: {
			oldpsw: psw,
			__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
		},
		success: function (ret) {
			msg = ret;
		},
		error: function (error) {
			/*console.log(error);*/
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