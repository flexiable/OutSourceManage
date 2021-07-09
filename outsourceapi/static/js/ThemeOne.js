var userAgent = window.navigator.userAgent;
var timeStamps = new Date().getTime();
var linkDom;
var linkDoms = '<link id="site_mobile" rel="stylesheet" href="/css/site_mobile.css?v='+timeStamp+'" />';
$(function () {
	if (document.documentElement.offsetWidth > 750) {
		$("#site_mobile").remove();
		$("#ThemeOneMobile").remove();
		linkDom = '<link id="ThemeOnePC" rel="stylesheet" href="/css/ThemeOne_pc.css?v='+timeStamps+'" />';
		if (!$("#ThemeOnePC")[0]) {
			$("#Jquery").before(linkDom);
		}
		userAgentPC();
	}else{
		$("#ThemeOnePC").remove();
		linkDom = '<link id="ThemeOneMobile" rel="stylesheet" href="/css/ThemeOne_mobile.css?v='+timeStamps+'" />';
		if (!$("#site_mobile")[0]) {
			$("#Jquery").before(linkDoms);
		}
		if (!$("#ThemeOneMobile")[0]) {
			$("#Jquery").before(linkDom);
		}
		userAgentMobile();
	}
	
})
$(window).on("resize", function (e) {
	if (e.target.innerWidth > 750) {
		$("#site_mobile").remove();
		$("#ThemeOneMobile").remove();
		linkDom = '<link id="ThemeOnePC" rel="stylesheet" href="/css/ThemeOne_pc.css?v='+timeStamps+'" />';
		if (!$("#ThemeOnePC")[0]) {
			$("#Jquery").before(linkDom);
		}
		userAgentPC();
	} else{
		$("#ThemeOnePC").remove();
		linkDom = '<link id="ThemeOneMobile" rel="stylesheet" href="/css/ThemeOne_mobile.css?v='+timeStamps+'" />';
		if (!$("#site_mobile")[0]) {
			$("#Jquery").before(linkDoms);
		}
		if (!$("#ThemeOneMobile")[0]) {
			$("#Jquery").before(linkDom);
		}
		userAgentMobile();
	}
})
var userAgentMobile = function () {
	$(".signin-2").remove();
	$(".zwsoft-register .form-outset-2").remove();
	$(".container").addClass("mobile");
	$("#ThemeOne .zwsoft-resetpassword .zwsoft-resetpassword-box .right .row .col-sm-12 .text-danger-2").remove();
}
var userAgentPC = function () {
	$(".signin-1").remove();
	$(".zwsoft-register .row .col-sm-12 .form-outset, .zwsoft-resetpassword .row .col-sm-12 .form-outset").remove();
	$("#ThemeOne .zwsoft-resetpassword .zwsoft-resetpassword-box .right .row .col-sm-12 .text-danger-1").remove();
}