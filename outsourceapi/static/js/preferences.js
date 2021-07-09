/*更改语言*/
$("#changeLan").click(function () {
    $(this).parent().hide().siblings(".change-language").css("display","flex");
    var lan = $("input[name='language']").val();
    switch (lan) {
        case "简体中文":
            $("select[name='language']").val("zh-CN");
            break;
        case "English":
            $("select[name='language']").val("en-US");
            break;
    }
});
 /*保存语言*/
$("#saveLan").click(function () {
    /*获取选择的语言*/
    var selectedlan = $("select[name='language'] option:selected").val();
    if (selectedlan) {
    	$.ajax({
    		type:"post",
            url:"/v1.0/Api/User/modifyLanguage",
    		dataType: "json",
    		data: {
    			lan: selectedlan,
				__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
    		},
    		success: function (ret) {
    			if (parseInt(ret.status) == "1") {
	                $(".change-language").css("display", "none").siblings(".show-language").show();
	                switch (selectedlan) {
	                    case "zh-CN":
	                        $("input[name='language']").val("简体中文");
	                        $("span.language").text("简体中文");
	                        break;
	                    case "en-US":
	                        $("span.language").text("English");
	                        $("input[name='language']").val("English");
	                        break;
	                }
	                window.localStorage.setItem("lang", selectedlan);
	                window.location.reload();
	            } else {
	            	zwsoft.toast(ret.msg, "errorColor");
	            }
    		},
    		error: function (error) {
    			/*console.log(error);*/
    		},
    		async:true
    	});
    }
});


$(".btn-switch").on("click", "label", function () {
    if ($(this).siblings("input[type='checkbox']").prop("checked") == true) {
           /*关闭*/

    } else {
           /*开通*/
   
    }
})

