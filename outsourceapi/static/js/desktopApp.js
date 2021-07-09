$(function () {
	var isFirstClick = true;
	var canClickAccountSwitchBtn = true;
	/*验证账户模块*/
	$(document).on("click","#SendCode",function () {
		var Graphic = $("#TMMVCode").val();
		var tempAccount = $("#tempAccount").val();
		if (tempAccount == null || tempAccount == "") {
			return false;
		}
		if(Graphic == null || Graphic == ""){
			msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "GraphicCodeNull"}));
			$(".text-danger").html(msg);
			return false;
		}
		var opt = {
			accountNumber: $("#tempAccount").val(),
			graphic: Graphic,
			btn: $(this),
			switchBtn: $(".Account button")
		}
		zwsoft.SendIdentifycode(opt);
		canClickAccountSwitchBtn = false;
	})
	$(document).on("click", "#SubmitVerity", function () {
		if (isFirstClick) {
			$(this).attr("disabled", true);
			var verityStatus = VerifyCode($(this));
			if (verityStatus == "Successed") {
				$(this).removeAttr("disabled");
				isFirstClick = false;
				$(this).click();
			} else{
				$(this).removeAttr("disabled");
				isFirstClick = true;
			}
			return false;
		}
		isFirstClick = true;
	})
	$(document).on("click", ".Verify .Account button", function () {
		if ($(this)[0].className.indexOf("SwitchActive") > -1) {
			console.log($(this));
			return false;
		}
	})
	/**
	 * 修改安全信息模块：
	 * （一）监听邮箱输入框
	 */
	$(document).on("keyup", "#newEmail, #newPhone", function () {
		$(".text-danger").html(null);
		$("#TMMVCode").removeAttr("disabled");
		$("#code").removeAttr("disabled");
	})
	$(document).on("change", "#newEmail", function () {
		var inpVal = $(this).val().replace(/\s/g,"");
		$(this).val(inpVal);
		if (inpVal == null || inpVal == undefined || inpVal == "") {
			msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "emailNameNull"}));
			$(".text-danger").html(msg);
			$("#submitSecurity").attr("disabled", true);
			$("#TMMVCode").attr("disabled", true);
			$("#code").attr("disabled", true);
			return false;
		}
		if (!(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(inpVal))) {
			msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "emailFormatError"}));
			$(".text-danger").html(msg);
			$("#submitSecurity").attr("disabled", true);
			$("#TMMVCode").attr("disabled", true);
			$("#code").attr("disabled", true);
			return false;
		}
		if (INDEXOF(inpVal, "@") > 1) {
			msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "emailFormatError"}));
			$(".text-danger").html(msg);
			$("#submitSecurity").attr("disabled", true);
			$("#TMMVCode").attr("disabled", true);
			$("#code").attr("disabled", true);
			return false;
		}
		if (INDEXOF(inpVal, ".") > 2) {
			msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "emailFormatError"}));
			$(".text-danger").html(msg);
			$("#submitSecurity").attr("disabled", true);
			$("#TMMVCode").attr("disabled", true);
			$("#code").attr("disabled", true);
			return false;
		}
		/*检测账号是否已被注册*/
		msg = IsUsrExists(inpVal);
		if (msg.status == "0") {
			$(".text-danger").html(msg.msg);
			$("#tempAccount").val(null);
			$("#submitSecurity").attr("disabled", true);
			$("#TMMVCode").attr("disabled", true);
			$("#code").attr("disabled", true);
			return false;
		}
		$("#tempAccount").val($(this).val());
		$("#submitSecurity").removeAttr("disabled");
	})
	/**
	 * 修改安全信息模块：
	 * （二）监听手机号输入框
	 */
	$(document).on("change", "#newPhone", function () {
		var inpVal = $(this).val().replace(/\s/g,"");
		$(this).val(inpVal);
		if (inpVal == null || inpVal == undefined || inpVal == "") {
			msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "phoneNameNull"}));
			$(".text-danger").html(msg);
			$("#submitSecurity").attr("disabled", true);
			$("#TMMVCode").attr("disabled", true);
			$("#code").attr("disabled", true);
			return false;
		}
		if (!(/^1[3456789]\d{9}$/.test(inpVal))) {
			msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "phoneFormatError"}));
			$(".text-danger").html(msg);
			$("#submitSecurity").attr("disabled", true);
			$("#TMMVCode").attr("disabled", true);
			$("#code").attr("disabled", true);
			return false;
		}
		/*检测账号是否已被注册*/
		msg = IsUsrExists(inpVal);
		if (msg.status == "0") {
			$(".text-danger").html(msg.msg);
			$("#tempAccount").val(null);
			$("#submitSecurity").attr("disabled", true);
			$("#TMMVCode").attr("disabled", true);
			$("#code").attr("disabled", true);
			return false;
		}
		$("#tempAccount").val($(this).val());
		$("#submitSecurity").removeAttr("disabled");
	})
	/**
	 * 修改安全信息模块：
	 * （三）监听保存按钮
	 */
	$(document).on("click", "#submitSecurity", function () {
		switch ($("#popupType").val()){
			case "editEmail":
				/* 修改邮箱 */
				if ($("#newEmail").val() == null || $("#newEmail").val() == "") {
					msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "emailNameNull"}));
					$(".text-danger").html(msg);
					$("#submitSecurity").attr("disabled", true);
					return false;
				}
				if (isFirstClick) {
					$(this).attr("disabled", true);
					var verityStatus = VerifyCode($(this));
					if (verityStatus == "Successed") {
						$(this).removeAttr("disabled");
						isFirstClick = false;
						$(this).click();
					} else{
						$(this).removeAttr("disabled");
						isFirstClick = true;
					}
					return false;
				}
				isFirstClick = true;
				break;
			case "editPhone":
				/* 修改手机 */
				if ($("#newPhone").val() == null || $("#newPhone").val() == "") {
					msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "phoneNameNull"}));
					$(".text-danger").html(msg);
					$("#submitSecurity").attr("disabled", true);
					return false;
				}
				if (isFirstClick) {
					$(this).attr("disabled", true);
					var verityStatus = VerifyCode($(this));
					if (verityStatus == "Successed") {
						$(this).removeAttr("disabled");
						isFirstClick = false;
						$(this).click();
					} else{
						$(this).removeAttr("disabled");
						isFirstClick = true;
					}
					return false;
				}
				isFirstClick = true;
				break;
			case "editPsw":
				/* 修改密码 */
				var inpVal = null;
				/*检测是否输入旧密码*/
				inpVal = $("#oldPassword").val().replace(/\s/g,"");
				$("#oldPassword").val(inpVal);
				$(this).attr("disabled", true);
				if (inpVal == null || inpVal == undefined || inpVal == "") {
					msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "oldPswNull"}));
					$(".text-danger").html(msg);
					$(this).removeAttr("disabled");
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
				inpVal = $("#newPassword").val().replace(/\s/g,"");
				$("#newPassword").val(inpVal);
				if (inpVal == null || inpVal == undefined || inpVal == "") {
					msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "newPswNull"}));
					$(".text-danger").html(msg);
					$(this).removeAttr("disabled");
					return false;
				}
				/*检测输入的密码位数是否合规*/
				if (inpVal.length < 6 || inpVal.length > 20) {
					msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "pswLengthError"}));
					$(".text-danger").html(msg);
					$(this).removeAttr("disabled");
					return false;
				}
				/*检测输入的密码强度是否合规*/
				if (!(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[\^\!\@\#\$\%\&\*\(\)\_\-\=\+\/\?\.\,\<\>\;\:\~]).{6,20}$/).test(inpVal)) {
					msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "pswFormatError"}));
					$(".text-danger").html(msg);
					$(this).removeAttr("disabled");
					return false;
				}
				/*检测输入的新密码是否与旧密码相同*/
				if (inpVal == $("#oldPassword").val()) {
					msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "oldAndNewSame"}));
					$(".text-danger").html(msg);
					$(this).removeAttr("disabled");
					return false;
				}
				/*检测是否输入确认密码*/
				inpVal = $("#confirmPassword").val().replace(/\s/g,"");
				$("#confirmPassword").val(inpVal);
				if (inpVal == null || inpVal == undefined || inpVal == "") {
					msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "confirmPswNull"}));
					$(".text-danger").html(msg);
					$(this).removeAttr("disabled");
					return false;
				}
				/*检测确认密码是否与新密码相同*/
				if (inpVal != $("#newPassword").val()) {
					msg = JudgeAjax("get", "/v1.0/Api/Judge/ResetPasswordError", JSON.stringify({errname: "newAndConfirmNotMatch"}));
					$(".text-danger").html(msg);
					$(this).removeAttr("disabled");
					return false;
				}
				break;
		}
	})
	$(document).on("change",".passwordShow input",function () {
		switch ($(this)[0].name){
			case "oldPswShow":
				if ($("#oldPassword").attr("type") == "password") {
					$("#oldPassword").attr("type","text");
				} else{
					$("#oldPassword").attr("type","password");
				}
				break;
			case "newPswShow":
				if ($("#newPassword").attr("type") == "password") {
					$("#newPassword").attr("type","text");
				} else{
					$("#newPassword").attr("type","password");
				}
				break;
			case "confirmPswShow":
				if ($("#confirmPassword").attr("type") == "password") {
					$("#confirmPassword").attr("type","text");
				} else{
					$("#confirmPassword").attr("type","password");
				}
				break;
		}
	})
	/*修改语言模块*/
	var setLangListShow = false;
	$(document).on("click", ".EditName .setLangSelect .show", function () {
		if (!setLangListShow) {
			$(this).parent().find(".list").show();
		} else{
			$(this).parent().find(".list").hide();
		}
		setLangListShow = !setLangListShow;
	})
	$(document).on("click", ".EditName .setLangSelect .list li", function () {
		var setLangSelectShowEl = $(".EditName .setLangSelect .show");
		$(this).parent().parent().find(".show").html($(this).data().value + "<i></i>");
		if ($(this).data().lang != setLangSelectShowEl.data().lang) {
			$("#userLang").val($(this).data().lang);
		}else{
			$("#userLang").val("");
		}
		$(this).parent().hide();
		setLangListShow = !setLangListShow;
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
var VerifyCode = function (btnEl) {
	var obj = {
		IsEmailOrTelphone: $("#emailOrTelphone").val(),
		Code: $("#code").val(),
		graphic: $("#TMMVCode").val(),
		userNumber: $("#tempAccount").val(),
		graphic_token: window.sessionStorage.getItem("graphic_token"),
		__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
	}
	var returnStatus = null;
	$.ajax({
		type:"post",
		url:"/v1.0/Api/User/CheckVerificationCode",
		dataType: "json",
		data: obj,
		success: function (ret) {
			if (ret.status == "1") {
				returnStatus = "Successed";
			} else{
				returnStatus = "Failed";
				zwsoft.toast(ret.msg, "errorColor");
				if (ret.status == "2") {
					$("#TMMV_code img").attr("src", zwsoft.sendGraphicCode());
				}
			}
		},
		error: function (error) {
			console.log(error);
			returnStatus = "Failed";
		},
		async: false
	});
	return returnStatus;
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
var IsUsrExists = function (account) {
	var msg = null;
	var sendInfo = {
		accountNumber: account,
		__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
	}
	$.ajax({
		type:"post",
		url:"/v1.0/Api/User/IsUsrExists",
		dataType: "json",
		data: sendInfo,
		success: function (ret) {
			msg = ret;
		},
		error: function (error) {
			/*console.log(error);*/
			msg = "error";
		},
		async:false
	});
	return msg;
}