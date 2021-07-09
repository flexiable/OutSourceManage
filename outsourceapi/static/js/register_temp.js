var time_start = function () {
    var times = null, i = 0;
    clearInterval(times);
    times = setInterval(function () {
        if (i >= 2) {
	        i = 0;
	        clearInterval(times);
	        $(".loading").hide();
	        setTimeout(function () {
		        $(".loading").remove();
		        $("#register_temp").remove();
	        },1000);
        }
        i++;
    },1000);
}
time_start();