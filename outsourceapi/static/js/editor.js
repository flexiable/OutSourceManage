$(function () {
	var msg = null;
	var lan;
	var tenYearTimestamp = 315619200000;
	var t = new Date()
	if (window.localStorage.lang == "zh-CN") {
		lan = "zh-CN";
	}
	console.log(new Date().getTime());
	 /**初始化日期控件**/
	$('.form_date').datepicker({
		language: lan,
		format: 'yyyy-mm-dd',
		orientation: "bottom auto",
		startDate: '1900-01-01',    //开始日期
		endDate: new Date(new Date(new Date().getFullYear() + "-12-31 23:59:59") - tenYearTimestamp),        //结束日期
		todayHighlight: true,
		autoclose: true,              //选择日期后，日期面板自动消失
		clearBtn: true
	});


	var linkIn = $("input[name='httpLinkedIn']").val();
	if (linkIn) {
		$("select.linkIn").val(linkIn);
	}

	var blogUrl = $("input[name='httpSelfBlog']").val();
	if (blogUrl) {
		$("select.blog").val(blogUrl);
	}

	var selfUrl = $("input[name='httpPersonalWebSite']").val();
	if (selfUrl) {
		$("select.websitePersonal").val(selfUrl);
	}



	/******显示联系地址****/
	var CountryName = $("input[name='CountryName']").val();
	var Province = $("input[name='Province']").val();
	var City = $("input[name='City']").val();
	var County = $("input[name='County']").val();


	if (Province == "-" || !Province) {
		$("#distpicker1").distpicker('reset', true);     /*重置select为初始状态*/
	} else {
		$("#distpicker1").distpicker({
			province: Province,
			city: City,
			district: County,
			autoclose: false
		});
	}
});


if ($("#countrySelect option:selected").val() == "China") {;
	$("input[name='CountryName']").val("中国");
}


/*$("#countrySelect").on("change", function () {
	if ($(this).val() == "China") {
		$("#distpicker1").show().siblings("#distpicker2").hide();
		$("input[name='CountryName']").val("中国");
	} else {
		$("input[name='CountryName']").val("");
		$("#distpicker1").hide().siblings("#distpicker2").show();
    } 
});
*/

/****监听性别值的变化****/
/*$("input[type='radio'][name='userSex']").change(function () {
	if (this.value == "male") {
		$("#Gender").val("male");
	} else {
		$("#Gender").val("female");
	}
});*/


/*监听英文名的输入*/
/*$("input[name='EnglishName']").on({
	"blur": function () {
		var nameVal = $(this).val().trim();
		//判断是否带有特殊符号^[a-zA-Z0-9]+\s?[\.·\-()a-zA-Z]*[a-zA-Z]+$
		var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？\u4e00-\u9fa5]");
		if (pattern.test(nameVal)) {
			msg = JudgeAjax("get", "/v1.0/Api/Judge/Editor", JSON.stringify({ errorname: "EnglishNameError" }));
			$(this).focus().siblings("span.warn-text").text(msg);
			return false;
		} else if (pattern.length > 75) {
			msg = JudgeAjax("get", "/v1.0/Api/Judge/Editor", JSON.stringify({ errorname: "英文名称长度不能超过75个字符" }));
			$(this).focus().siblings("span.warn-text").text(msg);
			return false;
		} else {
			$(this).siblings("span.warn-text").text("");
        }
    }
});*/
/*访问公用Api接口*/
var JudgeAjax = function (type, urls, data) {
	/*
	 * url："/v1.0/Api/Judge/RegisterError"
	 * data值(要传字符串json)：{errname: xxx}	
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
		async: false
	});
	return msg;
}

/*监听select下拉框值的变化*/
$("select").change(function () {
	var selected = $(this).val();
	$(this).prev("input").val(selected);     //给上一个兄弟节点赋值
});

/*监听空间链接地址的失去焦点事件*/
$("#tempLinkedIn").on({
	"blur": function () {
		if ($(this).val() && $(this).val() != "") {
			var headUrl = $(this).siblings("select").val();
			$("#httpLinkedIn").val(headUrl);
		}
    }
});

$("#tempSelfBlog").on({
	"blur": function () {
		if ($(this).val() && $(this).val() != "") {
			var headUrl = $(this).siblings("select").val();
			$("#httpSelfBlog").val(headUrl);
		}
	}
});

$("#tempPersonalWebSite").on({
	"blur": function () {
		if ($(this).val() && $(this).val() != "") {
			var headUrl = $(this).siblings("select").val();
			$("#httpPersonalWebSite").val(headUrl);
		}
	}
});

/*监听省市区三级联动地址值的变化*/
$("body").on("change", "#provinces",function () {
	$("input[name='Province']").val($(this).val());
	$("input[name='City']").val($("#citites").val());
	$("input[name='County']").val($("#area").val());
});

$("body").on("change", "#citites",function () {

	$("input[name='City']").val($(this).val());
	$("input[name='County']").val($("#area").val());
});

$("body").on("change", "#area",function () {
	$("input[name='County']").val($(this).val())
});

/*js监听页面滚动事件*/
$("div.zwsoft-editorInformation").on('scroll', function () {
	var input = document.getElementById("birthday");
	input.blur();
	$('.form_date').datepicker("hide");
});

/*监听行业下拉选择列表*/
$(document).on("change", ".IndustryList", function (e) {
	console.log($(this).val());
	var listIndex = $(this).val();
	if (listIndex == $("#Industrys").val().split(',').length - 1) {
		console.log("listindex: " + listIndex);
		$(this).next().val("");
		$(this).next().attr("type", "text");
	}else{
		$(this).next().attr("type", "hidden");
		$(this).next().val($("#Industrys").val().split(',')[listIndex]);
	}
})