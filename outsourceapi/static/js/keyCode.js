$(function () {
	$(document).on("keydown",function (e) {
		if (e.keyCode == 13) {
			e.preventDefault();
		}
		var Route = $("#RouteData").val();
		console.log(Route);
		switch (Route){
			case "Login":
				var currentLocation = $("#enter").val();
				if (currentLocation == "username") {
					if (e.keyCode == 13) {
						$(".unameclick button").click();
					}
				}
				if (currentLocation == "password") {
					if (e.keyCode == 13) {
						$(".pswclick button").click();
					}
				}
				break;
			case "Register":
				var currentLocation = $("#currentLocation").val();
				if (e.keyCode == 13) {
					if (currentLocation == "code") {
						if ($("#Code").val() == "" || $(".SendCode").val() == "False") {
							return false;
						}
						CreateAccount();
					}else{
						$(".zwsoft-register-btn button").click();
					}
				}
				break;
			case "Security":
				if (e.keyCode == 13) {
					$("#securitySubmit").click();
				}
				break;
		}
	})
})