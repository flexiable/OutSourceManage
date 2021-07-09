var returnUrl = null;
$(function () {
	try {
		if ($("#loggedHidden").val() != null && $("#loggedHidden").val() != "") {
			returnUrl = $("#loggedHidden").val();
		} else {
			returnUrl = "/UserCenter";
		}
	} catch (e) {
		//TODO handle the exception
	
		returnUrl = "/UserCenter";
	}
	setTimeout(function (){
		sessionStorage.removeItem(".AspNetCore.Auth");
		window.location.href = returnUrl;
	},1200);
})