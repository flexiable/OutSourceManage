var userAgent = window.navigator.userAgent;
var token = window.sessionStorage.getItem("token");
var timeStamp = new Date().getTime();
var usrAgentStr = "PC", sentUsrAgentBol = true;
var linkDoms = '<link id="site_mobile" rel="stylesheet" href="/css/site_mobile.css?v='+timeStamp+'" />';
var linkPadDoms = '<link id="site_pad" rel="stylesheet" href="/css/site_pad.css?v='+timeStamp+'" />';
var QtWebShow = false;
if (userAgent.indexOf("Mobile") > -1 || userAgent.indexOf("Android") > -1) {
    $("#Jquery").before(linkDoms);
    usrAgentStr = "Mobile";
}
if (userAgent.indexOf("Mobile") < 0 && userAgent.indexOf("Android") > -1) {
	$("#Jquery").before(linkPadDoms);
    usrAgentStr = "Mobile";
}
if (userAgent.indexOf("iPad") > -1) {
	$("#Jquery").before(linkPadDoms);
    usrAgentStr = "Mobile";
}
if (userAgent.indexOf("Macintosh") > -1 && window.navigator.maxTouchPoints > 1) {
	$("#Jquery").before(linkPadDoms);
    usrAgentStr = "Mobile";
}


if (!(window.location.href.indexOf("Home/Error") > -1)) {
	if (userAgent.indexOf("MSIE 9.0") > -1 || userAgent.indexOf("MSIE 8.0") > -1 || userAgent.indexOf("MSIE 7.0") > -1 || userAgent.indexOf("MSIE 6.0") > -1 || userAgent.indexOf("MSIE 5.0") > -1) {
		window.location.href = "/Home/Error";
	}
}

var docHeight = window.innerHeight;


/*首次语言切换*/
var UrlInfo = window.location.href.split("?")[1];
var UrlInfoArr = UrlInfo && UrlInfo != "" ? UrlInfo.split("&") : "";
var langSession = null;
if (userAgent.indexOf("QtWebEngine") > -1) {
	langSession = window.sessionStorage.getItem("cacheLang");
} else {
	langSession = window.localStorage.getItem("lang");
}
var cacheLangSession = sessionStorage.getItem("cacheLang");
if (UrlInfo && UrlInfo.indexOf("lang") > -1 && document.cookie.indexOf(".AspNetCore.Culture") > 0) {
	for (let i in UrlInfoArr) {
		if (UrlInfoArr[i].indexOf("lang") > -1) {
			if (!langSession) {
				SLANG(UrlInfoArr[i].split("=")[1]);
			} else {
				if (langSession != UrlInfoArr[i].split("=")[1]) {
					SLANG(UrlInfoArr[i].split("=")[1]);
				}
			}
		}
	}
	QtWebShow = true;
} else {
	var cookie_lang = this.getCookieLangFn();
	if (cookie_lang != langSession) {
		SLANG(cookie_lang);
	}
	if (document.cookie.indexOf(".AspNetCore.Culture") < 0) {
		SLANG(cookie_lang);
	}
	QtWebShow = true;
}
function SLANG (lang) {
	$.ajax({
		type:"get",
		url:"/v1.0/Api/User/SetLanguage",
		dataType: "json",
		data: {changeLanguage: lang},
		success: function (res) {
			if (res.status == "1") {
				if (userAgent.indexOf("QtWebEngine") < 0) {
					window.localStorage.setItem("lang", lang);
				}
				var allcookies = document.cookie.split("; ");
				var cookie_lang = null;
				for (var i in allcookies) {
					if (allcookies[i].indexOf(".AspNetCore.Culture") > -1) {
						cookie_lang = allcookies[i].split("=")[1].split("%7C")[0].split("%3D")[1];
					}
				}
				sessionStorage.setItem("cacheLang", cookie_lang);
				if (userAgent.indexOf("QtWebEngine") < 0) {
					window.localStorage.setItem("lang", cookie_lang);
				}
				
				if (lochrefc.toLowerCase().indexOf("account") > -1) {
					window.location.replace(lochrefc);
				}
			}
		},
		error: function (error) {
			/*console.log(error);*/
		},
		async: true
	});
}
function getCookieLangFn() {
	var tmp_cookie_lang = null;
	if (document.cookie.indexOf(".AspNetCore.Culture") < 0) {
		tmp_cookie_lang = window.navigator.language || window.navigator.userLanguage;
		if (tmp_cookie_lang == "zh") {
			tmp_cookie_lang = "zh-CN";
		}
		if (tmp_cookie_lang == "en") {
			tmp_cookie_lang = "en-US";
		}
		if (tmp_cookie_lang != "zh-CN" && tmp_cookie_lang != "en-US") {
			tmp_cookie_lang = "en-US";
		}
	} else {
		var allcookies = document.cookie.split("; ");
		
		for (var i in allcookies) {
			if (allcookies[i].indexOf(".AspNetCore.Culture") > -1) {
				tmp_cookie_lang = allcookies[i].split("=")[1].split("%7C")[0].split("%3D")[1];
			}
		}
    }
	return tmp_cookie_lang;
}
$(function () {
	var tmpt = null;
	tmpt = setInterval(function () {
		if ($(".logoUrl")) {
			clearInterval(tmpt);
			$(".logoUrl").attr("href", window.location.origin);
		}
	}, 1000);
	if (sentUsrAgentBol) {
		sentUsrAgentBol = false;
		$.ajax({
			type:"get",
			url:"/v1.0/Api/User/getUsrAgent",
			dataType: "json",
			data: {usrAgentStr: usrAgentStr},
			async:true
		});
	}
	onWinResize();
	if (userAgent.indexOf("QtWebEngine") > -1) {
		var tmpTs = null;
		clearInterval(tmpTs);
		tmpTs = setInterval(function () {
			if (QtWebShow) {
				$("body").css("display", "flex");
				clearInterval(tmpTs);
			}
		}, 5)
	}
})

