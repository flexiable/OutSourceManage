$(function () {
	var firstClick = true;
	var isFirst = true; 
	var click_btn = "";

	$(document).on("click", "#TabBar .checkbox button", function (e) {

		var _btn = $(this);
		var isEditor = $("#editorStatus").val();
		var submit_userinfo = new Object();
		if ($(this)[0].className == "active" && isEditor != "Editor") {
			return false;
		}
		if (isEditor == "Editor") {      /*是否离开编辑页面*/
			var userinfo = getEditorUserInfo(submit_userinfo);
			var result = VerifyEditorHasModified(userinfo);
			if (result.status == "1") {
				if (isFirst == true) {    
					$("#WarnTips").css("display", "flex");
					click_btn = _btn;
					return false;
				}
			}
		}
	
		if ($(this).val() == "SecurityButton") {
			/*判断是否为本次登录后首次进入安全设置管理*/
			if (firstClick) {
				if (sessionStorage.getItem(".AspNetCore.Auth")) {
					var tempAuths = JSON.parse(sessionStorage.getItem(".AspNetCore.Auth"));
					window.location.href = "/UserCenter/Security?tid=" + tempAuths.timer + "&IsAuth=" + encodeURIComponent(tempAuths.IsAuth);
					return false;
				}
			}
		}
	})
	$(document).on("click", ".zwsoft-editorInformation .submit-btn button[name=editorForm]", function () {
		var submit_userinfo = new Object();
		var userinfo = getEditorUserInfo(submit_userinfo);
		var result = VerifyEditorHasModified(userinfo);
		if (result.status == "0") {
			window.location.href = "/UserCenter";
			return false;
		}
	})
 
	$("button.goBack").click(function () {        /*点击关闭弹窗*/
		$("#WarnTips").css("display", "none");
	});

	$("button.sureToLeave").click(function () {      /*点击确认离开编辑页面按钮事件*/
		$("#WarnTips").css("display", "none");
		isFirst = false;
		click_btn.click();
	});

})

var getEditorUserInfo = function (obj) {
	obj["FirstName"] = $("#FirstName").val() != null && $("#FirstName").val() != "" ? $("#FirstName").val() : "";
	obj["LastName"] = $("#LastName").val() != null && $("#LastName").val() != "" ? $("#LastName").val() : "";
	obj["birthday"] = $("#birthday").val() != null && $("#birthday").val() != "" ? $("#birthday").val() : "";
	obj["LinkedIn"] = $("#tempLinkedIn").val() != null && $("#tempLinkedIn").val() != "" ? ($("#httpLinkedIn").val() + "://" + $("#tempLinkedIn").val()) : "";
	obj["SelfBlog"] = $("#tempSelfBlog").val() != null && $("#tempSelfBlog").val() != "" ? ($("#httpSelfBlog").val() + "://" + $("#tempSelfBlog").val()) : "";
	obj["PersonalWebSite"] = $("#tempPersonalWebSite").val() != null && $("#tempPersonalWebSite").val() != "" ? ($("#httpPersonalWebSite").val() + "://" + $("#tempPersonalWebSite").val()) : "";
	obj["CountryName"] = $("#CountryName").val() != null && $("#CountryName").val() != "" ? $("#CountryName").val() : "";
	obj["Province"] = $("#Province").val() != null && $("#Province").val() != "" ? $("#Province").val() : "";
	obj["City"] = $("#City").val() != null && $("#City").val() != "" ? ($("#City").val() + "-" + $("#County").val()) : "";
	obj["Street"] = $("#Street").val() != null && $("#Street").val() != "" ? $("#Street").val() : "";
	obj["Company"] = $("#Company").val() != null && $("#Company").val() != "" ? $("#Company").val() : "";
	obj["Industry"] = $("#Industry").val() != null && $("#Industry").val() != "" ? $("#Industry").val() : "";
	obj["Occupation"] = $("#Occupation").val() != null && $("#Occupation").val() != "" ? $("#Occupation").val() : "";
	obj["Introduce"] = $("#Introduce").val() != null && $("#Introduce").val() != "" ? $("#Introduce").val() : "";
	return obj;
	/*obj = {
		"Name": "",
		"EnglishName": "",
		"Email": "",
		"Phone": "",
		"Gender": "",
		"Motto": "",
		"PostalCode": "",
		"FullAddress": "",
		"Department": "",
		"Year": "",
		"Month": "",
		"Day": ""
	}*/
}
var VerifyEditorHasModified = function (user_info) {
	var obj;
	$.ajax({
		type: "post",
		url: "/v1.0/Api/User/VerifyEditorHasModified",
		dataType: "json",
		data: {
			submitUser: user_info,
			__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
		},
		success: function (ret) {
			obj = ret;
		},
		error: function (error) {
			/*console.log(error);*/
		},
		async: false
	});
	return obj;
}