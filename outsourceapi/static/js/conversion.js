(function (doc, win) {
	var docEl = doc.documentElement,
		 userAgent = window.navigator.userAgent,
		 minwidth = null,maxwidth = null,
		/*手机旋转事件,大部分手机浏览器都支持 onorientationchange 如果不支持，可以使用原始的 resize*/
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth;
			var clientHeight = docEl.clientHeight;
			/*clientWidth: 获取对象可见内容的宽度，不包括滚动条，不包括边框*/
			if (userAgent.indexOf("Mobile") < 0 && userAgent.indexOf("Android") < 0 && userAgent.indexOf("iPad") < 0) {
				docEl.style.display = "block";
				return;
			}
			if (userAgent.indexOf("Macintosh") > -1) {
				if (!window.navigator.maxTouchPoints || window.navigator.maxTouchPoints <= 1) {
					docEl.style.display = "block";
					return;
				}
				minwidth = 320, maxwidth = 750;
			}
			if (userAgent.indexOf("Mobile") > -1) {
				minwidth = 320, maxwidth = 750;
			}
			if (userAgent.indexOf("Mobile") < 0 && userAgent.indexOf("Android") > -1) {
				minwidth = 320, maxwidth = 750;
			}
			if (userAgent.indexOf("iPad") > -1) {
				minwidth = 320, maxwidth = 750;
			}
			if (!clientWidth) return docEl.style.display = "block";
			if (clientHeight < 500 && clientHeight >= 440) {
				docEl.style.fontSize = 100 * (320 / maxwidth) + 'px';
				docEl.style.display = "block";
				return;
			}
			if (clientHeight < 440) {
				docEl.style.fontSize = 100 * (280 / maxwidth) + 'px';
				docEl.style.display = "block";
				return;
			}
			if (clientWidth < minwidth) {
				docEl.style.fontSize = 100 * (minwidth / maxwidth) + 'px';
				docEl.style.display = "block";
				return;
			}
			if (clientWidth > 600) {
				docEl.style.fontSize = 100 * (600 / maxwidth) + 'px';
				docEl.style.display = "block";
				return;
			}
			docEl.style.fontSize = 100 * (clientWidth / maxwidth) + 'px';
			docEl.style.display = "block";
		};	
		document.getElementsByTagName("head")[0].getElementsByTagName("title")[0].innerHTML = "Zwsoft ID";
		if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);