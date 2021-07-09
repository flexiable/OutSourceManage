var IsFastCreate = false, phoneAlt = null;
$(function () {
	var IsEmailOrTelphone = $("#IsEmailOrTelphone").val();
	var IsFirstClick = true,IsFastClick = false;
	var msg = null;
	phoneAlt = $(".phoneAlt").html();
	
	$(document).on('input',"#Telphone",function (e) {
		if (e.originalEvent.data == " ") {
			e.target.value = e.target.value.split(" ").join("");
			return false;
		}
		if (!/\d/.test(e.originalEvent.data)) {
			e.target.value = e.target.value.split(e.originalEvent.data).join("");
			return false;
		}
		$(this).find("+span").html("");
	})
	
	$(document).on("change","#pswShow",function () {
		if ($("#Password").attr("type") == "password") {
			$("#Password").attr("type","text");
		} else{
			$("#Password").attr("type","password");
		}
	})
	
	$(document).on("input", ".form-group input", function (e) {
		$(".text-danger").html("");
		if ($(".phoneAlt")) {
			$(".phoneAlt").removeAttr("style");
			$(".phoneAlt").html(phoneAlt);
		}
		if ($(this).attr("name") == "Email" || $(this).attr("id") == "Telphone") {
			$(".zwsoft-register-btn button").removeAttr("disabled");
		}
	})
	var userNumberEl = null;
	if (IsEmailOrTelphone == "email") {
		userNumberEl = "#Email";
	} else{
		userNumberEl = "#Telphone";
	}
	userNumberEl ? $(document).on("blur", userNumberEl, function (event) {
		/*检测是否输入合法的账号*/
		if (IsEmailOrTelphone == "email") {
			inpVal = $(this).val().replace(/\s/g,"");
			$(this).val(inpVal);
			if (inpVal == null || inpVal == undefined || inpVal == "") {
				msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "emailNameNull"}));
				$(".text-danger").html(msg);
				return false;
			}
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
		} else {
			inpVal = $(this).val().replace(/\s/g,"");
			$(this).val(inpVal);
			if (inpVal == null || inpVal == undefined || inpVal == "") {
				msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "phoneNameNull"}));
				$(".text-danger").html(msg);
				$(".text-danger").css("color", "#a94442");
				return false;
			}
			if (!(/^1[3456789]\d{9}$/.test(inpVal))) {
				msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "phoneFormatError"}));
				$(".text-danger").html(msg);
				$(".text-danger").css("color", "#a94442");
				return false;
			}
		}
		/*检测账号是否已被注册*/
		msg = IsUsrExists(inpVal);
		if (msg.status == "0") {
			$(".text-danger").html(msg.msg);
			return false;
		}
	}) : "";
	
	/*$(document).on("focus", "#Password", function () {
		$(this).attr("type", "password");
	})*/
	/*判断输入的注册账号是否合法*/
	$(document).on("click", ".zwsoft-register-btn button", function (e) {
		if (IsFirstClick) {
			var inpVal = null;
			if ($(this).val() == "Register") {
				if ($("#ClientId").val() != "Cadpockets") {
					/*检测是否填写了姓名*/
					inpVal = $("#lastname").val().replace(/\s/g,"");
					$("#lastname").val(inpVal);
					if (inpVal == null || inpVal == undefined || inpVal == "") {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "lastNameNull"}));
						$(".text-danger").html(msg);
						return false;
					}
					if (!(/[\u4e00-\u9fa5]/.test(inpVal))) {
						if (!(/^[a-z]+$/i.test(inpVal))) {
							msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "NameFormatError"}));
							$(".text-danger").html(msg);
							return false;
						}
					}
					inpVal = $("#firstname").val().replace(/\s/g,"");
					if (inpVal == null || inpVal == undefined || inpVal == "") {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "firstNameNull"}));
						$(".text-danger").html(msg);
						return false;
					}
					if (!(/[\u4e00-\u9fa5]/.test(inpVal))) {
						if (!(/^[a-z]+$/i.test(inpVal))) {
							msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "NameFormatError"}));
							$(".text-danger").html(msg);
							return false;
						}
					}
				}
				/*检测是否输入合法的账号*/
				if (IsEmailOrTelphone == "email") {
					inpVal = $("#Email").val().replace(/\s/g,"");
					$("#Email").val(inpVal);
					if (inpVal == null || inpVal == undefined || inpVal == "") {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "emailNameNull"}));
						$(".text-danger").html(msg);
						return false;
					}
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
				} else {
					inpVal = $("#Telphone").val().replace(/\s/g,"");
					$("#Telphone").val(inpVal);
					if (inpVal == null || inpVal == undefined || inpVal == "") {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "phoneNameNull"}));
						$(".text-danger").html(msg);
						$(".text-danger").css("color", "#a94442");
						return false;
					}
					if (!(/^1[3456789]\d{9}$/.test(inpVal))) {
						msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "phoneFormatError"}));
						$(".text-danger").html(msg);
						$(".text-danger").css("color", "#a94442");
						return false;
					}
				}
				/*检测账号是否已被注册*/
				msg = IsUsrExists(inpVal);
				if (msg.status == "0") {
					$(".text-danger").html(msg.msg);
					return false;
				}
				/*检测是否填写了密码*/
				inpVal = $("#Password").val().replace(/\s/g,"");
				$("#Password").val(inpVal);
				if (inpVal == null || inpVal == undefined || inpVal == "") {
					msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "pswNull"}));
					$(".text-danger").html(msg);
					return false;
				}
				if (inpVal.length < 6 || inpVal.length > 20) {
					msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "pswLengthError"}));
					$(".text-danger").html(msg);
					return false;
				}
				if (!(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[\^\!\@\#\$\%\&\*\(\)\_\-\=\+\/\?\.\,\<\>\;\:\~]).{6,20}$/).test(inpVal)) {
					msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "pswFormatError"}));
					$(".text-danger").html(msg);
					return false;
				}
				/*检测是否填写了验证码*/
				inpVal = $("#Code").val().replace(/\s/g,"");
				$("#Code").val(inpVal);
				if (inpVal == null || inpVal == undefined || inpVal == "") {
					msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "CodeNull"}));
					$(".text-danger").html(msg);
					return false;
				}
				if (!(/^\d+$/.test(inpVal))) {
					msg = JudgeAjax("get", "/v1.0/Api/Judge/RegisterError", JSON.stringify({errname: "CodeFormatError"}));
					$(".text-danger").html(msg);
					return false;
				}
				$(this).attr("disabled",true);
				CreateAccount($(this));
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
			accountNumber: $("#IsEmailOrTelphone").val() == "email"? $("#Email").val():$("#Telphone").val(),
			graphic: Graphic,
			btn: $(this),
			switchBtn: null
		}
		zwsoft.SendIdentifycode(opt);
	})
	if ($("#DeviceType").val() == "Mobile") {
		$(document).on("click", ".PrivacyShowBtn", function () {
			$(".PrivacyBox").css("display","flex");
		})
		$(document).on("click", ".cbtn", function () {
			$(".PrivacyBox").hide();
			$(".ServiceAgreementBox").hide();
		})
		$(document).on("click", ".ServiceAgreementShowBtn", function (event) {
			$(".ServiceAgreementBox").css("display","flex");
		})
	}
})
var JudgeAjax = function (type, urls, data) {
	/*
	 * url："/v1.0/Api/Judge/RegisterError"
	 * data值(要传字符串json)：{errname: xxx}	
	 * 			errname值：	emailNameNull（邮箱账号输入框为空）
	 * 						phoneNameNull（手机账号输入框为空）
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
var CreateAccount = function (btnEl) {
	var createInfo = {
		IsEmailOrTelphone: $("#IsEmailOrTelphone").val(),
		Code: $("#Code").val(),
		graphic: $("#TMMVCode").val(),
		userNumber: $("#IsEmailOrTelphone").val() == "email"? $("#Email").val():$("#Telphone").val(),
		countryCode: $("#IsEmailOrTelphone").val() == "email"? '':$("#countryCode").val(),
		Agreement: $("#Agreement")[0].checked,
		Password: $("#Password").val(),
		ClientId: $("#ClientId").val(),
		firstname: $("#firstname").val(),
		lastname: $("#lastname").val(),
		ReturnUrl: $("#ReturnUrl").val(),
		graphic_token: window.sessionStorage.getItem("graphic_token"),
		__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
	}
	$.ajax({
		type:"post",
		url:"/v1.0/Api/User/CreateAccount",
		dataType: "json",
		data: createInfo,
		success: function (ret) {
			if (ret.status == "1") {
				zwsoft.toast(ret.msg, "successColor");
				sessionStorage.setItem("sendBtnTime_i", 0);
				setTimeout(function () {
					window.location.href = ret.data.returnUrl;
				},3600);
			} else{
				zwsoft.toast(ret.msg, "errorColor");
				if (ret.status == "2") {
					$("#TMMV_code img").attr("src", zwsoft.sendGraphicCode());
				}
				btnEl.removeAttr("disabled");
			}
			setTimeout(function () {
				IsFastCreate = false;
			}, 500);
		},
		error: function (error) {
			/*console.log(error);*/
			IsFastCreate = false;
			btnEl.removeAttr("disabled");
		},
		async:true
	});
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