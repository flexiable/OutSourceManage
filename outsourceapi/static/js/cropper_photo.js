/*图像上传*/
$(".container").css("z-index", "2000");
$(".containner-body").css("z-index", "2000");
$(function () {
	$(".zwsoft-information").on("change", "#chooseImg", function (e) {
		var msg;
		var $this = $(this);
		if (!$(this)[0].files || !$(this)[0].files[0]){
			msg = JudgeAjax("get", "/v1.0/Api/Judge/uploadImageError", JSON.stringify({errname: "imageNone"}));
			zwsoft.toast(msg, "errorColor");
	        return false;
	   }
		var reader = new FileReader(); //创建FileReader对象实例reader
		reader.readAsDataURL($(this)[0].files[0]); //将图片url转换为base64码
		reader.onload = function(e){
				var newUrl = this.result;
				var baseHeader = newUrl.split(";base64,")[0].split(":")[1];
				var baseBody = newUrl.split(";base64,")[1];
				$("#tempImage").val(baseBody);
				$("#base64Image").val(baseBody);
				var imgResult = CompileImage(baseBody, baseHeader, $this[0].files[0].size);
				if (imgResult.imgUri == null) {
					zwsoft.toast(imgResult.msg, "errorColor");
					return false;
				}
				$('#tailoringImg').cropper('replace', imgResult.imgUri,false);/*默认false，适应高度，不失真*/
		}
	})
})
/*cropper图片裁剪*/
$('#tailoringImg').cropper({
    aspectRatio: 1/1,/*默认比例*/
    preview: '.previewImg',/*预览视图*/
    guides: false,  /*裁剪框的虚线(九宫格)*/
    autoCropArea: 0.5,  /*0-1之间的数值，定义自动剪裁区域的大小，默认0.8*/
    movable: false, /*是否允许移动图片*/
    dragCrop: true,  /*是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域*/
    movable: true,  /*是否允许移动剪裁框*/
    resizable: true,  /*是否允许改变裁剪框的大小*/
    zoomable: false,  /*是否允许缩放图片大小*/
    mouseWheelZoom: false,  /*是否允许通过鼠标滚轮来缩放图片*/
    touchDragZoom: true,  /*是否允许通过触摸移动来缩放图片*/
    rotatable: true,  /*是否允许旋转图片*/
    crop: function(e) {
        /*输出结果数据裁剪图像。*/
    }
});
/*右旋转*/
$(".right-rotate").on("click",function () {
    $('#tailoringImg').cropper("rotate", 45);
});
/*右旋转*/
$(".left-rotate").on("click",function () {
    $('#tailoringImg').cropper("rotate", -45);
});
/*复位*/
$(".cropper-reset-btn").on("click",function () {
    $('#tailoringImg').cropper("reset");
});
/*换向*/
var flagX = true;
$(".cropper-scaleX-btn").on("click",function () {
    if(flagX){
        $('#tailoringImg').cropper("scaleX", -1);
        flagX = false;
    }else{
        $('#tailoringImg').cropper("scaleX", 1);
        flagX = true;
    }
    flagX != flagX;
});

/*裁剪后的处理*/
$("#sureCut").on("click",function () {
    if ($("#tailoringImg").attr("src") == null ){
        return false;
    }else{
        var cas = $('#tailoringImg').cropper('getCroppedCanvas');/*获取被裁剪后的canvas*/
        var base64url = cas.toDataURL('image/png'); /*转换为base64地址形式*/
		var headerImgBase64 = base64url.split(";base64,")[1];
		$(".l-btn").attr("disabled", true);
		var updataResult = updateImage(headerImgBase64);
		if (updataResult == null) {
			zwsoft.toast("error", "errorColor");
		}
		if (updataResult.status == "1") {
			zwsoft.toast(updataResult.msg, "successColor");
			setTimeout(function () {
				window.location.href = updataResult.data.returnUrl;
			},2000);
		}else{
			$(".l-btn").removeAttr("disabled");
			zwsoft.toast(updataResult.msg, "errorColor");
		}
    }
});
/*关闭裁剪框*/
function closeTailor() {
    $(".tailoring-container").toggle();
    $(".container").removeAttr("style");
	$(".containner-body").removeAttr("style");
}
/*编译图片*/
var CompileImage = function (imgSrc, imgHeader, imgSize) {
	var imgUri = imgSrc;
	var msg = null;
	var formData = new FormData();
	formData.append("imgSrc", imgUri);
	formData.append("imgHeader", imgHeader);
	formData.append("size", imgSize);
	formData.append("__RequestVerificationToken", $("input[name=__RequestVerificationToken]").val());
	$.ajax({
		type:"post",
		url:"/v1.0/Api/User/CompileImage",
		mimeType: "multipart/form-data",
		cache: false,
		processData: false,
    	contentType: false,
		dataType: "json",
		data: formData,
		success: function (ret) {
			if (ret.status == "1") {
				msg = ret.msg;
				imgUri = ret.data.pic;
				$(".l-btn").removeAttr("disabled");
			} else {
				imgUri = null;
				msg = ret.msg;
			}
		},
		error: function (error) {
			"console.log(error);"
		},
		async: false
	});
	return {imgUri: imgUri, msg: msg};
}
/*上传图片*/
var updateImage = function (imgSrc) {
	var obj = new Object();
	$.ajax({
		type:"post",
		url:"/v1.0/Api/User/UpdataImage",
		dataType: "json",
		data: {
			imgSrc: imgSrc,
			__RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
		},
		success: function (ret) {
			obj = ret;
		},
		error: function (error) {
			/*console.log(error);*/
			obj = null;
		},
		async: false
	});
	return obj;
}
var JudgeAjax = function (type, urls, data) {
	/*
	 * url："/v1.0/Api/Judge/RegisterError"
	 * data值(要传字符串json)：{errname: xxx}	
	 * 			errname值：	imageNone (取消上传图片)
	 * 						imageToLarge （图片过大）
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