window.onkeyup = function (event) {
    if (event.keyCode == 123) {
        event.preventDefault();
    }
    if (event.ctrlKey && event.altKey && event.keyCode == 73) {
        event.preventDefault();
    }
}
window.onkeydown = function (event) {
    if (event.keyCode == 123) {
        event.preventDefault();
    }
    if (event.ctrlKey && event.altKey && event.keyCode == 73) {
        event.preventDefault();
    }
}
window.oncontextmenu = function (event) {
    if (event.button == 2) {
        event.preventDefault();
    }
}
window.onresize = function () {
	onWinResize();
}
function onWinResize () {
	var accountHomeEl = document.getElementsByClassName("accountHome")[0];
	var zwsoftRegisterEl = document.getElementsByClassName("zwsoft-register")[0];
	var zwsoftLoginEl = document.getElementsByClassName("zwsoft-login")[0];
	var zwsoftResetpasswordEl = document.getElementsByClassName("zwsoft-resetpassword")[0];
	var zwsoftRegisterEl = document.getElementsByClassName("zwsoft-register")[0];
	var containnerBodyEl = document.getElementsByClassName("containner-body")[0];
	console.log(zwsoftLoginEl);
	if (docHeight > 650) {
		if (
			userAgent.indexOf("Macintosh") > -1 && 
			(window.navigator.maxTouchPoints <= 1 || 
				window.navigator.maxTouchPoints == null || 
				window.navigator.maxTouchPoints == undefined)
		) {
			accountHomeEl ? accountHomeEl.removeAttribute("style") : "";
			zwsoftRegisterEl ? zwsoftRegisterEl.removeAttribute("style") : "";
			zwsoftLoginEl ? zwsoftLoginEl.removeAttribute("style") : "";
			zwsoftResetpasswordEl ? zwsoftResetpasswordEl.removeAttribute("style") : "";
			containnerBodyEl ? containnerBodyEl.removeAttribute("style") : "";
		}
		if (userAgent.indexOf("Windows") > -1 || userAgent.indexOf("QtWebEngine") > -1) {
			accountHomeEl ? accountHomeEl.removeAttribute("style") : "";
			zwsoftRegisterEl ? zwsoftRegisterEl.removeAttribute("style") : "";
			zwsoftLoginEl ? zwsoftLoginEl.removeAttribute("style") : "";
			zwsoftResetpasswordEl ? zwsoftResetpasswordEl.removeAttribute("style") : "";
			containnerBodyEl ? containnerBodyEl.removeAttribute("style") : "";
		}
		if (userAgent.indexOf("Mobile") < 0 && userAgent.indexOf("Android") > -1) {
			accountHomeEl ? accountHomeEl.removeAttribute("style") : "";
			zwsoftRegisterEl ? zwsoftRegisterEl.removeAttribute("style") : "";
			zwsoftLoginEl ? zwsoftLoginEl.removeAttribute("style") : "";
			zwsoftResetpasswordEl ? zwsoftResetpasswordEl.removeAttribute("style") : "";
			containnerBodyEl ? containnerBodyEl.removeAttribute("style") : "";
		}
	}
	if (docHeight <= 650 && docHeight >= 520) {
		if (
			userAgent.indexOf("Macintosh") > -1 && 
			(window.navigator.maxTouchPoints <= 1 || 
				window.navigator.maxTouchPoints == null || 
				window.navigator.maxTouchPoints == undefined)
		) {
			accountHomeEl ? accountHomeEl.style.padding = "0px" : "";
			zwsoftRegisterEl ? zwsoftRegisterEl.style.margin = "auto" : "";
			zwsoftLoginEl ? zwsoftLoginEl.style.margin = "auto" : "";
			zwsoftResetpasswordEl ? zwsoftResetpasswordEl.style.margin = "auto" : "";
			containnerBodyEl ? containnerBodyEl.removeAttribute("style") : "";
		}
		if (userAgent.indexOf("Windows") > -1 || userAgent.indexOf("QtWebEngine") > -1) {
			accountHomeEl ? accountHomeEl.style.padding = "0px" : "";
			zwsoftRegisterEl ? zwsoftRegisterEl.style.margin = "auto" : "";
			zwsoftLoginEl ? zwsoftLoginEl.style.margin = "auto" : "";
			zwsoftResetpasswordEl ? zwsoftResetpasswordEl.style.margin = "auto" : "";
			containnerBodyEl ? containnerBodyEl.removeAttribute("style") : "";
		}
		if (userAgent.indexOf("Mobile") < 0 && userAgent.indexOf("Android") > -1) {
			accountHomeEl ? accountHomeEl.style.padding = "0px" : "";
			zwsoftRegisterEl ? zwsoftRegisterEl.style.margin = "auto" : "";
			zwsoftLoginEl ? zwsoftLoginEl.style.margin = "auto" : "";
			zwsoftResetpasswordEl ? zwsoftResetpasswordEl.style.margin = "auto" : "";
			containnerBodyEl ? containnerBodyEl.removeAttribute("style") : "";
		}
	}
	if (docHeight < 520) {
		if (
			userAgent.indexOf("Macintosh") > -1 && 
			(window.navigator.maxTouchPoints <= 1 || 
				window.navigator.maxTouchPoints == null || 
				window.navigator.maxTouchPoints == undefined)
		) {
			accountHomeEl ? accountHomeEl.style.padding = "0px" : "";
			zwsoftRegisterEl ? zwsoftRegisterEl.style.margin = "auto" : "";
			zwsoftLoginEl ? zwsoftLoginEl.style.margin = "auto" : "";
			zwsoftResetpasswordEl ? zwsoftResetpasswordEl.style.margin = "auto" : "";
			containnerBodyEl ? containnerBodyEl.style.overflow = "auto" : "";
		}
		if (userAgent.indexOf("Windows") > -1 || userAgent.indexOf("QtWebEngine") > -1) {
			accountHomeEl ? accountHomeEl.style.padding = "0px" : "";
			zwsoftRegisterEl ? zwsoftRegisterEl.style.margin = "auto" : "";
			zwsoftLoginEl ? zwsoftLoginEl.style.margin = "auto" : "";
			zwsoftResetpasswordEl ? zwsoftResetpasswordEl.style.margin = "auto" : "";
			containnerBodyEl ? containnerBodyEl.style.overflow = "auto" : "";
		}
		if (userAgent.indexOf("Mobile") < 0 && userAgent.indexOf("Android") > -1) {
			accountHomeEl ? accountHomeEl.style.padding = "0px" : "";
			zwsoftRegisterEl ? zwsoftRegisterEl.style.margin = "auto" : "";
			zwsoftLoginEl ? zwsoftLoginEl.style.margin = "auto" : "";
			zwsoftResetpasswordEl ? zwsoftResetpasswordEl.style.margin = "auto" : "";
			containnerBodyEl ? containnerBodyEl.removeAttribute("style") : "";
		}
	}
}


