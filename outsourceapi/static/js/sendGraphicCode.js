$(function () {
	$("#TMMV_code img").attr("src", zwsoft.sendGraphicCode());
	$(document).on("click", "#TMMV_code", function (e) {
		$(this).find("img").attr("src", zwsoft.sendGraphicCode());
		$(this).parent().find("i").removeClass();
		$(this).parent().find("input").val("");
	})
	$(document).on("input", "#TMMVCode", function (e) {
		var $this = $(this);
		if ($this.val().length == $this.data().init) {
			$this.blur();
			$.ajax({
				type:"post",
				url:"/v1.0/Api/User/vgvc",
				dataType: "json",
				data:{
					graphicCode: $this.val(),
					graphic_token: window.sessionStorage.getItem("graphic_token"),
					__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
				},
				success: function (ret) {
					if (ret.status == "1") {
						$this.parent().find("i").removeClass();
						$this.parent().find("i").addClass("success");
						$this.parent().find("i svg use").attr("xlink:href", "#icon-through");
					}else{
						$this.parent().find("i").removeClass();
						$this.parent().find("i").addClass("error");
						$this.parent().find("i svg use").attr("xlink:href", "#icon-not-through");
					}
				},
				error: function (error) {
					/*console.log(error);*/
				},
				async:true
			});
		}else{
			$this.parent().find("i").removeClass();
		}
	})
})