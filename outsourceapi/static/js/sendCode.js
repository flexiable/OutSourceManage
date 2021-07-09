var canSendCodeClick = true;
(function(zw, window) {
	/*获取验证码*/
	zw.SendIdentifycode = function(options) {
		/*
		 *	options值：
		 * 		countryCode:	国家代码
		 * 		accountNumber:	手机号或者是邮箱号
		 * 		graphic:		图形验证码
		 * 		btn:			按钮
		 * 		switchBtn:		切换账号按钮
		 * 
		 */
		var $this = this;
		if (!canSendCodeClick) {
			if ($("#SendCode")[0].className == "SendCodeActive") {
				return false;
			}
			$.ajax({
				type:"get",
				url:"/v1.0/Api/Judge/otherError",
				dataType: "json",
				data: {
					errorname: "fastgetcode"
				},
				success: function (ret) {
					$this.toast(ret.msg, "errorColor");
				},
				error: function (error) {
					console.log(error);
				},
				async: false
			});
			return false;
		}
		var accountNumber, IsEmailOrTelphone;
		var t = null, i = 60;
		canSendCodeClick = false;
		clearInterval(t);
		if(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(options.accountNumber)){
			accountNumber = options.accountNumber;
			IsEmailOrTelphone = "email";
		}else{
			/*accountNumber = options.countryCode + options.accountNumber;*/
			accountNumber = options.accountNumber;
			IsEmailOrTelphone = "telphone";
		}
		$.ajax({
			type: "post",
			url: "/v1.0/Api/User/SendIdentifycode",
			dataType: "json",
			data: {
				IsEmailOrTelphone: IsEmailOrTelphone,
				UserNumber: accountNumber,
				graphic: options.graphic,
				graphic_token: window.sessionStorage.getItem("graphic_token"),
				__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
			},
			success: function (ret) {
				if (ret.status == "1") {
					$this.toast(ret.msg, "successColor");
					sessionStorage.setItem("sendBtnTime_i", i);
					sessionStorage.setItem(".AspNetCore.AccountNumber", accountNumber);
					$this.sendBtnTime({
						time: t,
						i: i,
						btn: options.btn,
						switchBtn: options.switchBtn
					});
					$("#TMMV_code").attr("disabled", true);
					$(".TMMV label").css("cursor", "no-drop");
				} else {
					$this.toast(ret.msg, "errorColor");
					$("#TMMV_code img").attr("src", $this.sendGraphicCode());
					canSendCodeClick = true;
				}
			},
			error: function (error) {
				canSendCodeClick = true;
				/*console.error(error);*/
			},
			async: true
		});
	}
	/*获取验证码倒计时*/
	zw.sendBtnTime = function(obj){
		var btnHtml = obj.btn.html();
		var send_i;
		obj.time = setInterval(function () {
			obj.i--;
			send_i = sessionStorage.getItem("sendBtnTime_i");
			if (obj.i < 0) {
				clearInterval(obj.time);
				if (obj.switchBtn) {
					obj.switchBtn.removeClass("SwitchActive");
				}
				obj.btn.removeClass("SendCodeActive");
				canSendCodeClick = true;
				obj.btn.html(btnHtml);
				obj.btn.show();
				return false;
			}
			canSendCodeClick = false;
			if(Number(send_i) == 0){
				sessionStorage.setItem("sendBtnTime_i", 0);
			}else{
				sessionStorage.setItem("sendBtnTime_i", obj.i);
			}
			obj.btn.html(obj.i + "s");
			obj.btn.show();
			obj.btn.addClass("SendCodeActive");
			if (obj.switchBtn) {
				obj.switchBtn.addClass("SwitchActive");
			}
		}, 1000);
	}
	/*刷新页面后禁止短时间内快速获取验证码倒计时*/
	zw.disableBtnTime = function (obj) {
		var send_i;
		obj.time = setInterval(function () {
			obj.i--;
			send_i = sessionStorage.getItem("sendBtnTime_i");
			if (obj.i < 0) {
				clearInterval(obj.time);
				canSendCodeClick = true;
				return false;
			}
			canSendCodeClick = false;
			if(Number(send_i) == 0){
				sessionStorage.setItem("sendBtnTime_i", 0);
			}else{
				sessionStorage.setItem("sendBtnTime_i", obj.i);
			}
		}, 1000);
	}
	/*图形验证码*/
	zw.sendGraphicCode = function () {
		var imgSrc = null;
		$.ajax({
			type: "post",
			url: "/v1.0/Api/User/GetGraphicVerify",
			dataType: "json",
			data: {__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()},
			success: function (ret) {
				if(ret.status == "1"){
					imgSrc = ret.data.pic;
					$("#TMMVCode").attr("data-init", ret.data.piclength);
					$("#TMMVCode").attr("maxlength", ret.data.piclength);
					window.sessionStorage.setItem("graphic_token", ret.data.graphic_token);
				}else{
					$this.toast(ret.msg, "errorColor");
				}
			},
			error: function (error) {
				canSendCodeClick = true;
				/*console.log(error);*/
			},
			async: false
		});
		return imgSrc;
	}
})(zwsoft, window);
window.onload = function () {
	var send_i = sessionStorage.getItem("sendBtnTime_i");
	var sessionAccount = sessionStorage.getItem(".AspNetCore.AccountNumber");
	var IsFastClick = false;
	if (sessionAccount && sessionAccount != $("#tempAccount").val()) {
		sessionStorage.setItem("sendBtnTime_i", 0);
		send_i = 0;
	}
	if (send_i != null && send_i != "" && Number(send_i) > 0) {
		zwsoft.sendBtnTime({
			time: null,
			i: send_i,
			btn: $("#SendCode"),
			switchBtn: $("#SwitchAccount")? $("#SwitchAccount") : null
		});
	} else {
		$("#SendCode").show();
	}
	$(document).on("click", "#SwitchAccount", function (e) {
		var btnClass = $(this)[0].className;
		var accountAlt = null;
		if (btnClass == "SwitchActive") {
			return false;
		}
		if (IsFastClick) {
			return false;
		}
		IsFastClick = true;
		if ($(this).val() == "telphone") {
			accountAlt = $(".zwsoft-userNumber[name=email]").val();
		} else {
			accountAlt = $(".zwsoft-userNumber[name=telphone]").val();
		}
		if (/\：/.test(accountAlt)) {
			accountAlt = accountAlt.split("：")[0] + "：";
		} else{
			accountAlt = accountAlt.split(":")[0] + ":";
		}
		if ($(this).val() == "telphone") {
			$(this).val("email");
			$("#IsEmailOrTelphone").val("email");
			$("#tempAccount").val($("#Email").val());
			$(this).parent().find("span").text(accountAlt + $("#Email").val());
		} else{
			$(this).val("telphone");
			$("#IsEmailOrTelphone").val("telphone");
			$("#tempAccount").val($("#Telphone").val());
			$(this).parent().find("span").text(accountAlt + $("#Telphone").val());
		}
		$("#TMMV_code").removeAttr("disabled");
		$(".TMMV label").removeAttr("style");
		$("#TMMV_code img").attr("src", zwsoft.sendGraphicCode());
		$("#TMMVCode").val("");
		$(".TMMV i").removeClass();
		setTimeout(function () {
			IsFastClick = false;
		},500);
	})
	
	if (window.navigator.userAgent.indexOf("Mobile") < 0 && window.navigator.userAgent.indexOf("Android") < 0) {
	    $(".Mobile_TabBar").remove();
	}
}
/*SendIdentifycode*/