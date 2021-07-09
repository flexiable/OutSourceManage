var scroll_init = function () {
	var listsHeight = $("#SystemImage .box .content .ctent .lists").height();
	var scrollHeight = $("#SystemImage .box .content .ctent .scroll").height();
	var sliderHeight = Math.round(Math.pow(scrollHeight, 2) / listsHeight);
	var list_move = null;
	$("#SystemImage .box .content .ctent .scroll .slider").height(sliderHeight);
	$("#SystemImage .box .content .ctent .scroll .slider").show();
	/*滚轮*/
	$(document).on("wheel", "#SystemImage .box .content .ctent", function (event) {
		var delta = event.originalEvent.deltaY || event.originalEvent.detail;
		delta > 0 ? list_move += 50 : list_move -= 50;
		if (list_move <= 0) {
	    	list_move = 0;
	    }
	    if (list_move >= listsHeight - scrollHeight) {
	    	list_move = listsHeight - scrollHeight;
	    }
	    /*滚动条*/
	    $("#SystemImage .box .content .ctent .scroll .slider").css(
	    	"top",
	    	(sliderHeight * list_move / scrollHeight) + "px"
	    );
	    /*列表*/
	    $("#SystemImage .box .content .ctent .lists").css(
	    	"top",
	    	- list_move + "px"
	    );
	})
	/*拖动滚动条*/
	var sliderEl = null;
	var listEl = null;
	var tempY = null;
	var allowMouseMove = false;
	$(document).on("mousedown", "#SystemImage .box .content .ctent .scroll .slider", function (event) {
		sliderEl = event.target;
		tempY = event.clientY - sliderEl.offsetTop;
		allowMouseMove = true;
	})
	$(document).on("mousemove", "#SystemImage", function (event) {
		if (!allowMouseMove) {
			return false;
		}
		var moveY = event.clientY - tempY;
		if (moveY <= 0) {
			moveY = 0
		}
		if (moveY >= scrollHeight - sliderEl.offsetHeight) {
			moveY = scrollHeight - sliderEl.offsetHeight;
		}
		/*滚动条*/
		$("#SystemImage .box .content .ctent .scroll .slider").css(
	    	"top",
	    	moveY + "px"
	    );
	    /*列表*/
	   $("#SystemImage .box .content .ctent .lists").css(
	    	"top",
	    	-(moveY + Math.pow(moveY, 2) / sliderEl.offsetHeight) + "px"
	    );
	    list_move = moveY + Math.pow(moveY, 2) / sliderEl.offsetHeight;
	})
	$(document).on("mouseup", "#SystemImage", function (event) {
		allowMouseMove = false;
		sliderEl = null;
		tempY = null;
	})
}