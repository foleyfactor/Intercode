var ref = new Firebase("https://intercoding.firebaseio.com");
$(document).ready(function(){
	if(ref.getAuth()){
		window.location.replace("learning.html");
	}
	$("#getstarted").on("click", function(){
		$('#signuparea').lightbox_me({
	        centered: true, 
	        onLoad: function() { 
	            $('#signuparea').find('input:first').focus()
            }
        });
	});

	$("#signup").on("click", function(){
		ref.createUser({
			email: $("#signemail").val(),
			password: $("#signpassword").val()
		}, function(error, userData){
		  if (error) {
		    console.log("Error creating user:", error);
		  } else {
		  	console.log("Signed up!")
		    ref.authWithPassword({
				email    : $("#signemail").val(),
				password : $("#signpassword").val()
			}, function(error, authData) {
				if (error) {
					console.log("Login Failed!", error);
				} else {
					window.location.replace("learning.html");
			  	}
			});
		  }
		});
	});

	$("#loginlink").on("click", function(){
		$("#signuparea").trigger("close");
		$("#loginarea").lightbox_me({
	        centered: true, 
	        onLoad: function() { 
	            $('#signuparea').find('input:first').focus()
            }
        });
	})

	$("#login").on("click", function(){
        ref.authWithPassword({
			email    : $("#logemail").val(),
			password : $("#logpassword").val()
		}, function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				window.location.replace("learning.html");
		  	}
		});
	});

	$("#resignup").on("click", function(){
		$("#loginarea").trigger("close");
		$("#signuparea").lightbox_me({
	        centered: true, 
	        onLoad: function() { 
	            $('#signuparea').find('input:first').focus()
            }
        });
	});
});