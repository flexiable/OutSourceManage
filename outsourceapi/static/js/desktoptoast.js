$(function () {
	var locStr = window.location.search.replace("?", "");
	var locArr = new Array();
	if (locStr.indexOf("&") > -1) {
		locArr = locStr.split("&");
	}else{
		locArr.push(locStr);
	}
	for (var itm of locArr) {
		if (itm.indexOf("tle") > -1) {
			var desktop_str = decodeURI(itm.split("=")[1]);
			zwsoft.toast(desktop_str, "successColor");
		}
	}
})