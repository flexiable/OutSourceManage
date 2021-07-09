(function (doc, win) {
	var docEl = doc.documentElement,
		 userAgent = window.navigator.userAgent,
		 minwidth = 457,maxwidth = 640,
		/*手机旋转事件,大部分手机浏览器都支持 onorientationchange 如果不支持，可以使用原始的 resize*/
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth;
			var clientHeight = docEl.clientHeight;
			var lochref = window.location.href.toLowerCase();
			/*if (userAgent.indexOf("QtWebEngine") < 0 && lochref.indexOf("desktopapp") > -1) {
				window.location.replace("/");
				return;
			}*/
			if (!clientWidth) return docEl.style.display = "block";
			if (clientWidth < minwidth) {
				docEl.style.fontSize = 50 * (minwidth / maxwidth) + 'px';
				docEl.style.display = "block";
				return;
			}
			if (clientWidth > maxwidth) {
				docEl.style.fontSize = 50 * (maxwidth / maxwidth) + 'px';
				docEl.style.display = "block";
				return;
			}
			docEl.style.fontSize = 50 * (clientWidth / maxwidth) + 'px';
			docEl.style.display = "block";
		};	
		document.getElementsByTagName("head")[0].getElementsByTagName("title")[0].innerHTML = "Zwsoft ID";
		if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);