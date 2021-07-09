$(function () {
	var SystemImageLabel = null;
	var SystemImageSrc = null;
	$(document).on("click", ".openSystemImage", function () {
		$("#SystemImage").css("display", "flex");
		/*if (window.navigator.userAgent.indexOf("Mobile") > -1 || window.navigator.userAgent.indexOf("Android") > -1 || window.navigator.userAgent.indexOf("iPad") > -1) {
			return false;
		}
		scroll_init();*/
	})
	$(document).on("click", ".systemImageClose", function () {
		$("#SystemImage").hide();
		$("#SystemImage .box .content .footer button").attr("disabled",true);
		SystemImageLabel ? SystemImageLabel.checked = false : '';
		SystemImageLabel = null;
		SystemImageSrc = null;
	})
	$(document).on("click", "#SystemImage .box .content .ctent .lists label", function (event) {
		SystemImageLabel = $(this)[0].querySelector("input");
		SystemImageSrc = $(this)[0].querySelectorAll("img")[0].src;
		$("#SystemImage .box .content .footer button").removeAttr("disabled");
	})
	$(document).on("click", "#sureSave", function (event) {
		var _this = $(this);
		_this.attr("disabled", true);
		$.ajax({
			type:"post",
			url:"/v1.0/Api/User/SetSystemImage",
			dataType: "json",
			data: {
				imageSrc: SystemImageSrc,
				__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
			},
			success: function (ret) {
				if (ret.status == "1") {
					zwsoft.toast(ret.msg, "successColor");
					setTimeout(function () {
						window.location.href = ret.data.returnUrl;
					},2000);
				} else{
					zwsoft.toast(ret.msg, "errorColor");
					_this.removeAttr("disabled");
				}
			},
			error: function (error) {
				/*console.log(error);*/
			},
			async:true
		});
	})
})