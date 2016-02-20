var ref = new Firebase("https://intercoding.firebaseio.com");
$(document).ready(function(){
	$("#getstarted").on("click", function(){
		$('#loginarea').lightbox_me({
	        centered: true, 
	        onLoad: function() { 
	            $('#loginarea').find('input:first').focus()
            }
        });
	});
	$("#signup").on("click", function(){
		console.log("heyo")
		ref.createUser({
			email: $("#email").val(),
			password: $("#password").val()
		}, function(error, userData){
		  if (error) {
		    console.log("Error creating user:", error);
		  } else {
		    console.log("Successfully created user account with uid:", userData.uid);
		  }
		});
	});
});